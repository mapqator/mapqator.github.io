import { useContext, useEffect, useRef, useState } from "react";
import {
	Box,
	Typography,
	Stepper,
	Step,
	StepLabel,
	StepContent,
	Button,
	Paper,
	Divider,
	CardContent,
} from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsIcon from "@mui/icons-material/Directions";
import PlaceIcon from "@mui/icons-material/Place";
import { GlobalContext } from "@/contexts/GlobalContext";
import ContextPreview from "@/components/Cards/ContextPreview";
import {
	Clear,
	Flag,
	KeyboardArrowRight,
	KeyboardDoubleArrowRight,
	NextPlanTwoTone,
	RemoveRedEye,
	Save,
	Send,
	Settings,
} from "@mui/icons-material";
import ExploreIcon from "@mui/icons-material/Explore";
import ContextGeneratorService from "@/services/contextGeneratorService";
import ParamsForm from "@/components/Forms/ParamsForm";
import DirectionGrid from "@/components/Grids/DirectionGrid";
import DirectionForm from "@/components/Forms/DirectionForm";
import DistanceGrid from "@/components/Grids/DistanceGrid";
import DistanceForm from "@/components/Forms/DistanceForm";
import AreaGrid from "@/components/Grids/AreaGrid";
import AreaForm from "@/components/Forms/AreaForm";
import NearbyGrid from "@/components/Grids/NearbyGrid";
import NearbyForm from "@/components/Forms/NearbyForm";
import AutocompleteSearchBox from "@/components/InputFields/AutocompleteSearchBox";
import MapComponent from "@/components/GoogleMap/MapComponent";
import PlacesGrid from "@/components/Grids/PlacesGrid";
import { LoadingButton } from "@mui/lab";
import { setLoading } from "@/app/old-home/page";
import { showError } from "@/contexts/ToastProvider";

function ContextStep({
	step,
	index,
	totalSteps,
	activeStep,
	setActiveStep,
	handleNext,
	handleBack,
	loadExample,
}) {
	const [loading, setLoading] = useState(false);
	const stepRef = useRef(null);

	// useEffect(() => {
	// 	if (index === activeStep && stepRef.current) {
	// 		stepRef.current.scrollIntoView({
	// 			behavior: "smooth",
	// 			block: "start",
	// 		});
	// 	}
	// }, [activeStep, index]);
	return (
		<div ref={stepRef}>
			<StepLabel
				icon={
					<div
						className={`cursor-pointer hover:text-blue-500 ${
							index === activeStep && "text-blue-500"
						}`}
					>
						{step.icon}
					</div>
				}
				onClick={() => {
					if (index !== activeStep) setActiveStep(index);
				}}
			>
				<Typography
					className={`cursor-pointer flex ${
						index === activeStep && "!text-blue-500 !font-semibold"
					}`}
				>
					{step.label}
				</Typography>
			</StepLabel>
			<StepContent>
				<div className="flex flex-col">
					<Typography
						sx={{
							whiteSpace: "pre-line",
							paddingBottom: "8px",
						}}
					>
						{step.description}
					</Typography>
					{step.component
						? step.component
						: step.form && (
								<>
									<Divider />
									<Box>
										<Box className="mx-auto w-full md:w-[30rem] p-5">
											{step.form}
										</Box>
										{step.grid && (
											<>
												<Divider />
												{/* Already added
												</Divider> */}
												<Typography
													sx={{
														whiteSpace: "pre-line",
														paddingTop: "8px",
													}}
												>
													{step.additional}
												</Typography>
												<Box>{step.grid}</Box>
											</>
										)}
									</Box>
									<Divider />
								</>
						  )}
					{/* {step.context !== undefined && (
						<>
							<Typography
								sx={{
									whiteSpace: "pre-line",
								}}
							>
								Based on the information you add, a context will
								be generated below.
							</Typography>

							<Paper
								elevation={1}
								sx={{ p: 2, bgcolor: "grey.100" }}
							>
								<ContextPreview context={step.context} />
							</Paper>
						</>
					)} */}

					<Box sx={{ my: 1 }}>
						<div>
							<Button
								variant="contained"
								onClick={handleNext}
								sx={{ mt: 1, mr: 1 }}
								disabled={index === totalSteps - 1}
							>
								{index === 0 ? "Start" : "Continue"}
							</Button>
							{index > 0 ? (
								<Button
									onClick={handleBack}
									sx={{ mt: 1, mr: 1 }}
								>
									Back
								</Button>
							) : (
								<LoadingButton
									onClick={async () => {
										setLoading(true);
										loadExample();
										setLoading(false);
									}}
									sx={{ mt: 1, mr: 1 }}
									loading={loading}
								>
									Start with Example
								</LoadingButton>
							)}
							{/* {index > 0 && (
								<Button
									onClick={handleBack}
									sx={{ mt: 1, mr: 1 }}
								>
									Back
								</Button>
							)} */}
						</div>
					</Box>
				</div>
			</StepContent>
		</div>
	);
}
export default function ContextStepper({
	handleReset,
	onFinish,
	handleExample,
	activeStep,
	setActiveStep,
}) {
	const {
		selectedPlacesMap,
		nearbyPlacesMap,
		poisMap,
		distanceMatrix,
		directionInformation,
		context,
	} = useContext(GlobalContext);

	const handleNext = () => {
		if (activeStep === steps.length - 1) onFinish();
		else setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const loadExample = () => {
		handleExample();
		handleNext();
	};

	const handlePlaceAdd = () => {
		setActiveStep(1);
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

			Let's begin!`,
			icon: <Flag />,
		},
		{
			label: "Add Information of Places/POIs	",
			description: `Start by searching for a location. Type in a place name or address in the search bar below.`,
			icon: <SearchIcon />,
			additional: "Places you have added to the context.",
			// component: (
			// 	<div className="flex flex-col gap-2">
			// 		<Divider />
			// 		<CardContent>
			// 			<AutocompleteSearchBox />
			// 			{Object.keys(selectedPlacesMap).length > 0 && (
			// 				<>
			// 					<Divider sx={{ my: 1, color: "#888" }}>
			// 						Already added
			// 					</Divider>
			// 					{/* <MapComponent /> */}
			// 					<PlacesGrid />
			// 				</>
			// 			)}
			// 		</CardContent>
			// 		<Divider />
			// 	</div>
			// ),
			form: <AutocompleteSearchBox />,
			grid: Object.keys(selectedPlacesMap).length > 0 && <PlacesGrid />,
			context: context.places,
		},
		{
			label: "Explore Nearby POIs",
			description: `Use the Nearby Search Tool to discover points of interest around your selected location. You just need to select a location and the type of poi you are looking for. 
			Additionally you can specify the order in which results are listed. Possible values are Prominence and Distance. When prominence is specified, the radius parameter is required. 
			You can choose a type from the given list or a custom type. It is recommended to choose from the given list for better result.`,
			additional:
				"List of places whose nearby pois are added to the context",
			icon: <PlaceIcon />,
			form: <NearbyForm {...{ handlePlaceAdd }} />,
			grid: Object.keys(nearbyPlacesMap).length > 0 && <NearbyGrid />,
			context: context.nearby,
		},
		{
			label: "Explore POIs inside Places",
			description: `Explore various Points of Interest (POIs) within a larger area. Select a region like a city or neighborhood, then choose a type (e.g., restaurants, museums, parks) to see POIs within that area.`,
			additional:
				"List of areas whose internals pois are added to the context",
			icon: <ExploreIcon />,
			form: <AreaForm {...{ handlePlaceAdd }} />,
			grid: Object.keys(poisMap).length > 0 && <AreaGrid />,
			context: context.area,
		},
		{
			label: "Get Alternative Routes",
			description: `Utilize the Directions API to find routes between two points. Choose origin, destination and travel mode to find possible routes between them.`,
			additional:
				"List of origin - destination pairs whose alternative routes are added to the context",
			icon: <DirectionsIcon />,
			form: <DirectionForm {...{ handlePlaceAdd }} />,
			grid: Object.keys(directionInformation).length > 0 && (
				<DirectionGrid />
			),
			context: context.direction,
		},
		{
			label: "Get Duration of Recommended Route",
			description: `Use the Distance Matrix API to get travel distances and times between multiple locations. Choose origins, destinations and travel mode to find distance and durations.`,
			additional:
				"List of origin - destination pairs whose fastest route is added to the context",
			icon: <MapIcon />,
			form: <DistanceForm {...{ handlePlaceAdd }} />,
			grid: Object.keys(distanceMatrix).length > 0 && <DistanceGrid />,
			context: context.distance,
		},
		// {
		// 	label: "Set Query Parameters",
		// 	description: `Set the time, day, and location that should be used as a basis for answering questions. This will help provide more accurate and context-specific responses.`,
		// 	icon: <Settings />,
		// 	component: (
		// 		<>
		// 			<Divider />
		// 			<Box className="w-full md:w-[30rem] mx-auto">
		// 				<CardContent>
		// 					<ParamsForm {...{ handlePlaceAdd }} />
		// 				</CardContent>
		// 			</Box>
		// 			<Divider />
		// 		</>
		// 	),
		// 	context: context.params,
		// },
		{
			label: "Preview Full Context",
			description: `Review the information gathered and then you can proceed to create a question based on the context you have generated.`,
			icon: <RemoveRedEye />,
			component: (
				<>
					<Paper elevation={1} sx={{ p: 2, bgcolor: "grey.100" }}>
						<ContextPreview
							context={ContextGeneratorService.convertContextToText(
								context
							)}
						/>
					</Paper>
				</>
			),
		},
	];
	return (
		<>
			<Stepper activeStep={activeStep} orientation="vertical">
				{steps.map((step, index) => (
					<Step key={step.label}>
						<ContextStep
							totalSteps={steps.length}
							{...{
								step,
								index,
								activeStep,
								setActiveStep,
								handleNext,
								handleBack,
								loadExample,
							}}
						/>
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
					<Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
						Start new context
					</Button>
				</Paper>
			)}
			<Divider sx={{ my: 1 }} />
			<div className="flex">
				<Button
					onClick={() => {
						// if (
						// 	Object.keys(selectedPlacesMap).length +
						// 		Object.keys(nearbyPlacesMap).length +
						// 		Object.keys(poisMap).length +
						// 		Object.keys(directionInformation).length +
						// 		Object.keys(distanceMatrix).length ===
						// 	0
						// ) {
						// 	setActiveStep(0);
						// 	showError(
						// 		"Please add some place information first"
						// 	);
						// } else
						{
							onFinish();
						}
					}}
					variant="contained"
					sx={{ mt: 1, mr: 1 }}
					endIcon={<Send />}
				>
					Submit Context
				</Button>
				<Button
					onClick={handleReset}
					sx={{ mt: 1, mr: 1 }}
					color="error"
					startIcon={<Clear />}
				>
					Clear
				</Button>
			</div>
		</>
	);
}
