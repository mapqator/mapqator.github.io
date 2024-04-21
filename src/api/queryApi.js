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
}
export default QueryApi;
