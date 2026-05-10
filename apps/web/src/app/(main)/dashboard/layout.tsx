import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getOrCreateUser } from "@/lib/db/queries/users";

async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Ensure user exists in database
  await getOrCreateUser(userId, "", "");

  return <>{children}</>;
}

export default DashboardLayout;
