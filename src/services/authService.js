import authApi from "@/api/authApi";
import { showSuccess, showToast } from "@/app/console/home";

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
			localStorage.setItem("token", res.data.access_token);
			const event = new Event("storage");
			// Dispatch the event
			window.dispatchEvent(event);
			showSuccess("Logged in successfully", res);
		} else {
			showToast(res.error, "error");
		}
		return res;
	},
	logout: async () => {
		const res = await authApi.logout();
		if (res.success) {
			localStorage.removeItem("token");
			showToast("Logged out successfully");
		}
	},
};

export default AuthService;
