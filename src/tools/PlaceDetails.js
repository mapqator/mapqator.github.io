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
				display_name: {
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
}

export const list = [
	{
		name: "Google Places API (New)",
		icon: "/images/google-maps.png",
		instance: new GooglePlacesApiNew(),
	},
	{
		name: "Nominatim API",
		icon: "/images/openstreetmap.logo.png",
		instance: new NominatimApi(),
	},
];
