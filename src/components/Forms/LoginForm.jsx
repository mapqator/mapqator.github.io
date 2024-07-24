import React, { useState } from "react";
import AuthService from "@/services/authService";
import { LoadingButton } from "@mui/lab";
import { useRouter } from "next/navigation";
import config from "@/config/config";
import { LoginOutlined } from "@mui/icons-material";
import PasswordField from "@/components/InputFields/PasswordField";
import UserNameField from "@/components/InputFields/UserNameField";
export default function LoginForm() {
	const [username, setUserName] = useState("");
	const [password, setPassword] = useState("");
	const [loggingIn, setLoggingIn] = useState(false);
	const router = useRouter();
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!loggingIn) {
			// setLoading(true);
			setLoggingIn(true);

			const res = await AuthService.login({
				username: username,
				password: password,
			});
			if (res.success) {
				router.push(config.loginRedirect);
			} else {
				// setLoading(false);
				setLoggingIn(false);
			}
		}
	};
	return (
		<form className="space-y-4" onSubmit={handleSubmit}>
			<UserNameField
				label="Username"
				placeholder="username"
				onChange={(e) => setUserName(e.target.value)}
				value={username}
			/>
			<PasswordField
				placeholder="••••••••"
				onChange={(e) => setPassword(e.target.value)}
				value={password}
			/>
			<LoadingButton
				type="submit"
				className="w-full rounded-lg text-sm px-5 py-2.5 text-center font-medium"
				// onClick={handleSubmit}
				variant="contained"
				fullWidth
				loading={loggingIn}
				startIcon={<LoginOutlined />}
				loadingPosition="start"
			>
				Sign in
			</LoadingButton>
		</form>
	);
}
