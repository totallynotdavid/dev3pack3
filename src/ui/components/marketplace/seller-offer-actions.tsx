"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/ui/components/ui/button";
import { Input } from "@/ui/components/ui/input";
import { Label } from "@/ui/components/ui/label";

interface SellerOfferActionsProps {
  contractId: string;
  offerId: string;
}

export function SellerOfferActions({ contractId, offerId }: SellerOfferActionsProps) {
  const router = useRouter();
  const [pending, setPending] = useState<"accept" | "reject" | "counter" | null>(null);
  const [showCounter, setShowCounter] = useState(false);
  const [counterValue, setCounterValue] = useState("");
  const [error, setError] = useState("");

  const act = async (action: "accept" | "reject" | "counter") => {
    setError("");
    setPending(action);

    const body: Record<string, unknown> = { action };
    if (action === "counter") {
      const parsed = parseFloat(counterValue);
      if (!parsed || parsed <= 0) {
        setError("Enter a valid counter amount");
        setPending(null);
        return;
      }
      body.counterAmount = Math.round(parsed * 100);
    }

    try {
      const res = await fetch(`/api/contracts/${contractId}/offers/${offerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Action failed");
      }

      setShowCounter(false);
      setCounterValue("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setPending(null);
    }
  };

  return (
    <div className="mt-4 border-t border-border pt-4">
      {error ? (
        <p className="mb-3 rounded-sm border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs font-medium text-destructive">
          {error}
        </p>
      ) : null}

      {showCounter ? (
        <div className="space-y-3">
          <div>
            <Label htmlFor={`counter-${offerId}`} className="text-xs">
              Counter Amount (USD)
            </Label>
            <Input
              id={`counter-${offerId}`}
              type="number"
              placeholder="e.g. 9500"
              value={counterValue}
              onChange={(e) => setCounterValue(e.target.value)}
              disabled={!!pending}
              step="0.01"
              min="0"
              className="mt-1"
            />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="brand"
              onClick={() => act("counter")}
              disabled={!!pending || !counterValue}
              className="flex-1"
            >
              {pending === "counter" ? "Sending…" : "Send Counter"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setShowCounter(false);
                setCounterValue("");
              }}
              disabled={!!pending}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            onClick={() => act("accept")}
            disabled={!!pending}
          >
            {pending === "accept" ? "Accepting…" : "Accept"}
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => act("reject")}
            disabled={!!pending}
          >
            {pending === "reject" ? "Rejecting…" : "Reject"}
          </Button>
          <Button
            size="sm"
            variant="outline-solid"
            onClick={() => setShowCounter(true)}
            disabled={!!pending}
          >
            Counter
          </Button>
        </div>
      )}
    </div>
  );
}
