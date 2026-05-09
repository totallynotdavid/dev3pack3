import { CopyrightText } from "./copyright-text";

export function Footer() {
	return (
		<footer className="border-t border-border bg-muted/30 py-8">
			<div className="container mx-auto px-4">
				<div className="flex items-center justify-between">
					<p className="text-sm text-muted-foreground">
						<CopyrightText />
					</p>
					<p className="text-sm text-muted-foreground">Contract Trading Marketplace</p>
				</div>
			</div>
		</footer>
	);
}
