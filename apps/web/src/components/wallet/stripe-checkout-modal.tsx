"use client";

import { useState, useEffect } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/stripe";
import { api } from "@/lib/api";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { formatCredits } from "@/lib/utils";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

interface StripeCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  credits: number;
  priceLabel: string;
  onSuccess: () => void;
}

interface ConfirmPaymentResponse {
  success: boolean;
  credits: number;
  newBalance: number;
}

function CheckoutForm({
  credits,
  priceLabel,
  onSuccess,
  onClose,
}: {
  credits: number;
  priceLabel: string;
  onSuccess: () => void;
  onClose: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard`,
      },
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message || "An error occurred with the payment");
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setMessage("Confirming payment...");
      
      try {
        // Use the paymentIntent.id directly from Stripe's response
        await api.post<ConfirmPaymentResponse>("/payments/confirm", {
          paymentIntentId: paymentIntent.id,
        });
        
        setIsSuccess(true);
        setMessage("Payment successful!");
        
        // Refresh balance and close
        setTimeout(async () => {
          await onSuccess();
          onClose();
        }, 1500);
      } catch (err) {
        console.error("Error confirming payment:", err);
        setMessage("Payment received but there was an error crediting tokens. Please contact support.");
        setIsProcessing(false);
      }
    } else {
      setMessage("Payment is being processed");
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <CheckCircle className="w-16 h-16 text-green-500" />
        <p className="text-xl font-heading">Payment Successful!</p>
        <p className="text-gray-600">
          {formatCredits(credits)} credits have been added to your account.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 bg-muted border-4 border-black mb-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Credits:</span>
          <span className="font-heading text-xl">{formatCredits(credits)}</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-gray-600">Price:</span>
          <span className="font-heading text-xl">{priceLabel}</span>
        </div>
      </div>

      <PaymentElement
        options={{
          layout: "tabs",
        }}
      />

      {message && (
        <div
          className={`p-3 border-4 border-black ${
            message.includes("error") || message.includes("Error")
              ? "bg-red-100 text-red-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {message}
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay ${priceLabel}`
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        Secure payments powered by Stripe. Test mode active.
      </p>
    </form>
  );
}

export function StripeCheckoutModal({
  isOpen,
  onClose,
  credits,
  priceLabel,
  onSuccess,
}: StripeCheckoutModalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [sessionKey, setSessionKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && credits > 0) {
      // Reset state and create new Payment Intent
      setClientSecret(null);
      setIsLoading(true);
      setError(null);

      api
        .post<{ clientSecret: string; paymentIntentId: string }>("/payments/create-intent", { credits })
        .then((data) => {
          setClientSecret(data.clientSecret);
          // Increment session key to force Elements remount
          setSessionKey((prev) => prev + 1);
        })
        .catch((err) => {
          console.error("Error creating payment intent:", err);
          setError("Error starting payment. Please try again.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    // Clean up on close
    if (!isOpen) {
      setClientSecret(null);
      setError(null);
    }
  }, [isOpen, credits]);

  const stripePromise = getStripe();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Complete Payment"
      size="md"
    >
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-gray-600">Starting secure payment...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <XCircle className="w-16 h-16 text-red-500" />
          <p className="text-red-600">{error}</p>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      ) : clientSecret ? (
        <Elements
          key={`stripe-elements-${sessionKey}`}
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: "stripe",
              variables: {
                colorPrimary: "#000000",
                colorBackground: "#ffffff",
                colorText: "#000000",
                colorDanger: "#ef4444",
                fontFamily: "system-ui, sans-serif",
                borderRadius: "0px",
              },
            },
          }}
        >
          <CheckoutForm
            credits={credits}
            priceLabel={priceLabel}
            onSuccess={onSuccess}
            onClose={onClose}
          />
        </Elements>
      ) : null}
    </Modal>
  );
}
