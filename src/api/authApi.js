import axios from "axios";

import Api, { API_BASE_URL } from "./base";

class AuthApi extends Api {
	login = async (data) => {
		try {
			console.log("POST: ", (API_BASE_URL + "/auth/login", data));
			let res = await axios.post(API_BASE_URL + "/auth/login", data);
			return {
				success: true,
				data: res.data,
			};
		} catch (err) {
			if (err.hasOwnProperty("response")) {
				return err.response.data;
			} else {
				return {
					success: false,
					error: "Can't connect to server",
				};
			}
		}
	};
}
const authApi = new AuthApi();
export default authApi;
