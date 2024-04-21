import Api from "./base";

class PlaceApi extends Api {
  getPlaces = async (query) => {
    return await this.get("/places", query);
  };
  getPlace = async (id) => {
    return await this.get(`/places/${id}`);
  };
  createPlace = async (body) => {
    return await this.post("/places", body);
  };
  updatePlace = async (id, body) => {
    return await this.put(`/places/${id}`, body);
  };
  deletePlace = async (id) => {
    return await this.delete(`/places/${id}`);
  };
}
export default PlaceApi;
