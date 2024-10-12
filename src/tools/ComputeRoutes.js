import Api from "@/api/base";
import { distance } from "framer-motion";
import config from "@/config/config";

class ComputeRoutes extends Api {
	constructor() {
		if (new.target === ComputeRoutes) {
			throw new TypeError(
				"Cannot construct ComputeRoutes instances directly"
			);
		}
		super();
	}

	run = async (query) => {
		throw new Error("Method 'run()' must be implemented.");
	};
}

export default ComputeRoutes;

class GoogleRoutesApi extends ComputeRoutes {
	run = async (params) => {
		console.log("Google Routes API");
		const apiCall = {
			url: "https://routes.googleapis.com/directions/v2:computeRoutes",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Goog-FieldMask":
					"routes.distanceMeters,routes.staticDuration,routes.description,routes.localizedValues,routes.optimized_intermediate_waypoint_index,routes.legs.steps.navigationInstruction,routes.legs.steps.transitDetails,routes.legs.localizedValues,routes.legs.steps.travelMode,routes.legs.steps.localizedValues,routes.legs.polyline,routes.polyline",
				"X-Goog-Api-Key": "key:GOOGLE_MAPS_API_KEY",
			},
			body: {
				origin: {
					placeId: params.origin.id,
				},
				destination: {
					placeId: params.destination.id,
				},
				travelMode: params.travelMode,
				intermediates:
					params.travelMode !== "TRANSIT"
						? params.intermediates?.map((intermediate) => ({
								placeId: intermediate.id,
						  }))
						: undefined,
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
				transitPreferences:
					params.travelMode === "TRANSIT"
						? params.transitPreferences
						: undefined,
				optimizeWaypointOrder:
					params.intermediates.length > 0 &&
					params.travelMode !== "TRANSIT"
						? params.optimizeWaypointOrder
						: false,
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
				computeAlternativeRoutes:
					params.intermediates.length === 0
						? params.computeAlternativeRoutes === undefined
							? true
							: params.computeAlternativeRoutes
						: false,
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

	allowedTravelModes = ["DRIVE", "BICYCLE", "TWO_WHEELER", "WALK"];
	allowedParams = {
		intermediates: true,
		routeModifiers: true,
		computeAlternativeRoutes: true,
		optimizeWaypointOrder: true,
	};
}

// [car, car_delivery, car_avoid_ferry, car_avoid_motorway, car_avoid_toll, truck, small_truck, small_truck_delivery, scooter, scooter_delivery, bike, mtb, racingbike, foot, hike, as_the_crow_flies
function formatDuration(milliseconds) {
	const totalSeconds = Math.floor(milliseconds / 1000);
	const totalMinutes = Math.floor(totalSeconds / 60);
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;

	let result = "";
	if (hours > 0) {
		result += `${hours} hours `;
	}
	if (minutes > 0) {
		result += `${minutes} mins`;
	}
	if (result === "") {
		result = `${totalSeconds} seconds
		`;
	}
	return result.trim();
}

function formatDistance(meters) {
	if (meters < 1000) {
		return `${meters} m`;
	}
	const kilometers = meters / 1000;
	return `${kilometers} km`;
}

class GraphHopperApi extends ComputeRoutes {
	run = async (params) => {
		console.log("GraphHopper API");
		const apiCall = {
			url: "https://graphhopper.com/api/1/route",
			method: "POST",
			body: {
				points: [
					[
						params.origin.location.longitude,
						params.origin.location.latitude,
					],
					// Add intermediate points
					...params.intermediates.map((intermediate) => [
						intermediate.location.longitude,
						intermediate.location.latitude,
					]),
					[
						params.destination.location.longitude,
						params.destination.location.latitude,
					],
				],
				vehicle:
					params.travelMode == "DRIVE"
						? params.routeModifiers.avoidTolls
							? "car_avoid_toll"
							: params.routeModifiers.avoidFerries
							? "car_avoid_ferry"
							: params.routeModifiers.avoidHighways
							? "car_avoid_motorway"
							: "car"
						: params.travelMode == "BICYCLE"
						? "bike"
						: params.travelMode == "TWO_WHEELER"
						? "scooter"
						: "foot",
				locale: "en",
				instructions: true,
				points_encoded: true,
				weighting: "fastest",
				avoid: params.routeModifiers.avoidTolls
					? "toll"
					: params.routeModifiers.avoidHighways
					? "motorway"
					: params.routeModifiers.avoidFerries
					? "ferry"
					: undefined,
				algorithm:
					params.intermediates.length === 0 &&
					params.computeAlternativeRoutes
						? "alternative_route"
						: undefined,
				alternative_route: {
					max_paths: params.computeAlternativeRoutes ? 3 : 1,
				},
				optimize:
					params.intermediates.length > 0
						? params.optimizeWaypointOrder
						: false,
			},
			params: {
				key: "key:GRAPHHOPPER_API_KEY",
			},
		};

		const epochId = Date.now(); // Unique ID for this tool call
		const response = await this.post("/map/cached", apiCall);

		if (response.success) {
			const routes = response.data.paths.map((path) => {
				return {
					legs: [
						{
							// description: path.instructions,
							// legs: path.points.coordinates.map((point) => {
							// 	return {
							// 		polyline: point,
							// 	};
							// }),
							steps: path.instructions.map((instruction) => {
								return {
									navigationInstruction: {
										instructions: instruction.text,
									},
									// travelMode: instruction.type,
									localizedValues: {
										distance: {
											text: formatDistance(
												instruction.distance
											),
										},
										staticDuration: {
											text: formatDuration(
												instruction.time
											),
										},
									},
								};
							}),
							polyline: {
								encodedPolyline: path.points,
							},
							localizedValues: {
								distance: {
									text: formatDistance(path.distance),
								},
								staticDuration: {
									text: formatDuration(path.time),
								},
							},
						},
					],
					distanceMeters: path.distance,
					staticDuration: `${Math.round(path.time / 1000)}s`,
					polyline: {
						encodedPolyline: path.points,
					},
					localizedValues: {
						distance: {
							text: formatDistance(path.distance),
						},
						staticDuration: {
							text: formatDuration(path.time),
						},
					},
				};
			});
			return {
				success: true,
				data: {
					result: {
						routes: routes,
					},
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
	};

	allowedTravelModes = ["DRIVE", "BICYCLE", "TWO_WHEELER", "WALK"];

	allowedParams = {
		intermediates: true,
		routeModifiers: true,
		computeAlternativeRoutes: true,
		optimizeWaypointOrder: true,
	};
}

export const list = {
	googleMaps: [
		{
			name: "Google Routes API",
			icon: config.baseUrl + "/images/google-maps.png",
			instance: new GoogleRoutesApi(),
		},
	],
	openStreetMap: [
		{
			name: "GraphHopper API",
			icon: config.baseUrl + "/images/graphhopper.png",
			instance: new GraphHopperApi(),
		},
	],
};
