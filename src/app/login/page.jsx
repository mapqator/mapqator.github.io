"use client";
import React, { useState, useEffect } from "react";
import AuthService from "@/services/authService";
import { FormControl, InputLabel, OutlinedInput, Button } from "@mui/material";
import EyeIcon from "@/components/Icons/EyeIcon";
// import { setLoading } from "@/page";
import { LoadingButton } from "@mui/lab";

const MuiTextField = (props) => {
	return (
		<FormControl fullWidth variant="outlined" size="small">
			<InputLabel>{props.label}</InputLabel>
			<OutlinedInput
				required
				placeholder={props.placeholder}
				type="text"
				value={props.value}
				onChange={props.onChange}
				label={props.label}
				size="small"
				fullWidth
			/>
		</FormControl>
	);
};

const MuiPasswordField = (props) => {
	const [showPassword, setShowPassword] = useState(false);
	return (
		<FormControl fullWidth variant="outlined" size="small">
			<InputLabel>{props.label}</InputLabel>
			<OutlinedInput
				required
				placeholder={props.placeholder}
				type={showPassword ? "text" : "password"}
				value={props.value}
				onChange={props.onChange}
				label={props.label}
				size="small"
				fullWidth
				endAdornment={
					<div>
						<EyeIcon
							isVisible={props.value.length > 0}
							showPassword={showPassword}
							setShowPassword={setShowPassword}
						/>
					</div>
				}
			/>
		</FormControl>
	);
};
const Login = () => {
	const [username, setUserName] = useState("");
	const [password, setPassword] = useState("");
	const [loggingIn, setLoggingIn] = useState(false);

	const handleSubmit = async () => {
		if (!loggingIn) {
			// setLoading(true);
			setLoggingIn(true);

			const res = await AuthService.login({
				username: username,
				password: password,
			});
			if (res.success) {
				// navigate("/");
			} else {
				// setLoading(false);
				setLoggingIn(false);
			}
		}
	};

	return (
		<>
			<div className="bg-gradient-to-r from-blue-100 to-green-100 w-full h-screen">
				<div className="flex flex-col items-center justify-center px-6 py-8 mx-auto gap-5 h-screen">
					<div className="bg-white w-full rounded-lg shadow-lg border md:mt-0 md:max-w-[24rem] xl:p-0 bu-card-secondary">
						<div className="p-6 space-y-4 sm:p-8">
							<h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl bu-text-primary">
								Sign in to your account
							</h1>
							<form className="space-y-4" onSubmit={handleSubmit}>
								<MuiTextField
									label="Username"
									placeholder=""
									onChange={(e) =>
										setUserName(e.target.value)
									}
									value={username}
								/>
								<MuiPasswordField
									label="Password"
									placeholder="••••••••"
									onChange={(e) =>
										setPassword(e.target.value)
									}
									value={password}
								/>
								<LoadingButton
									type="submit"
									className="w-full rounded-lg text-sm px-5 py-2.5 text-center font-medium"
									// onClick={handleSubmit}
									variant="contained"
									fullWidth
									loading={loggingIn}
								>
									Sign in
								</LoadingButton>
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Login;
