/**
 * Brand Configuration
 *
 * Centralized branding settings for the storefront.
 * Update these values when customizing for a new store.
 *
 * @example
 * ```tsx
 * import { brandConfig } from "@/config/brand";
 *
 * <title>{brandConfig.siteName}</title>
 * <p>© {new Date().getFullYear()} {brandConfig.copyrightHolder}</p>
 * ```
 */

export const brandConfig = {
	/** Site name used in titles, metadata, and headers */
	siteName: "Marketplace",

	/** Legal entity name for copyright notices */
	copyrightHolder: "Marketplace Inc",

	/** Organization name for structured data (JSON-LD) */
	organizationName: "Marketplace",

	/** Tagline/description for the store */
	tagline: "Trade government contracts at the best rates. Secure, transparent, instant settlements.",

	/** Homepage meta description */
	description: "Buy and sell government contracts with pending payments. Competitive pricing through real-time negotiation.",

	/** Logo aria-label for accessibility */
	logoAriaLabel: "Marketplace",

	/** Title template - %s will be replaced with page title */
	titleTemplate: "%s | Marketplace",

	/** Social media handles */
	social: {
		/** Twitter/X handle (without @) - set to null to disable */
		twitter: null as string | null,
		/** Instagram handle (without @) - set to null to disable */
		instagram: null as string | null,
		/** Facebook page URL - set to null to disable */
		facebook: null as string | null,
	},
} as const;

/**
 * Helper to format page title using brand template.
 */
export function formatPageTitle(title: string): string {
	return brandConfig.titleTemplate.replace("%s", title);
}

/**
 * Get copyright text with specified year.
 * Use CopyrightText component for dynamic year in Server Components.
 */
export function getCopyrightText(year: number = new Date().getFullYear()): string {
	return `© ${year} ${brandConfig.copyrightHolder}. All rights reserved.`;
}
