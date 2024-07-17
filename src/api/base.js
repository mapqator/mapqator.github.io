import axios from "axios";
// import Cookies from "universal-cookie";
// import { API_BASE_URL } from "../index";
// const cookies = new Cookies();
// export const API_BASE_URL = "https://mapquest-app.onrender.com/api";
export const API_BASE_URL = "http://localhost:5000/api";

// axios.defaults.withCredentials = true;
axios.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		let originalRequest = error.config;
		// If the error status is 401 and there is no originalRequest._retry flag,
		// it means the token has expired and we need to refresh it
		console.log("Retry:", originalRequest._retry);
		if (error.response.status === 401) {
			// Handle refresh token error or redirect to login
			console.log("Redirect to login");
			localStorage.removeItem("token");
			const event = new Event("storage");
			// Dispatch the event
			window.dispatchEvent(event);
		}
		return Promise.reject(error);
	}
);

export default class Api {
	/**
	 *
	 * @param {String} url
	 * @returns {Object} Either { success: true, data: string } or { success: false, error: string }
	 */
	get = async (url, query) => {
		// console.log(API_BASE_URL);
		// const token = this.getToken();
		// console.log("Profile Called" + token);
		try {
			const res = await axios.get(API_BASE_URL + url, { params: query });
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

	/**
	 *
	 * @param {String} url
	 * @param {Object} body
	 * @returns {Object} Either { success: true, data: string } or { success: false, error: string }
	 */
	post = async (url, body) => {
		// const token = this.getToken();
		try {
			const res = await axios.post(API_BASE_URL + url, body);
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

	/**
	 *
	 * @param {String} url
	 * @param {Object} body
	 * @returns {Object} Either { success: true, data: string } or { success: false, error: string }
	 */
	put = async (url, body) => {
		// const token = this.getToken();
		try {
			const res = await axios.put(API_BASE_URL + url, body);
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

	/**
	 *
	 * @param {String} url
	 * @returns {Object} Either { success: true, data: string } or { success: false, error: string }
	 */
	delete = async (url) => {
		// const token = this.getToken();
		try {
			const res = await axios.delete(API_BASE_URL + url);
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
