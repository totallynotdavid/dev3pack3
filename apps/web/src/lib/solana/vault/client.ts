import {
  address,
  type Address,
  getProgramDerivedAddress,
  getAddressEncoder,
  AccountRole,
} from "@solana/kit";
import type { Instruction } from "@solana/kit";

export const VAULT_PROGRAM_ID = address("E2ktDEGKW32XkJ9RimNXapE4DKCPnwRnFc33MvrKnqmc");
const SYSTEM_PROGRAM_ID = address("11111111111111111111111111111111");

async function anchorDiscriminator(name: string): Promise<Uint8Array> {
  const input = new TextEncoder().encode(`global:${name}`);
  const hash = await crypto.subtle.digest("SHA-256", input);
  return new Uint8Array(hash.slice(0, 8));
}

let depositDiscriminator: Uint8Array | null = null;
let withdrawDiscriminator: Uint8Array | null = null;

export async function getVaultPda(userAddress: Address): Promise<Address> {
  const [pda] = await getProgramDerivedAddress({
    programAddress: VAULT_PROGRAM_ID,
    seeds: [new TextEncoder().encode("vault"), getAddressEncoder().encode(userAddress)],
  });
  return pda;
}

export async function buildDepositInstruction(
  signer: Address,
  vaultPda: Address,
  amount: bigint,
): Promise<Instruction> {
  if (!depositDiscriminator) depositDiscriminator = await anchorDiscriminator("deposit");

  const amountBytes = new Uint8Array(8);
  new DataView(amountBytes.buffer).setBigUint64(0, amount, true);

  const data = new Uint8Array(16);
  data.set(depositDiscriminator, 0);
  data.set(amountBytes, 8);

  return {
    programAddress: VAULT_PROGRAM_ID,
    accounts: [
      { address: signer, role: AccountRole.WRITABLE_SIGNER },
      { address: vaultPda, role: AccountRole.WRITABLE },
      { address: SYSTEM_PROGRAM_ID, role: AccountRole.READONLY },
    ],
    data,
  };
}

export async function buildWithdrawInstruction(
  signer: Address,
  vaultPda: Address,
): Promise<Instruction> {
  if (!withdrawDiscriminator) withdrawDiscriminator = await anchorDiscriminator("withdraw");

  return {
    programAddress: VAULT_PROGRAM_ID,
    accounts: [
      { address: signer, role: AccountRole.WRITABLE_SIGNER },
      { address: vaultPda, role: AccountRole.WRITABLE },
      { address: SYSTEM_PROGRAM_ID, role: AccountRole.READONLY },
    ],
    data: withdrawDiscriminator,
  };
}
