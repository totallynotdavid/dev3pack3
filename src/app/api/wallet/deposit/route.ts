import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import stripe from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount } = (await request.json()) as { amount: number };

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      metadata: {
        userId,
        type: "wallet_deposit",
      },
    });

    // For now, return a placeholder message
    // In production, you'd redirect to Stripe Checkout or use Stripe hosted checkout
    return NextResponse.json({
      checkoutUrl: `/api/wallet/deposit/session/${paymentIntent.id}`,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json({ error: "Failed to initiate deposit" }, { status: 500 });
  }
}
