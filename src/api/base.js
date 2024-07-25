"use client";
import axios from "axios";
// import Cookies from "universal-cookie";
// import { API_BASE_URL } from "../index";
// const cookies = new Cookies();
console.log(process.env.NODE_ENV);
export const API_BASE_URL =
	(process.env.NEXT_PUBLIC_API_BASE_URL ||
		"https://mapquest-app.onrender.com") + "/api";

console.log("NEXT APP: ", API_BASE_URL);
import { jwtDecode } from "jwt-decode";

export const addTokenToLocalStorage = (access_token) => {
	localStorage.setItem("token", access_token);
	const event = new Event("storage");
	// Dispatch the event
	window.dispatchEvent(event);
};

export const isTokenValid = () => {
	const token = localStorage.getItem("token");
	if (token) {
		const decoded_token = jwtDecode(token);
		if (decoded_token) {
			return decoded_token.username !== undefined;
		}
	}
	return false;
};
export const getTokenFromLocalStorage = () => {
	const token = localStorage.getItem("token");
	if (token) {
		const decoded_token = jwtDecode(token);
		if (decoded_token) {
			return token;
		}
		logout();
	}
	return null;
};

export const getUserName = () => {
	const token = getTokenFromLocalStorage();
	if (!token) return "guest";
	return jwtDecode(token).username;
};

export const getGoogleMapsApiKey = () => {
	const token = localStorage.getItem("token");
	if (!token) return null;
	const key = localStorage.getItem("google_maps_api_key");
	return key;
};

export const removeTokenFromLocalStorage = () => {
	localStorage.removeItem("token");
	const event = new Event("storage");
	window.dispatchEvent(event);
};

const logout = () => {
	console.log("Redirect to login");
	// showError("Session expired. Please login again.");
	removeTokenFromLocalStorage();
	// window.location.href = config.logoutRedirect;
};

// axios.defaults.withCredentials = true;
axios.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		const apiKey = localStorage.getItem("google_maps_api_key");
		if (token && apiKey) {
			config.headers["google_maps_api_key"] = apiKey;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		let originalRequest = error.config;
		console.log(error.response);
		if (error.response.status === 401) {
			// Handle refresh token error or redirect to login
			console.log("Redirect to login");
			removeTokenFromLocalStorage();
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
