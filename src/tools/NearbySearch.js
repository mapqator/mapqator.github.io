import Api from "@/api/base";

class NearbySearch extends Api {
	constructor() {
		if (new.target === NearbySearch) {
			throw new TypeError(
				"Cannot construct NearbySearch instances directly"
			);
		}
		super();
	}

	run = async (query) => {
		throw new Error("Method 'run()' must be implemented.");
	};
}

export default NearbySearch;

class GooglePlacesApiNew extends NearbySearch {
	run = async (params) => {
		const apiCall = {
			url: "https://places.googleapis.com/v1/places:searchText",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Goog-FieldMask":
					"places.id,places.displayName,places.formattedAddress,places.rating,places.priceLevel,places.shortFormattedAddress,places.userRatingCount,places.location,routingSummaries",
				"X-Goog-Api-Key": "key:GOOGLE_MAPS_API_KEY",
			},
			body: {
				textQuery: params.type + " " + params.keyword,
				rankPreference: params.rankPreference || "RELEVANCE", // DISTANCE/RELEVANCE/RANK_PREFERENCE_UNSPECIFIED
				includedType: params.type, // One type only
				minRating: params.minRating,
				priceLevels: params.priceLevels,
				maxResultCount: params.maxResultCount || 5,
				strictTypeFiltering: true,
				locationBias: {
					circle: {
						center: {
							latitude: params.lat,
							longitude: params.lng,
						},
						radius: 0,
					},
				},
				languageCode: "en",
				routingParameters: {
					origin: {
						latitude: params.lat,
						longitude: params.lng,
					},
					travelMode: "WALK",
				},
			},
		};
		const epochId = Date.now(); // Unique ID for this tool call
		const response = await this.post("/map/cached", apiCall);

		if (response.success) {
			return {
				success: true,
				data: {
					result: response.data,
					apiCallLogs: [
						{
							...apiCall,
							uuid: epochId,
							result: response.data,
						},
					],
					uuid: epochId,
				},
			};
		}
		return {
			success: false,
		};
	};
}

export const list = [
	{
		name: "Google Places API (New)",
		icon: "/images/google-maps.png",
		instance: new GooglePlacesApiNew(),
	},
];
