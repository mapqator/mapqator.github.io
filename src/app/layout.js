import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer, toast } from "react-toastify";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import ToastProvider from "./ToastProvider";
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
				<AppRouterCacheProvider>
					<ToastProvider>{children}</ToastProvider>
				</AppRouterCacheProvider>
			</body>
		</html>
	);
}
