import Api from "@/api/base";

class PlaceDetails extends Api {
	constructor() {
		if (new.target === PlaceDetails) {
			throw new TypeError(
				"Cannot construct PlaceDetails instances directly"
			);
		}
		super();
	}

	run = async (query) => {
		throw new Error("Method 'run()' must be implemented.");
	};

	getFields = () => {
		return [
			"location",
			"shortFormattedAddress",
			"accessibilityOptions",
			"businessStatus",
			"googleMapsUri",
			"primaryType",
			"internationalPhoneNumber",
			"nationalPhoneNumber",
			"priceLevel",
			"rating",
			"regularOpeningHours",
			"userRatingCount",
			"websiteUri",
			"allowsDogs",
			"curbsidePickup",
			"delivery",
			"dineIn",
			"editorialSummary",
			"evChargeOptions",
			"fuelOptions",
			"goodForChildren",
			"goodForGroups",
			"goodForWatchingSports",
			"liveMusic",
			"menuForChildren",
			"parkingOptions",
			"paymentOptions",
			"outdoorSeating",
			"reservable",
			"restroom",
			"servesBeer",
			"servesBreakfast",
			"servesBrunch",
			"servesCocktails",
			"servesCoffee",
			"servesDessert",
			"servesDinner",
			"servesLunch",
			"servesVegetarianFood",
			"servesWine",
			"takeout",
			"generativeSummary",
			"areaSummary",
		];
	};
}

export default PlaceDetails;

class GooglePlacesApiNew extends PlaceDetails {
	run = async (place_id) => {
		const apiCall = {
			url: "https://places.googleapis.com/v1/places/" + place_id,
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"X-Goog-FieldMask":
					"id,addressComponents,adrFormatAddress,formattedAddress,location,shortFormattedAddress,types,viewport,accessibilityOptions,businessStatus,displayName,googleMapsUri,primaryType,primaryTypeDisplayName,internationalPhoneNumber,nationalPhoneNumber,priceLevel,rating,regularOpeningHours.weekdayDescriptions,userRatingCount,websiteUri,allowsDogs,curbsidePickup,delivery,dineIn,goodForChildren,goodForGroups,goodForWatchingSports,liveMusic,menuForChildren,outdoorSeating,reservable,restroom,servesBeer,servesBreakfast,servesBrunch,servesCocktails,servesCoffee,servesDessert,servesDinner,servesLunch,servesVegetarianFood,servesWine,takeout",
				"X-Goog-Api-Key": "key:GOOGLE_MAPS_API_KEY",
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

	getFields = () => {
		return [
			"location",
			"shortFormattedAddress",
			"accessibilityOptions",
			"businessStatus",
			"googleMapsUri",
			"primaryType",
			"internationalPhoneNumber",
			"nationalPhoneNumber",
			"priceLevel",
			"rating",
			"regularOpeningHours",
			"userRatingCount",
			"websiteUri",
			"allowsDogs",
			"curbsidePickup",
			"delivery",
			"dineIn",
			"editorialSummary",
			"evChargeOptions",
			"fuelOptions",
			"goodForChildren",
			"goodForGroups",
			"goodForWatchingSports",
			"liveMusic",
			"menuForChildren",
			"parkingOptions",
			"paymentOptions",
			"outdoorSeating",
			"reservable",
			"restroom",
			"servesBeer",
			"servesBreakfast",
			"servesBrunch",
			"servesCocktails",
			"servesCoffee",
			"servesDessert",
			"servesDinner",
			"servesLunch",
			"servesVegetarianFood",
			"servesWine",
			"takeout",
		];
	};
}

class NominatimApi extends PlaceDetails {
	run = async (place_id) => {
		const apiCall = {
			url: "https://nominatim.openstreetmap.org/details",
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Accept-Language": "en",
			},
			params: {
				// osmtype: "W",
				format: "json",
				place_id: place_id,
				// format: "json",
			},
		};
		const epochId = Date.now(); // Unique ID for this tool call
		const response = await this.post("/map/cached", apiCall);

		if (response.success) {
			const details = {
				id: response.data.place_id,
				displayName: {
					text: response.data.names["name:en"],
				},
				location: {
					latitude: response.data.geometry.coordinates[1],
					longitude: response.data.geometry.coordinates[0],
				},
				regularOpeningHours: {
					weekdayDescriptions: response.data.extratags.opening_hours,
				},
				internationalPhoneNumber:
					response.data.extratags["contact:phone"],
				accessibilityOptions: {
					wheelchairAccessibleEntrance:
						response.data.extratags.wheelchair === "yes",
				},
				primaryType: response.data.type,
				websiteUri: response.data.extratags["contact:website"],
			};
			return {
				success: true,
				data: {
					result: details,
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

	getFields = () => {
		return [
			"location",
			"shortFormattedAddress",
			"accessibilityOptions",
			"primaryType",
			"internationalPhoneNumber",
			"regularOpeningHours",
			"websiteUri",
		];
	};
}

class MapBoxApi extends PlaceDetails {
	run = async (place_id) => {
		const apiCall = {
			url:
				"https://api.mapbox.com/search/searchbox/v1/retrieve/" +
				place_id,
			method: "GET",
			params: {
				access_token: "key:MAPBOX_ACCESS_TOKEN",
				session_token: "key:MAPBOX_SESSION_TOKEN",
			},
		};

		const epochId = Date.now(); // Unique ID for this tool call
		const response = await this.post("/map/cached", apiCall);

		if (response.success) {
			const e = response.data.features[0].properties;
			const details = {
				id: e.mapbox_id,
				displayName: {
					text: e.name,
				},
				shortFormattedAddress: e.full_address,
				location: {
					latitude: e.coordinates.latitude,
					longitude: e.coordinates.longitude,
				},
				types: e.poi_category_ids,
				accessibilityOptions: {
					wheelchairAccessibleEntrance:
						e.metadata.wheelchair_accessible,
				},
			};
			return {
				success: true,
				data: {
					result: details,
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

	getFields = () => {
		return ["location", "shortFormattedAddress", "accessibilityOptions"];
	};
}

class TomTomApi extends PlaceDetails {
	run = async (place_id) => {
		const apiCall = {
			url: "https://api.tomtom.com/search/2/place.json",
			method: "GET",
			params: {
				key: "key:TOMTOM_API_KEY",
				entityId: place_id,
				language: "en-US",
			},
		};

		const epochId = Date.now(); // Unique ID for this tool call
		const response = await this.post("/map/cached", apiCall);

		if (response.success) {
			const e = response.data.results[0];
			const details = {
				id: e.id,
				displayName: {
					text: e.poi.name,
				},
				internationalPhoneNumber: e.poi.phone,
				websiteUri: e.poi.url,
				shortFormattedAddress: e.address.freeformAddress,
				location: {
					latitude: e.position.lat,
					longitude: e.position.lon,
				},
				viewport: {
					low: {
						latitude: e.viewport.topLeftPoint.lat,
						longitude: e.viewport.topLeftPoint.lon,
					},
					high: {
						latitude: e.viewport.btmRightPoint.lat,
						longitude: e.viewport.btmRightPoint.lon,
					},
				},
			};
			return {
				success: true,
				data: {
					result: details,
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

	getFields = () => {
		return [
			"location",
			"shortFormattedAddress",
			"internationalPhoneNumber",
			"websiteUri",
		];
	};
}
export const list = {
	googleMaps: [
		{
			name: "Google Places API (New)",
			icon: "/images/google-maps.png",
			instance: new GooglePlacesApiNew(),
		},
	],
	openStreetMap: [
		{
			name: "Nominatim API",
			icon: "/images/openstreetmap.logo.png",
			instance: new NominatimApi(),
		},
	],

	mapbox: [
		{
			name: "Mapbox API",
			icon: "/images/mapbox.png",
			instance: new MapBoxApi(),
		},
	],

	tomtom: [
		{
			name: "TomTom API",
			icon: "/images/tomtom.png",
			instance: new TomTomApi(),
		},
	],
};
