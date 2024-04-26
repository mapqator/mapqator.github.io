import Api from "./base";

class GptApi extends Api {
  askGPT = async (id) => {
    return await this.get("/gpt/ask/" + id);
  };
}
export default GptApi;
