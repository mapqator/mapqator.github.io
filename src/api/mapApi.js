import Api from "./base";

class MapApi extends Api {
	getDetails = async (place_id) => {
		return await this.get("/map/details/" + place_id);
	};
	getNearby = async (params) => {
		return await this.get(
			"/map/nearby?lat=" +
				params.lat +
				"&lng=" +
				params.lng +
				(params.rankBy !== "distance"
					? "&radius=" + params.radius
					: "") +
				(params.type !== "" ? "&type=" + params.type : "") +
				(params.keyword !== "" ? "&keyword=" + params.keyword : "") +
				"&rankby=" +
				params.rankBy
		);
	};
	search = async (query) => {
		return await this.get("/map/search?query=" + query);
	};
	getDistance = async (origin, destination, mode) => {
		return await this.get(
			"/map/distance?origin=" +
				origin +
				"&destination=" +
				destination +
				"&mode=" +
				mode
		);
	};
}
export default MapApi;
