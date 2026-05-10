"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/ui/components/ui/button";
import { Input } from "@/ui/components/ui/input";
import { Label } from "@/ui/components/ui/label";

import { type RiskCategory } from "@/db/schema";

const selectClass =
  "flex h-11 w-full rounded-sm border border-border-strong bg-card px-4 py-2.5 text-base text-foreground shadow-sm transition-colors duration-150 ease-sentinel focus-visible:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/10 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm";

export function ContractForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState({
    debtorName: "",
    faceValue: "",
    currency: "USD",
    dueDate: "",
    riskCategory: "medium" as RiskCategory,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { debtorName, faceValue, currency, dueDate, riskCategory } = formData;

    if (!debtorName || !faceValue || !dueDate) {
      setError("Please fill in all required fields");
      return;
    }

    const faceValueNum = parseFloat(faceValue);
    if (isNaN(faceValueNum) || faceValueNum <= 0) {
      setError("Face value must be a positive number");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          debtorName,
          faceValue: Math.round(faceValueNum * 100),
          currency,
          dueDate: new Date(dueDate).toISOString(),
          riskCategory,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create contract");
      }

      const result = await response.json();
      router.push(`/marketplace/${result.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="debtorName">Debtor Name (Government Entity) *</Label>
        <Input
          id="debtorName"
          name="debtorName"
          value={formData.debtorName}
          onChange={handleChange}
          placeholder="e.g., Ministry of Health, Municipality of Lima"
          required
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <Label htmlFor="faceValue">Face Value *</Label>
          <Input
            id="faceValue"
            name="faceValue"
            type="number"
            step="0.01"
            min="0"
            value={formData.faceValue}
            onChange={handleChange}
            placeholder="Enter amount"
            required
          />
        </div>

        <div>
          <Label htmlFor="currency">Currency</Label>
          <select
            id="currency"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className={selectClass}
          >
            <option value="USD">USD</option>
            <option value="PEN">PEN (Soles)</option>
          </select>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <Label htmlFor="dueDate">Due Date *</Label>
          <Input
            id="dueDate"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="riskCategory">Risk Category</Label>
          <select
            id="riskCategory"
            name="riskCategory"
            value={formData.riskCategory}
            onChange={handleChange}
            className={selectClass}
          >
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
          </select>
        </div>
      </div>

      {error ? (
        <p className="rounded-sm border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm font-medium text-destructive">
          {error}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating…" : "Post Contract"}
      </Button>
    </form>
  );
}
