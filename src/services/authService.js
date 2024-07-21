import authApi from "@/api/authApi";
import {
	addTokenToLocalStorage,
	removeTokenFromLocalStorage,
} from "@/api/base";
import { showError, showMessage, showSuccess } from "@/app/page";

const AuthService = {
	login: async (data) => {
		const res = await authApi.login(data);
		console.log(res);
		if (res.success) {
			addTokenToLocalStorage(res.data.access_token);
			showSuccess("Logged in successfully");
		} else {
			showError(res.error);
		}
		return res;
	},
	logout: async () => {
		const res = await authApi.logout();
		if (res.success) {
			removeTokenFromLocalStorage();
			showMessage("Logged out successfully", res);
		}
	},
};

export default AuthService;
