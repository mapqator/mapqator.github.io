import { Inter } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "MapQuest",
	description: "Map dataset creator",
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
