import { NextResponse } from "next/server";

export class WalletError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "WalletError";
  }
}

export class ValidationError extends WalletError {
  constructor(message: string) {
    super("VALIDATION_ERROR", message);
    this.name = "ValidationError";
  }
}

export class TransactionError extends WalletError {
  constructor(
    message: string,
    public txSignature?: string,
  ) {
    super("TRANSACTION_ERROR", message);
    this.name = "TransactionError";
  }
}

export class DatabaseError extends WalletError {
  constructor(message: string, details?: unknown) {
    super("DATABASE_ERROR", message, details);
    this.name = "DatabaseError";
  }
}

export class RpcError extends WalletError {
  constructor(message: string, details?: unknown) {
    super("RPC_ERROR", message, details);
    this.name = "RpcError";
  }
}

export function handleWalletError(error: unknown): NextResponse {
  if (error instanceof ValidationError) {
    return NextResponse.json({ error: error.message, code: error.code }, { status: 400 });
  }

  if (error instanceof TransactionError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        ...(error.txSignature && { txSignature: error.txSignature }),
      },
      { status: 402 },
    );
  }

  if (error instanceof RpcError) {
    return NextResponse.json({ error: error.message, code: error.code }, { status: 503 });
  }

  if (error instanceof DatabaseError) {
    console.error("Database error:", error.details);
    return NextResponse.json({ error: "Database error", code: error.code }, { status: 500 });
  }

  if (error instanceof WalletError) {
    return NextResponse.json({ error: error.message, code: error.code }, { status: 500 });
  }

  console.error("Unhandled error:", error);
  return NextResponse.json(
    { error: "Internal server error", code: "UNKNOWN_ERROR" },
    { status: 500 },
  );
}
