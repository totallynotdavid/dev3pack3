import { Header } from "@/ui/components/shared/header";
import { Footer } from "@/ui/components/shared/footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex min-h-screen flex-col">
			<Header />
			<main className="flex-1">{children}</main>
			<Footer />
		</div>
	);
}
