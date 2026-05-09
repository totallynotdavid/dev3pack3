import { NextRequest, NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import { depositFunds } from "@/lib/db/queries/wallet";
import { addToUserBalance } from "@/lib/db/queries/users";

export async function POST(request: NextRequest) {
	try {
		const body = await request.text();
		const signature = request.headers.get("stripe-signature");

		if (!signature) {
			return NextResponse.json({ error: "No signature" }, { status: 400 });
		}

		let event;
		try {
			event = stripe.webhooks.constructEvent(
				body,
				signature,
				process.env.STRIPE_WEBHOOK_SECRET!
			);
		} catch (err) {
			return NextResponse.json(
				{ error: "Webhook signature verification failed" },
				{ status: 400 }
			);
		}

		// Handle payment intent succeeded
		if (event.type === "payment_intent.succeeded") {
			const paymentIntent = event.data.object as any;
			const userId = paymentIntent.metadata.userId;
			const amount = paymentIntent.amount;

			if (userId) {
				// Credit user's wallet
				await addToUserBalance(userId, amount);

				// Record transaction
				await depositFunds(userId, amount, paymentIntent.id);
			}
		}

		return NextResponse.json({ received: true });
	} catch (error) {
		console.error("Webhook error:", error);
		return NextResponse.json(
			{ error: "Webhook processing failed" },
			{ status: 500 }
		);
	}
}
