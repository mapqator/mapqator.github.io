"use client";
import { useState } from "react";
import {
	Box,
	Container,
	Typography,
	TextField,
	Button,
	Radio,
	RadioGroup,
	FormControlLabel,
	FormControl,
	FormLabel,
	Select,
	MenuItem,
	IconButton,
	Drawer,
	AppBar,
	Toolbar,
	Stepper,
	Step,
	StepLabel,
	StepContent,
	Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuIcon from "@mui/icons-material/Menu";
import MapIcon from "@mui/icons-material/Map";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsIcon from "@mui/icons-material/Directions";
import PlaceIcon from "@mui/icons-material/Place";

export default function QuestionCreationPage() {
	const [question, setQuestion] = useState("");
	const [options, setOptions] = useState(["", "", "", ""]);
	const [correctAnswer, setCorrectAnswer] = useState("");
	const [category, setCategory] = useState("");
	const [context, setContext] = useState(
		"This is the generated context based on the map data..."
	);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [activeStep, setActiveStep] = useState(0);

	const handleOptionChange = (index, value) => {
		const newOptions = [...options];
		newOptions[index] = value;
		setOptions(newOptions);
	};

	const addOption = () => {
		setOptions([...options, ""]);
	};

	const removeOption = (index) => {
		const newOptions = options.filter((_, i) => i !== index);
		setOptions(newOptions);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		console.log({ context, question, options, correctAnswer, category });
		// Reset form or navigate to next step
	};

	const toggleDrawer = (open) => (event) => {
		if (
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}
		setIsDrawerOpen(open);
	};

	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const handleReset = () => {
		setActiveStep(0);
	};

	const steps = [
		{
			label: "Select a Location",
			description: `Start by searching for a location using the Places API. Type in a place name or address in the search bar above the map.`,
			icon: <SearchIcon />,
		},
		{
			label: "Explore Nearby Places",
			description: `Use the Nearby Search API to discover points of interest around your selected location. Click on the "Nearby" button and choose a category.`,
			icon: <PlaceIcon />,
		},
		{
			label: "Get Directions",
			description: `Utilize the Directions API to find routes between two points. Click on two places on the map to set start and end points.`,
			icon: <DirectionsIcon />,
		},
		{
			label: "Calculate Distances",
			description: `Use the Distance Matrix API to get travel distances and times between multiple locations. Select several places and click "Calculate Distances".`,
			icon: <MapIcon />,
		},
		{
			label: "Generate Context",
			description: `Review the information gathered and click "Generate Context" to create a rich, location-based context for your QnA dataset.`,
			icon: <SearchIcon />,
		},
	];

	const contextDrawer = (
		<Box sx={{ width: 350 }} role="presentation">
			<AppBar position="static">
				<Toolbar>
					<Typography
						variant="h6"
						component="div"
						sx={{ flexGrow: 1 }}
					>
						Create Context
					</Typography>
				</Toolbar>
			</AppBar>
			<Box sx={{ p: 2 }}>
				<Stepper activeStep={activeStep} orientation="vertical">
					{steps.map((step, index) => (
						<Step key={step.label}>
							<StepLabel icon={step.icon}>{step.label}</StepLabel>
							<StepContent>
								<Typography>{step.description}</Typography>
								<Box sx={{ mb: 2 }}>
									<div>
										<Button
											variant="contained"
											onClick={handleNext}
											sx={{ mt: 1, mr: 1 }}
										>
											{index === steps.length - 1
												? "Finish"
												: "Continue"}
										</Button>
										<Button
											disabled={index === 0}
											onClick={handleBack}
											sx={{ mt: 1, mr: 1 }}
										>
											Back
										</Button>
									</div>
								</Box>
							</StepContent>
						</Step>
					))}
				</Stepper>
				{activeStep === steps.length && (
					<Paper square elevation={0} sx={{ p: 3 }}>
						<Typography>
							All steps completed - you&apos;re finished
						</Typography>
						<Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
							Reset
						</Button>
					</Paper>
				)}
			</Box>
		</Box>
	);

	return (
		<Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
			<AppBar position="static" sx={{ mb: 4 }}>
				<Toolbar>
					<IconButton
						size="large"
						edge="start"
						color="inherit"
						aria-label="menu"
						sx={{ mr: 2 }}
						onClick={toggleDrawer(true)}
					>
						<MenuIcon />
					</IconButton>
					<Typography
						variant="h6"
						component="div"
						sx={{ flexGrow: 1 }}
					>
						Create MCQ Question
					</Typography>
				</Toolbar>
			</AppBar>

			<Drawer
				anchor="left"
				open={isDrawerOpen}
				onClose={toggleDrawer(false)}
			>
				{contextDrawer}
			</Drawer>

			<form onSubmit={handleSubmit}>
				<TextField
					fullWidth
					label="Question"
					value={question}
					onChange={(e) => setQuestion(e.target.value)}
					margin="normal"
					required
				/>
				<Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
					Options:
				</Typography>
				{options.map((option, index) => (
					<Box
						key={index}
						sx={{ display: "flex", alignItems: "center", mb: 2 }}
					>
						<TextField
							fullWidth
							label={`Option ${index + 1}`}
							value={option}
							onChange={(e) =>
								handleOptionChange(index, e.target.value)
							}
							required
						/>
						<IconButton
							onClick={() => removeOption(index)}
							sx={{ ml: 1 }}
						>
							<DeleteIcon />
						</IconButton>
					</Box>
				))}
				<Button
					startIcon={<AddIcon />}
					onClick={addOption}
					sx={{ mb: 2 }}
				>
					Add Option
				</Button>
				<FormControl
					component="fieldset"
					sx={{ display: "block", mb: 2 }}
				>
					<FormLabel component="legend">Correct Answer</FormLabel>
					<RadioGroup
						value={correctAnswer}
						onChange={(e) => setCorrectAnswer(e.target.value)}
					>
						{options.map((option, index) => (
							<FormControlLabel
								key={index}
								value={option}
								control={<Radio />}
								label={`Option ${index + 1}`}
							/>
						))}
					</RadioGroup>
				</FormControl>
				<FormControl fullWidth sx={{ mb: 2 }}>
					<FormLabel>Category</FormLabel>
					<Select
						value={category}
						onChange={(e) => setCategory(e.target.value)}
						required
					>
						<MenuItem value="geography">Geography</MenuItem>
						<MenuItem value="history">History</MenuItem>
						<MenuItem value="culture">Culture</MenuItem>
						<MenuItem value="landmarks">Landmarks</MenuItem>
					</Select>
				</FormControl>
				<Button type="submit" variant="contained" color="primary">
					Submit Question
				</Button>
			</form>
		</Container>
	);
}
