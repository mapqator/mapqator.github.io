import Api from "./base";

class GptApi extends Api {
	askGPT = async (id) => {
		return await this.get("/gpt/ask/" + id);
	};
	translate = async (context) => {
		return await this.post("/gpt/translate", { content: context });
	};
	askGPTLive = async (context, query) => {
		console.log(context, query);
		return await this.post("/gpt/ask", { context, query });
	};
}

const gptApi = new GptApi();
export default gptApi;
