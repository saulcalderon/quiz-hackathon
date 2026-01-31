import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionType } from '@prisma/client';

// Prices in cents (USD)
const CREDIT_PACKAGES: Record<number, number> = {
  100: 100,   // 100 credits = $1.00
  500: 500,   // 500 credits = $5.00
  1000: 1000, // 1000 credits = $10.00
  2500: 2500, // 2500 credits = $25.00
};

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private stripe: Stripe | null = null;
  // Track processed payments to prevent double-crediting
  private processedPayments = new Set<string>();

  constructor(private readonly prisma: PrismaService) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (secretKey) {
      this.stripe = new Stripe(secretKey);
      this.logger.log('Stripe initialized successfully');
    } else {
      this.logger.warn('STRIPE_SECRET_KEY not set - Payments will be unavailable');
    }
  }

  private getStripe(): Stripe {
    if (!this.stripe) {
      throw new BadRequestException('Stripe is not configured');
    }
    return this.stripe;
  }

  async createPaymentIntent(userId: string, credits: number): Promise<{ clientSecret: string; paymentIntentId: string }> {
    const stripe = this.getStripe();

    // Validate credit package exists
    const priceInCents = CREDIT_PACKAGES[credits];
    if (!priceInCents) {
      throw new BadRequestException(`Invalid credit package: ${credits}`);
    }

    // Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: priceInCents,
      currency: 'usd',
      metadata: {
        userId,
        credits: credits.toString(),
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    this.logger.log(`Created PaymentIntent ${paymentIntent.id} for user ${userId}: ${credits} credits`);

    return {
      clientSecret: paymentIntent.client_secret!,
      paymentIntentId: paymentIntent.id,
    };
  }

  /**
   * Confirm payment - called by frontend after successful payment
   * This is the primary method for crediting tokens (works without webhook)
   */
  async confirmPayment(userId: string, paymentIntentId: string): Promise<{ success: boolean; credits: number; newBalance: number }> {
    const stripe = this.getStripe();

    // Check if already processed in memory (prevents double-calls in same session)
    if (this.processedPayments.has(paymentIntentId)) {
      this.logger.log(`Payment ${paymentIntentId} already processed in this session, skipping`);
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      return { success: true, credits: 0, newBalance: user?.balance ?? 0 };
    }

    // Retrieve Payment Intent from Stripe to verify
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Verify payment status
    if (paymentIntent.status !== 'succeeded') {
      throw new BadRequestException(`Payment not successful. Status: ${paymentIntent.status}`);
    }

    // Verify user matches
    if (paymentIntent.metadata.userId !== userId) {
      throw new BadRequestException('Payment does not belong to this user');
    }

    const credits = parseInt(paymentIntent.metadata.credits, 10);

    if (!credits || isNaN(credits)) {
      throw new BadRequestException('Invalid credits in payment metadata');
    }

    // Mark as processed BEFORE crediting to prevent race conditions
    this.processedPayments.add(paymentIntentId);

    // Credit the user
    const updatedUser = await this.creditUser(userId, credits, paymentIntentId);

    this.logger.log(`Payment ${paymentIntentId} confirmed: ${credits} credits added to user ${userId}`);

    return {
      success: true,
      credits,
      newBalance: updatedUser.balance,
    };
  }

  /**
   * Credit tokens to user and create transaction record
   */
  private async creditUser(userId: string, credits: number, paymentIntentId: string) {
    return await this.prisma.$transaction(async (tx) => {
      // Create transaction record (lobbyId is null for Stripe purchases)
      await tx.transaction.create({
        data: {
          userId,
          amount: credits,
          type: TransactionType.TOPUP,
          // lobbyId is null - will show as "Stripe Payment" in frontend
        },
      });

      // Update user balance
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          balance: { increment: credits },
        },
      });

      this.logger.log(`Balance updated for user ${userId}: +${credits} credits (new balance: ${updatedUser.balance})`);

      return updatedUser;
    });
  }

  async handleWebhook(payload: Buffer, signature: string): Promise<{ received: boolean }> {
    const stripe = this.getStripe();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      this.logger.warn('Webhook secret not configured - webhook handling disabled');
      return { received: true };
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err) {
      this.logger.error(`Webhook signature verification failed: ${err}`);
      throw new BadRequestException('Invalid webhook signature');
    }

    // Handle event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSuccessWebhook(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.payment_failed':
        this.handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
        break;
      default:
        this.logger.log(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
  }

  private async handlePaymentSuccessWebhook(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const { userId, credits } = paymentIntent.metadata;

    if (!userId || !credits) {
      this.logger.error('Missing metadata in PaymentIntent');
      return;
    }

    // Skip if already processed by confirm endpoint
    if (this.processedPayments.has(paymentIntent.id)) {
      this.logger.log(`Payment ${paymentIntent.id} already processed via confirm, skipping webhook`);
      return;
    }

    const creditAmount = parseInt(credits, 10);

    this.logger.log(`Webhook: Payment succeeded for user ${userId}: ${creditAmount} credits`);

    try {
      await this.creditUser(userId, creditAmount, paymentIntent.id);
      this.processedPayments.add(paymentIntent.id);
    } catch (error) {
      this.logger.error(`Failed to credit user via webhook: ${error}`);
    }
  }

  private handlePaymentFailure(paymentIntent: Stripe.PaymentIntent): void {
    const { userId, credits } = paymentIntent.metadata;
    this.logger.warn(`Payment failed for user ${userId}: ${credits} credits`);
  }
}
