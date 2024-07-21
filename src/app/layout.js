import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer, toast } from "react-toastify";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import ToastProvider from "./ToastProvider";
import ParentProvider from "./wrapper";
// import GlobalContextProvider from "../contexts/GlobalContext";
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
					{/* <ParentProvider> */}
					<ToastProvider>{children}</ToastProvider>
					{/* </ParentProvider> */}
				</AppRouterCacheProvider>
			</body>
		</html>
	);
}
