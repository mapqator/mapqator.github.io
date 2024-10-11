import Api from "@/api/base";

class TextSearch extends Api {
	constructor() {
		if (new.target === TextSearch) {
			throw new TypeError(
				"Cannot construct TextSearch instances directly"
			);
		}
		super();
	}

	run = async (query) => {
		throw new Error("Method 'run()' must be implemented.");
	};
}

class GooglePlacesApiNew extends TextSearch {
	run = async (query) => {
		const apiCall = {
			url: "https://places.googleapis.com/v1/places:searchText",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Goog-FieldMask":
					"places.id,places.displayName,places.shortFormattedAddress,places.location",
				"X-Goog-Api-Key": "key:GOOGLE_MAPS_API_KEY",
			},
			body: {
				textQuery: query,
				maxResultCount: 5,
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

class GooglePlacesApi extends TextSearch {
	run = async (query) => {
		const apiCall = {
			url: "https://maps.googleapis.com/maps/api/place/textsearch/json",
			method: "GET",
			params: {
				query: query,
				key: "key:GOOGLE_MAPS_API_KEY",
				language: "en",
			},
		};

		const epochId = Date.now(); // Unique ID for this tool call
		const response = await this.post("/map/cached", apiCall);

		if (response.success) {
			const places = response.data.results.map((place) => ({
				id: place.place_id,
				displayName: {
					text: place.name,
				},
				shortFormattedAddress: place.formatted_address,
				location: {
					latitude: place.geometry.location.lat,
					longitude: place.geometry.location.lng,
				},
			}));
			return {
				success: true,
				data: {
					result: { places },
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

class NominatimApi extends TextSearch {
	run = async (query) => {
		const apiCall = {
			url: "https://nominatim.openstreetmap.org/search",
			method: "GET",
			headers: {
				"Accept-Language": "en", // Add this header to request response in English
			},
			params: {
				q: query,
				format: "jsonv2",
				limit: 5,
			},
		};

		const epochId = Date.now(); // Unique ID for this tool call
		const response = await this.post("/map/cached", apiCall);

		if (response.success) {
			const places = response.data.map((place) => ({
				id: place.place_id,
				displayName: {
					text: place.name,
				},
				shortFormattedAddress: place.display_name,
				location: {
					latitude: parseFloat(place.lat),
					longitude: parseFloat(place.lon),
				},
			}));
			return {
				success: true,
				data: {
					result: { places },
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
	{
		name: "Google Places API",
		icon: "/images/google-maps.png",
		instance: new GooglePlacesApi(),
	},
	{
		name: "Nominatim API",
		icon: "/images/openstreetmap.logo.png",
		instance: new NominatimApi(),
	},
];

export default TextSearch;
