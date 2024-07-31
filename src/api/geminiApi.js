import Api from "./base";

class GeminiApi extends Api {
	askGeminiLive = async (context, query) => {
		console.log(context, query);
		return await this.post("/gemini/ask", { context, query });
	};
}

const geminiApi = new GeminiApi();
export default geminiApi;
