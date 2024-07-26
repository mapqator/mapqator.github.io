import { useContext, useState } from "react";
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
import { Flag, RemoveRedEye, Settings } from "@mui/icons-material";
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
import PlaceInformation from "@/components/Grids/PlacesGrid";
import { LoadingButton } from "@mui/lab";
import { setLoading } from "@/app/home/page";

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
	return (
		<>
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
				<div className="flex flex-col gap-2">
					<Typography
						sx={{
							whiteSpace: "pre-line",
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
										<CardContent>
											<Box className="mx-auto w-full md:w-[30rem]">
												{step.form}
											</Box>
										</CardContent>
										{step.grid && (
											<>
												<Divider
													sx={{
														mt: 2,
														mb: 1,
														color: "#888",
													}}
												>
													Already added
												</Divider>
												<CardContent>
													{step.grid}
												</CardContent>
											</>
										)}
									</Box>
									<Divider />
								</>
						  )}
					{step.context !== undefined && (
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
					)}

					<Box sx={{ mb: 2 }}>
						<div>
							<Button
								variant="contained"
								onClick={handleNext}
								sx={{ mt: 1, mr: 1 }}
							>
								{index === totalSteps - 1
									? "Finish"
									: index === 0
									? "Start"
									: "Continue"}
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
						</div>
					</Box>
				</div>
			</StepContent>
		</>
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
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const loadExample = () => {
		handleExample();
		handleNext();
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

			You can start from scratch or with an example. Let's begin!`,
			icon: <Flag />,
		},
		{
			label: "Add Places",
			description: `Start by searching for a location. Type in a place name or address in the search bar below.`,
			icon: <SearchIcon />,
			component: (
				<div className="flex flex-col gap-2">
					<Divider />
					<CardContent>
						<AutocompleteSearchBox />
						{Object.keys(selectedPlacesMap).length > 0 && (
							<>
								<Divider sx={{ my: 1, color: "#888" }}>
									Already added
								</Divider>
								<MapComponent />
								<PlaceInformation />
							</>
						)}
					</CardContent>
					<Divider />
				</div>
			),
			context: context.places,
		},
		{
			label: "Explore Nearby Places",
			description: `Use the Nearby Search Tool to discover points of interest around your selected location. You just need to select a location and the type of poi you are looking for.
			You can choose a type from the given list or a custom type. It is recommended to choose from the given list for better result.`,
			icon: <PlaceIcon />,
			form: <NearbyForm />,
			grid: Object.keys(nearbyPlacesMap).length > 0 && <NearbyGrid />,
			context: context.nearby,
		},
		{
			label: "Discover Area POIs",
			description: `Explore various Points of Interest (POIs) within a larger area. Select a region like a city or neighborhood, then choose a type (e.g., restaurants, museums, parks) to see POIs within that area.`,
			icon: <ExploreIcon />,
			form: <AreaForm />,
			grid: Object.keys(poisMap).length > 0 && <AreaGrid />,
			context: context.area,
		},
		{
			label: "Calculate Distances",
			description: `Use the Distance Matrix API to get travel distances and times between multiple locations. Choose origins, destinations and travel mode to find distance and durations.`,
			icon: <MapIcon />,
			form: <DistanceForm />,
			grid: Object.keys(distanceMatrix).length > 0 && <DistanceGrid />,
			context: context.distance,
		},
		{
			label: "Get Directions",
			description: `Utilize the Directions API to find routes between two points. Choose origin, destination and travel mode to find possible routes between them.`,
			icon: <DirectionsIcon />,
			form: <DirectionForm />,
			grid: Object.keys(directionInformation).length > 0 && (
				<DirectionGrid />
			),
			context: context.direction,
		},
		{
			label: "Set Context Parameters",
			description: `Set the time, day, and location that should be used as a basis for answering questions. This will help provide more accurate and context-specific responses.`,
			icon: <Settings />,
			component: (
				<>
					<Divider />
					<Box className="w-full md:w-[30rem] mx-auto">
						<CardContent>
							<ParamsForm />
						</CardContent>
					</Box>
					<Divider />
				</>
			),
			context: context.params,
		},
		{
			label: "Preview Full Context",
			description: `Review the information gathered and click on "Finish" when you are done.`,
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
		</>
	);
}
