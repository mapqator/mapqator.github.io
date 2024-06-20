import { Inter } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	metadataBase: new URL("https://mahirlabibdihan.github.io/mapquest"),
	title: "MapQuest",
	description: "Map dataset creator",
	// openGraph: {
	// 	title: "Title webtsite",
	// 	description: "this is the desciption",
	// 	image: "url/image.png",
	// },
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<AppRouterCacheProvider>{children}</AppRouterCacheProvider>
			</body>
		</html>
	);
}
