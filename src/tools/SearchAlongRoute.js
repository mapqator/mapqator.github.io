import Api from "@/api/base";
import config from "@/config/config";
class SearchAlongRoute extends Api {
	constructor() {
		if (new.target === SearchAlongRoute) {
			throw new TypeError(
				"Cannot construct SearchAlongRoute instances directly"
			);
		}
		super();
	}

	run = async (query) => {
		throw new Error("Method 'run()' must be implemented.");
	};
}

export default SearchAlongRoute;

class GoogleRoutesApi extends SearchAlongRoute {
	constructor() {
		super();
		this.family = "googleMaps";
	}
	run = async (params) => {
		const apiCall1 = {
			url: "https://routes.googleapis.com/directions/v2:computeRoutes",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Goog-FieldMask":
					"routes.distanceMeters,routes.staticDuration,routes.description,routes.localizedValues,routes.optimized_intermediate_waypoint_index,routes.legs.steps.navigationInstruction,routes.legs.steps.transitDetails,routes.legs.localizedValues,routes.legs.steps.travelMode,routes.legs.steps.localizedValues,routes.legs.polyline,routes.polyline",
				"X-Goog-Api-Key": "key:GOOGLE_MAPS_API_KEY",
			},
			data: {
				origin: {
					location: {
						latlng: params.origin.location,
					},
				},
				destination: {
					location: {
						latlng: params.destination.location,
					},
				},
				travelMode: params.travelMode,
				intermediates: undefined,
				routeModifiers: {
					avoidTolls: ["DRIVE", "TWO_WHEELER"].includes(
						params.travelMode
					)
						? params.routeModifiers.avoidTolls
						: false,
					avoidHighways: ["DRIVE", "TWO_WHEELER"].includes(
						params.travelMode
					)
						? params.routeModifiers.avoidHighways
						: false,
					avoidFerries: ["DRIVE", "TWO_WHEELER"].includes(
						params.travelMode
					)
						? params.routeModifiers.avoidFerries
						: false,
					avoidIndoor: false,
				},
				transitPreferences: undefined,
				optimizeWaypointOrder: false,
				extraComputations:
					params.travelMode === "TRANSIT"
						? []
						: ["HTML_FORMATTED_NAVIGATION_INSTRUCTIONS"],
				units: "METRIC",
				languageCode: "en",
				routingPreference:
					params.travelMode === "WALK" ||
					params.travelMode === "BICYCLE" ||
					params.travelMode === "TRANSIT"
						? undefined
						: "TRAFFIC_UNAWARE",
				computeAlternativeRoutes: false,
			},
		};

		const response1 = await this.post("/map/cached", apiCall1);

		if (!response1.success) return { success: false };
		const apiCall2 = {
			url: "https://places.googleapis.com/v1/places:searchText",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Goog-FieldMask":
					"places.id,places.displayName,places.rating,places.priceLevel,places.shortFormattedAddress,places.userRatingCount,places.location",
			},
			data: {
				textQuery:
					params.searchBy === "type" ? params.type : params.keyword,
				rankPreference: params.rankPreference || "RELEVANCE", // DISTANCE/RELEVANCE/RANK_PREFERENCE_UNSPECIFIED
				includedType:
					params.searchBy === "type" ? params.type : undefined, // One type only
				minRating: params.minRating,
				priceLevels: params.priceLevels,
				maxResultCount: params.maxResultCount || 5,
				strictTypeFiltering: true,
				searchAlongRouteParameters: {
					polyline: {
						encodedPolyline:
							response1.data.routes[0].polyline.encodedPolyline,
					},
				},
				languageCode: "en",
			},
		};

		const response2 = await this.post("/map/cached", apiCall2);

		if (!response2.success) return { success: false };

		const epochId = Date.now();

		return {
			success: true,
			data: {
				route_response: response1.data,
				nearby_response: response2.data,
				apiCallLogs: [
					{
						...apiCall1,
						uuid: epochId,
						result: response1.data,
					},
					{
						...apiCall2,
						uuid: epochId,
						result: response2.data,
					},
				],
				uuid: epochId,
			},
		};
	};
}

export const list = {
	googleMaps: [
		{
			name: "Google Maps API (New)",
			icon: config.baseUrl + "/images/google-maps.png",
			instance: new GoogleRoutesApi(),
		},
	],
};
