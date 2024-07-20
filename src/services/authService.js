import authApi from "@/api/authApi";
import {
	addTokenToLocalStorage,
	removeTokenFromLocalStorage,
} from "@/api/base";
import { showError, showSuccess } from "@/app/page";

const AuthService = {
	/**
	 *
	 * @param {Object} data - An object containing email, pass, and type properties.
	 * @param {string} data.email - The email address.
	 * @param {string} data.pass - The password.
	 * @param {string} data.type - The type of user (0-Problem Solver, 1-Problem Setter, 2-Admin).
	 * @returns {Object} Either { success: true } or { success: false, error: string }
	 */
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
			showSuccess("Logged out successfully");
		}
	},
};

export default AuthService;
