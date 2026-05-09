import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	const { searchParams } = request.nextUrl;
	const title = searchParams.get("title") || "Marketplace";
	const subtitle = searchParams.get("subtitle") || "Trade government contracts at the best rates";

	return new ImageResponse(
		(
			<div
				style={{
					height: "100%",
					width: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: "#FAF9F7",
					fontFamily: "system-ui, sans-serif",
				}}
			>
				<div
					style={{
						position: "absolute",
						inset: 0,
						backgroundImage: "radial-gradient(circle at 25px 25px, #E5E4DF 2px, transparent 0)",
						backgroundSize: "50px 50px",
						opacity: 0.5,
					}}
				/>

				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						padding: "60px",
						maxWidth: "80%",
						textAlign: "center",
					}}
				>
					<div
						style={{
							fontSize: "64px",
							fontWeight: "700",
							color: "#1A1A1A",
							lineHeight: 1.1,
							letterSpacing: "-0.03em",
							marginBottom: "20px",
						}}
					>
						{title}
					</div>

					<div
						style={{
							fontSize: "28px",
							color: "#737373",
						}}
					>
						{subtitle}
					</div>
				</div>
			</div>
		),
		{
			width: 1200,
			height: 630,
		},
	);
}
