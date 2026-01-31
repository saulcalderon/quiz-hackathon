import { Controller, Post, Body, Headers, Req, BadRequestException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import type { User } from '@prisma/client';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-intent')
  async createPaymentIntent(
    @CurrentUser() user: User,
    @Body() body: { credits: number },
  ) {
    if (!body.credits) {
      throw new BadRequestException('Credits amount is required');
    }
    return this.paymentsService.createPaymentIntent(user.id, body.credits);
  }

  /**
   * Confirm payment after Stripe confirms on frontend
   * This is the primary method for crediting tokens
   */
  @Post('confirm')
  async confirmPayment(
    @CurrentUser() user: User,
    @Body() body: { paymentIntentId: string },
  ) {
    if (!body.paymentIntentId) {
      throw new BadRequestException('Payment Intent ID is required');
    }
    return this.paymentsService.confirmPayment(user.id, body.paymentIntentId);
  }

  @Public()
  @Post('webhook')
  async handleWebhook(
    @Req() req: { rawBody?: Buffer },
    @Headers('stripe-signature') signature: string,
  ) {
    const rawBody = req.rawBody;
    
    if (!rawBody) {
      throw new BadRequestException('No raw body found');
    }
    
    if (!signature) {
      throw new BadRequestException('No Stripe signature found');
    }

    return this.paymentsService.handleWebhook(rawBody, signature);
  }
}
