const config = {
	baseUrl: process.env.NEXT_APP_BASE_URL
		? process.env.NEXT_APP_BASE_URL
		: process.env.NODE_ENV === "development"
		? ""
		: "https://mahirlabibdihan.github.io/mapqator",
	drawerWidth: 230,
	topbarHeight: 64,
	loginRedirect: "/home/context",
	logoutRedirect: "/login",
};

export default config;
