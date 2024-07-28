import PrimaryLayout from "@/components/Layouts/PrimaryLayout";
import LeftSidebar from "@/components/LeftSidebar";
import { useAuth } from "@/contexts/AuthContext";
import GlobalContextProvider from "@/contexts/GlobalContext";
import { Box, Container, Toolbar } from "@mui/material";
export const metadata = {
	title: "Home",
	description: "Home page of Mapquest",
};
export default function RootLayout({ children }) {
	return (
		<GlobalContextProvider>
			<PrimaryLayout>{children}</PrimaryLayout>
		</GlobalContextProvider>
	);
}
