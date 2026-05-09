"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/ui/components/ui/button";
import { Input } from "@/ui/components/ui/input";
import { Label } from "@/ui/components/ui/label";

interface OfferFormProps {
  contractId: string;
  faceValue: number;
}

export function OfferForm({ contractId, faceValue }: OfferFormProps) {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isSignedIn) {
      setError("Please sign in to make an offer");
      return;
    }

    const offerAmount = parseInt(amount) * 100; // Convert to cents

    if (!amount || offerAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (offerAmount > faceValue) {
      setError("Offer cannot exceed face value");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/contracts/${contractId}/offers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: offerAmount }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create offer");
      }

      setAmount("");
      router.refresh();
      // Show success message (could use toast)
      alert("Offer submitted successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) {
    return <div className="animate-pulse bg-muted h-32 rounded" />;
  }

  if (!isSignedIn) {
    return (
      <div className="text-center">
        <p className="mb-4 text-sm text-muted-foreground">Sign in to make an offer</p>
        <Button className="w-full" asChild>
          <a href="/sign-in">Sign In</a>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="amount">Offer Amount (USD)</Label>
        <Input
          id="amount"
          type="number"
          placeholder="Enter your offer"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={isLoading}
          step="0.01"
          min="0"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Max: {(faceValue / 100).toFixed(2)} USD
        </p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Submitting..." : "Submit Offer"}
      </Button>
    </form>
  );
}
