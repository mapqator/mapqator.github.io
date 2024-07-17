"use client";
import { useContext, useEffect, useState } from "react";
import {
	Box,
	Container,
	Typography,
	Stepper,
	Step,
	StepLabel,
	StepContent,
	Button,
	Paper,
	Card,
} from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsIcon from "@mui/icons-material/Directions";
import PlaceIcon from "@mui/icons-material/Place";
import Image from "next/image";
// import { AreaIcon } from "@material-ui/icons";

import { AppBar, Toolbar } from "@mui/material";
import HybridSearch, { AutocompleteSearchBox } from "../HybridSearch";
import { GlobalContext } from "@/contexts/GlobalContext";
import PlaceInformation from "../PlaceInformation";
import NearbyInformation, { NearbyInfo } from "../NearbyInformation";
import POI, { DiscoverArea } from "../POI";
import DistanceInformation, { CalculateDistance } from "../DistanceInformation";
import DirectionInformation, { GetDirections } from "../DirectionInformation";
import ContextPreview, { ContextViewer } from "../ContextPreview";
import { Flag, Preview } from "@mui/icons-material";
import ExploreIcon from "@mui/icons-material/Explore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

export default function ContextGenerator({ onFinish }) {
	const [activeStep, setActiveStep] = useState(0);
	const {
		savedPlacesMap,
		setSavedPlacesMap,
		selectedPlacesMap,
		setSelectedPlacesMap,
		distanceMatrix,
		setDistanceMatrix,
		directionInformation,
		setDirectionInformation,
		nearbyPlacesMap,
		setNearbyPlacesMap,
		poisMap,
		setPoisMap,
		contextJSON,
		setContextJSON,
		context,
		setContext,
		currentInformation,
	} = useContext(GlobalContext);

	useEffect(() => {
		generateContext();
	}, [
		distanceMatrix,
		selectedPlacesMap,
		nearbyPlacesMap,
		savedPlacesMap,
		currentInformation,
		directionInformation,
		poisMap,
	]);

	const generateContext = async () => {
		let newContext = [];

		for (const place_id of Object.keys(selectedPlacesMap)) {
			// if (!savedPlacesMap[place_id]) {
			// 	await handleSave(place_id);
			// }
			const text = placeToContext(place_id);
			if (text !== "") {
				newContext.push(
					`Information of <b>${
						// selectedPlacesMap[place_id].alias ||
						savedPlacesMap[place_id].name
					}</b>:`
				);
				// Split the text into lines and add to context
				text.split("\n").forEach((line) => {
					newContext.push(line);
				});
			}
		}

		Object.keys(distanceMatrix).forEach((from_id) => {
			Object.keys(distanceMatrix[from_id]).forEach((to_id) => {
				Object.keys(distanceMatrix[from_id][to_id]).forEach((mode) => {
					if (mode === "TRANSIT") {
						newContext.push(
							`Distance from ${
								// selectedPlacesMap[from_id].alias ||
								savedPlacesMap[from_id].name
							} to ${
								// selectedPlacesMap[to_id].alias ||
								savedPlacesMap[to_id].name
							} by public transport is ${
								distanceMatrix[from_id][to_id][mode].distance
							} (${
								distanceMatrix[from_id][to_id][mode].duration
							}).`
						);
					} else if (mode === "DRIVING") {
						newContext.push(
							`Distance from ${
								// selectedPlacesMap[from_id].alias ||
								savedPlacesMap[from_id].name
							} to ${
								// selectedPlacesMap[to_id].alias ||
								savedPlacesMap[to_id].name
							} by car is ${
								distanceMatrix[from_id][to_id][mode].distance
							} (${
								distanceMatrix[from_id][to_id][mode].duration
							}).`
						);
					} else if (mode === "BICYCLING") {
						newContext.push(
							`Distance from ${
								// selectedPlacesMap[from_id].alias ||
								savedPlacesMap[from_id].name
							} to ${
								// selectedPlacesMap[to_id].alias ||
								savedPlacesMap[to_id].name
							} by cycle is ${
								distanceMatrix[from_id][to_id][mode].distance
							} (${
								distanceMatrix[from_id][to_id][mode].duration
							}).`
						);
					} else if (mode === "WALKING") {
						newContext.push(
							`Distance from ${
								// selectedPlacesMap[from_id].alias ||
								savedPlacesMap[from_id].name
							} to ${
								// selectedPlacesMap[to_id].alias ||
								savedPlacesMap[to_id].name
							} on foot is ${
								distanceMatrix[from_id][to_id][mode].distance
							} (${
								distanceMatrix[from_id][to_id][mode].duration
							}).`
						);
					}
				});
			});
		});

		Object.keys(directionInformation).forEach((from_id) => {
			Object.keys(directionInformation[from_id]).forEach((to_id) => {
				Object.keys(directionInformation[from_id][to_id]).forEach(
					(mode) => {
						if (mode === "TRANSIT") {
							newContext.push(
								`There are ${
									directionInformation[from_id][to_id][mode]
										.routes.length
								} routes from ${
									// selectedPlacesMap[from_id].alias ||
									savedPlacesMap[from_id].name
								} to ${
									// selectedPlacesMap[to_id].alias ||
									savedPlacesMap[to_id].name
								} by public transport. They are:`
							);
						} else if (mode === "DRIVING") {
							newContext.push(
								`There are ${
									directionInformation[from_id][to_id][mode]
										.routes.length
								} routes from ${
									// selectedPlacesMap[from_id].alias ||
									savedPlacesMap[from_id].name
								} to ${
									// selectedPlacesMap[to_id].alias ||
									savedPlacesMap[to_id].name
								} by car. They are:`
							);
						} else if (mode === "BICYCLING") {
							newContext.push(
								`There are ${
									directionInformation[from_id][to_id][mode]
										.routes.length
								} routes from ${
									// selectedPlacesMap[from_id].alias ||
									savedPlacesMap[from_id].name
								} to ${
									// selectedPlacesMap[to_id].alias ||
									savedPlacesMap[to_id].name
								} by cycle. They are:`
							);
						} else if (mode === "WALKING") {
							newContext.push(
								`There are ${
									directionInformation[from_id][to_id][mode]
										.routes.length
								} routes from ${
									// selectedPlacesMap[from_id].alias ||
									savedPlacesMap[from_id].name
								} to ${
									// selectedPlacesMap[to_id].alias ||
									savedPlacesMap[to_id].name
								} on foot. They are:`
							);
						}

						directionInformation[from_id][to_id][
							mode
						].routes.forEach((route, index) => {
							newContext.push(
								`${index + 1}. Via ${route.label} | ${
									route.duration
								} | ${route.distance}`
							);

							if (
								directionInformation[from_id][to_id][mode]
									.showSteps
							) {
								route.steps.forEach((step, index) => {
									newContext.push(` - ${step}`);
								});
							}
						});
					}
				);
			});
		});

		Object.keys(nearbyPlacesMap).forEach((place_id, index) => {
			nearbyPlacesMap[place_id].forEach((e) => {
				newContext.push(
					`Nearby places of ${
						// selectedPlacesMap[place_id].alias ||
						savedPlacesMap[place_id].name
					} ${e.type === "any" ? "" : 'of type "' + e.type + '"'} ${
						e.keyword !== ""
							? 'with keyword "' + e.keyword + '"'
							: ""
					} are (${
						e.hasRadius
							? "in " + e.radius + " m radius"
							: "sorted by distance in ascending order"
					}):`
				);
				let counter = 1;
				e.places.forEach((near_place) => {
					if (near_place.selected) {
						newContext.push(
							`${counter}. <b>${
								// selectedPlacesMap[near_place.place_id]?.alias ||
								savedPlacesMap[near_place.place_id]?.name ||
								near_place.name
							}</b> (${
								near_place.formatted_address ||
								savedPlacesMap[near_place.place_id]?.vicinity
							})`
						);
						counter++;
					}
				});

				newContext.push("\n");
			});
		});

		Object.keys(poisMap).forEach((place_id, index) => {
			poisMap[place_id].forEach((poi) => {
				newContext.push(
					`Places in ${
						// selectedPlacesMap[place_id].alias ||
						savedPlacesMap[place_id].name
					} of type \"${poi.type}\" are:`
				);
				let counter = 1;
				poi.places.forEach((place) => {
					if (place.selected) {
						newContext.push(
							`${counter}. <b>${
								// selectedPlacesMap[place.place_id]?.alias ||
								savedPlacesMap[place.place_id]?.name ||
								place.name
							}</b> (${
								place.formatted_address ||
								savedPlacesMap[place.place_id]?.vicinity
							})`
						);
						counter++;
					}
				});

				newContext.push("");
			});
		});

		if (currentInformation.time && currentInformation.day !== "") {
			newContext.push(
				`Current time is ${currentInformation.time.format(
					"h:mm a"
				)} on ${currentInformation.day}.`
			);
		} else if (currentInformation.time) {
			newContext.push(
				`Current time is ${currentInformation.time.format("h:mm a")}.`
			);
		} else if (currentInformation.day !== "") {
			newContext.push(`Today is ${currentInformation.day}.`);
		}

		if (currentInformation.location !== "") {
			newContext.push(
				`Current location of user is <b>${
					// selectedPlacesMap[currentInformation.location]?.alias ||
					savedPlacesMap[currentInformation.location]?.name
				}</b>.`
			);
		}

		setContext(newContext);

		console.log({
			distance_matrix: distanceMatrix,
			places: selectedPlacesMap,
			nearby_places: nearbyPlacesMap,
			current_information: currentInformation,
			pois: poisMap,
			directions: directionInformation,
		});

		setContextJSON({
			distance_matrix: distanceMatrix,
			places: selectedPlacesMap,
			nearby_places: nearbyPlacesMap,
			current_information: currentInformation,
			pois: poisMap,
			directions: directionInformation,
		});
	};

	const placeToContext = (place_id) => {
		let place = savedPlacesMap[place_id];
		if (!place) return "";

		let attributes = selectedPlacesMap[place_id].selectedAttributes;
		let text = "";

		if (
			attributes.includes("formatted_address") ||
			(attributes.includes("geometry") && place.geometry.location)
		) {
			const lat =
				typeof place.geometry.location.lat === "function"
					? place.geometry.location.lat()
					: place.geometry.location.lat;
			const lng =
				typeof place.geometry.location.lng === "function"
					? place.geometry.location.lng()
					: place.geometry.location.lng;
			text += `- Location: ${
				attributes.includes("formatted_address")
					? place.formatted_address
					: ""
			}${
				attributes.includes("geometry")
					? "(" + lat + ", " + lng + ")"
					: ""
			}.\n`;
		}
		if (attributes.includes("opening_hours")) {
			text += `- Open: ${place.opening_hours.weekday_text.join(", ")}.\n`;
		}
		if (attributes.includes("rating")) {
			text += `- Rating: ${place.rating}. (${place.user_ratings_total} ratings).\n`;
		}

		if (attributes.includes("reviews")) {
			text += `- Reviews: \n${place.reviews
				.map((review, index) => {
					console.log(review.text);
					return `   ${index + 1}. ${review.author_name} (Rating: ${
						review.rating
					}): ${review.text}\n`;
				})
				.join("")} `; // Use .join('') to concatenate without commas
		}
		console.log(text);
		if (attributes.includes("price_level")) {
			// - 0 Free
			// - 1 Inexpensive
			// - 2 Moderate
			// - 3 Expensive
			// - 4 Very Expensive
			// Convert price level from number to string

			let priceLevel = "";
			const priceMap = [
				"Free",
				"Inexpensive",
				"Moderate",
				"Expensive",
				"Very Expensive",
			];

			text += `- Price Level: ${priceMap[place.price_level]}.\n`;
		}

		if (attributes.includes("delivery")) {
			text += place.delivery
				? "- Delivery Available.\n"
				: "- Delivery Not Available.\n";
		}

		if (attributes.includes("dine_in")) {
			text += place.dine_in
				? "- Dine In Available.\n"
				: "- Dine In Not Available.\n";
		}

		if (attributes.includes("takeaway")) {
			text += place.takeaway
				? "- Takeaway Available.\n"
				: "- Takeaway Not Available.\n";
		}

		if (attributes.includes("reservable")) {
			text += place.reservable
				? "- Reservable.\n"
				: "- Not Reservable.\n";
		}

		if (attributes.includes("wheelchair_accessible_entrance")) {
			text += place.wheelchair_accessible_entrance
				? "- Wheelchair Accessible Entrance.\n"
				: "- Not Wheelchair Accessible Entrance.\n";
		}

		return text;
	};

	const steps = [
		{
			label: "Guidelines",
			description: `Welcome to the Context Generator! This tool helps you create rich, place-related contexts using Google Maps APIs. Here's how it works:

    		1. Add Places: Start by searching for and adding key locations to your context.
			2. Explore Nearby Places: Discover nearby places and points of interest around your selected locations.
			3. Discover Area POIs: Find points of interest within a larger area, like a city or neighborhood.
			3. Get Directions & Distances: Find routes between places and calculate distances.
			4. Generate Context: Review and finalize your place-related information.

			Use the "Continue" button to move through each step, or click on the step icons to jump to a specific step. Let's begin!`,
			icon: <Flag />,
		},
		{
			label: "Add Places",
			description: `Start by searching for a location using the Places API. Type in a place name or address in the search bar below.`,
			icon: <SearchIcon />,
			component: (
				<div className="flex flex-col gap-2">
					<Card className="p-3">
						<AutocompleteSearchBox
							{...{
								savedPlacesMap,
								setSavedPlacesMap,
								selectedPlacesMap,
								setSelectedPlacesMap,
								setPoisMap,
							}}
						/>
					</Card>

					<PlaceInformation
						{...{
							selectedPlacesMap,
							setSelectedPlacesMap,
							savedPlacesMap,
							distanceMatrix,
							setDistanceMatrix,
							directionInformation,
							setDirectionInformation,
							nearbyPlacesMap,
							setNearbyPlacesMap,
							poisMap,
							setPoisMap,
						}}
					/>
				</div>
			),
		},
		{
			label: "Explore Nearby Places",
			description: `Use the Nearby Search API to discover points of interest around your selected location. Click on the "Nearby" button and choose a category.`,
			icon: <PlaceIcon />,
			component: (
				<Card className="p-3">
					<NearbyInfo
						{...{
							savedPlacesMap,
							setSavedPlacesMap,
							selectedPlacesMap,
							nearbyPlacesMap,
							setNearbyPlacesMap,
							setSelectedPlacesMap,
						}}
					/>
				</Card>
			),
		},
		{
			label: "Discover Area POIs",
			description: `Explore various Points of Interest (POIs) within a larger area using the Places API. Select a region like a city or neighborhood, then choose a category (e.g., restaurants, museums, parks) to see POIs within that area.`,
			icon: <ExploreIcon />,
			component: (
				<Card className="p-3">
					<DiscoverArea
						{...{
							savedPlacesMap,
							setSavedPlacesMap,
							selectedPlacesMap,
							poisMap,
							setPoisMap,
							setSelectedPlacesMap,
						}}
					/>
				</Card>
			),
		},
		{
			label: "Get Directions",
			description: `Utilize the Directions API to find routes between two points. Click on two places on the map to set start and end points.`,
			icon: <DirectionsIcon />,
			component: (
				<Card className="p-3">
					<GetDirections
						{...{
							selectedPlacesMap,
							savedPlacesMap,
							directionInformation,
							setDirectionInformation,
						}}
					/>
				</Card>
			),
		},
		{
			label: "Calculate Distances",
			description: `Use the Distance Matrix API to get travel distances and times between multiple locations. Select several places and click "Calculate Distances".`,
			icon: <MapIcon />,
			component: (
				<Card className="p-3">
					<CalculateDistance
						{...{
							selectedPlacesMap,
							savedPlacesMap,
							distanceMatrix,
							setDistanceMatrix,
						}}
					/>
				</Card>
			),
		},
		{
			label: "Generated Context",
			description: `Review the information gathered and click "Generate Context" to create a rich, location-based context for your QnA dataset.`,
			icon: <FontAwesomeIcon icon={faEye} />,
			component: (
				<Card className="p-3">
					<ContextViewer
						{...{
							context,
						}}
					/>
				</Card>
			),
		},
	];
	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const handleReset = () => {
		setActiveStep(0);
	};
	return (
		<>
			<Typography variant="h4" gutterBottom component="h1">
				Create a Context Using Google Maps APIs
			</Typography>
			<Stepper activeStep={activeStep} orientation="vertical">
				{steps.map((step, index) => (
					<Step key={step.label}>
						<StepLabel
							// optional={
							// 	index === steps.length - 1 ? (
							// 		<Typography variant="caption">
							// 			Last step
							// 		</Typography>
							// 	) : null
							// }
							icon={step.icon}
							onClick={() => {
								if (index !== activeStep) setActiveStep(index);
								else setActiveStep(-1);
							}}
							className="!cursor-pointer hover:!text-blue-500"
						>
							{step.label}
						</StepLabel>
						<StepContent>
							<div className="flex flex-col gap-2">
								<Typography
									sx={{
										whiteSpace: "pre-line", // This CSS property will make newlines render as expected
									}}
								>
									{steps[activeStep]?.description}
								</Typography>
								{step.component}
								<Box sx={{ mb: 2 }}>
									<div>
										<Button
											variant="contained"
											onClick={handleNext}
											sx={{ mt: 1, mr: 1 }}
											// disabled={
											// 	index === steps.length - 1
											// }
										>
											{index === steps.length - 1
												? "Finish"
												: index === 0
												? "Start"
												: "Continue"}
											{/* {"Continue"} */}
										</Button>
										{index > 0 && (
											<Button
												// disabled={index === 0}
												onClick={handleBack}
												sx={{ mt: 1, mr: 1 }}
											>
												Back
											</Button>
										)}
									</div>
								</Box>
							</div>
						</StepContent>
					</Step>
				))}
			</Stepper>
			{activeStep === steps.length && (
				<Paper square elevation={0} sx={{ p: 3 }}>
					<Typography>
						All steps completed - you&apos;re finished. <br></br>Now
						you can proceed to create a question based on the
						context you have generated.
					</Typography>
					<Button onClick={onFinish} sx={{ mt: 1, mr: 1 }}>
						Create Question
					</Button>
					{/* <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
						Edit
					</Button> */}
				</Paper>
			)}
		</>
	);
}
