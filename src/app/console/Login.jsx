import React, { useState, useEffect } from "react";
import AuthService from "@/services/authService";
import { FormControl, InputLabel, OutlinedInput, Button } from "@mui/material";
import EyeIcon from "@/components/Icons/EyeIcon";
import { LoadingButton } from "@mui/lab";
import { showMessage } from "./home";

const MuiTextField = (props) => {
	return (
		<div className="no-ring-input">
			<FormControl fullWidth variant="outlined" size="small">
				<InputLabel
					htmlFor="outlined-adornment"
					// className="bu-text-primary"
					sx={
						{
							// "&.Mui-focused": {
							// 	color: "#000000 !important",
							// 	fontWeight: "bold",
							// },
						}
					}
				>
					{props.label}
				</InputLabel>
				<OutlinedInput
					required
					placeholder={props.placeholder}
					id="outlined-adornment"
					className="outlined-input"
					type="text"
					value={props.value}
					onChange={props.onChange}
					label={props.label}
					size="small"
					fullWidth
					// sx={{
					// 	// color: "white",
					// 	".MuiOutlinedInput-notchedOutline": {
					// 		borderColor: "#1c5b5f",
					// 		borderRadius: ".4rem",
					// 	},
					// 	"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
					// 		borderColor: "#1c5b5f",
					// 		borderWidth: ".2rem",
					// 		borderRadius: ".4rem",
					// 	},
					// 	"&:hover .MuiOutlinedInput-notchedOutline": {
					// 		borderColor: "#1c5b5f",
					// 	},
					// 	"&.Mui-focused": {
					// 		color: "#000000 !important",
					// 	},
					// }}
				/>
			</FormControl>
		</div>
	);
};

const MuiPasswordField = (props) => {
	const [showPassword, setShowPassword] = useState(false);
	return (
		<div className="no-ring-input">
			<FormControl fullWidth variant="outlined" size="small">
				<InputLabel
					htmlFor="outlined-adornment"
					// className="bu-text-primary"
					// sx={{
					// 	"&.Mui-focused": {
					// 		color: "#000000 !important",
					// 		fontWeight: "bold",
					// 	},
					// }}
				>
					{props.label}
				</InputLabel>
				<OutlinedInput
					required
					placeholder={props.placeholder}
					id="outlined-adornment"
					className="outlined-input"
					type={showPassword ? "text" : "password"}
					value={props.value}
					onChange={props.onChange}
					label={props.label}
					size="small"
					fullWidth
					// sx={{
					// 	// color: "white",
					// 	".MuiOutlinedInput-notchedOutline": {
					// 		borderColor: "#1c5b5f",
					// 		borderRadius: ".4rem",
					// 	},
					// 	"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
					// 		borderColor: "#1c5b5f",
					// 		borderWidth: ".2rem",
					// 		borderRadius: ".4rem",
					// 	},
					// 	"&:hover .MuiOutlinedInput-notchedOutline": {
					// 		borderColor: "#1c5b5f",
					// 	},
					// 	"&.Mui-focused": {
					// 		color: "#000000 !important",
					// 	},
					// }}
					endAdornment={
						<div className="bu-text-primary">
							<EyeIcon
								isVisible={props.value.length > 0}
								showPassword={showPassword}
								setShowPassword={setShowPassword}
							/>
						</div>
					}
				/>
			</FormControl>
		</div>
	);
};
const Login = () => {
	const [username, setUserName] = useState("");
	const [password, setPassword] = useState("");
	const [loggingIn, setLoggingIn] = useState(false);

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
				// navigate("/");
			} else {
				// setLoading(false);
				// showMessage("Invalid Credentials", "error");
			}
		}
	};

	useEffect(() => {
		// setLoading(false);
	}, []);
	return (
		<>
			<div className="bg-white w-full md:w-1/2 h-screen">
				<div className="flex flex-col items-center justify-center px-6 py-8 mx-auto gap-5 h-screen">
					<div className="w-full rounded-lg shadow-lg border md:mt-0 md:max-w-md xl:p-0 bu-card-secondary">
						<div className="p-6 space-y-6 md:space-y-6 sm:p-10">
							<h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl bu-text-primary">
								Sign in to your account
							</h1>
							<form
								className="space-y-4 md:space-y-6"
								onSubmit={handleSubmit}
							>
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
