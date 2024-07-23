import { Inter } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import ToastProvider from "./ToastProvider";
import AuthContextProvider from "@/contexts/AuthContext";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	metadataBase: new URL("https://mahirlabibdihan.github.io/mapquest"),
	title: {
		template: "%s | MapQuest",
		default: "MapQuest",
	},

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
				<AppRouterCacheProvider>
					<AuthContextProvider>
						<ToastProvider>{children}</ToastProvider>
					</AuthContextProvider>
				</AppRouterCacheProvider>
			</body>
		</html>
	);
}
