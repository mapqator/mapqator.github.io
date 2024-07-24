import Api from "./base";

class GptApi extends Api {
	askGPT = async (id) => {
		return await this.get("/gpt/ask/" + id);
	};
	translate = async (context) => {
		return await this.post("/gpt/translate", { content: context });
	};
}

const gptApi = new GptApi();
export default GptApi;
