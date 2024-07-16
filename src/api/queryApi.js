import Api from "./base";

class QueryApi extends Api {
	getQueries = async (query) => {
		return await this.get("/queries", query);
	};
	getQuery = async (id) => {
		return await this.get(`/queries/${id}`);
	};
	createQuery = async (body) => {
		return await this.post("/queries", body);
	};
	updateQuery = async (id, body) => {
		return await this.put(`/queries/${id}`, body);
	};
	deleteQuery = async (id) => {
		return await this.delete(`/queries/${id}`);
	};
	getGPTContext = async (context) => {
		console.log(context);
		return await this.post("/queries/gpt/context", { content: context });
	};
	annotate = async (query_id, human) => {
		return await this.post("/queries/annotate/" + query_id, human);
	};
}
export default QueryApi;
