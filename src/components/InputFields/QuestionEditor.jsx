import React, { useContext, useEffect, useRef, useState } from "react";
import {
	Typography,
	TextField,
	FormControl,
	IconButton,
	Tooltip,
	List,
	ListItem,
	ListItemText,
	ListItemButton,
} from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { GlobalContext } from "@/contexts/GlobalContext";
import ContextGeneratorService from "@/services/contextGeneratorService";
import { showError } from "@/contexts/ToastProvider";
import gptApi from "@/api/gptApi";
import { AppContext } from "@/contexts/AppContext";

export default function QuestionEditor({ index }) {
	const { query, setQuery, savedPlacesMap } = useContext(GlobalContext);
	const [isGenerating, setIsGenerating] = useState(false);
	const { context } = useContext(GlobalContext);
	const [showMentions, setShowMentions] = useState(false);
	const [mentionStartIndex, setMentionStartIndex] = useState(-1);
	const [mentionAnchorEl, setMentionAnchorEl] = useState(null);
	const [mentionSearch, setMentionSearch] = useState("");
	const [names, setNames] = useState();
	const inputRef = useRef(null);

	useEffect(() => {
		const names = Object.values(savedPlacesMap).map(
			(place) => place.displayName?.text
		);
		setNames(names);
	}, [savedPlacesMap]);

	// const names = ["Alice", "Bob", "Charlie", "David", "Eve"];

	// const handleQuestionChange = (e) => {
	// 	const newValue = e.target.value;
	// 	const lastChar = newValue[e.target.selectionStart - 1];

	// 	if (lastChar === "@") {
	// 		setShowMentions(true);
	// 		setMentionAnchorEl(e.target);
	// 		setMentionSearch("");
	// 	} else if (showMentions) {
	// 		setMentionSearch(mentionSearch + lastChar);
	// 	}

	// 	setQuery((prev) => {
	// 		const newQuery = { ...prev };
	// 		newQuery.questions[index].title = newValue;
	// 		return newQuery;
	// 	});
	// };

	const handleQuestionChange = (e) => {
		const newValue = e.target.value;
		const cursorPosition = e.target.selectionStart;
		const textBeforeCursor = newValue.slice(0, cursorPosition);
		const lastAtSymbol = textBeforeCursor.lastIndexOf("@");

		console.log("Cursor position:", cursorPosition);
		console.log("Last @ symbol position:", lastAtSymbol);

		if (lastAtSymbol !== -1 && cursorPosition > lastAtSymbol) {
			const mentionText = textBeforeCursor.slice(lastAtSymbol + 1);
			setShowMentions(true);
			setMentionAnchorEl(e.target);
			setMentionSearch(mentionText);
			setMentionStartIndex(lastAtSymbol);
			console.log("Showing mentions. Search:", mentionText);
		} else {
			setShowMentions(false);
			setMentionSearch("");
			setMentionStartIndex(-1);
			console.log("Hiding mentions");
		}

		setQuery((prev) => {
			const newQuery = { ...prev };
			newQuery.questions[index].title = newValue;
			return newQuery;
		});
	};

	// const handleMentionSelect = (name) => {
	// 	const currentValue = query.questions[index].title;
	// 	const cursorPosition = inputRef.current.selectionStart;
	// 	const textBeforeCursor = currentValue.slice(0, cursorPosition);
	// 	const textAfterCursor = currentValue.slice(cursorPosition);
	// 	const lastAtSymbol = textBeforeCursor.lastIndexOf("@");
	// 	const newValue =
	// 		textBeforeCursor.slice(0, lastAtSymbol) +
	// 		`@${name} ` +
	// 		textAfterCursor;

	// 	setQuery((prev) => {
	// 		const newQuery = { ...prev };
	// 		newQuery.questions[index].title = newValue;
	// 		return newQuery;
	// 	});

	// 	setShowMentions(false);
	// 	inputRef.current.focus();
	// };

	const handleMentionSelect = (name) => {
		console.log("Mention selected:");

		const currentValue = query.questions[index].title;
		const cursorPosition = inputRef.current.selectionStart;
		console.log("Cursor position:", cursorPosition);
		const textBeforeMention = currentValue.slice(0, mentionStartIndex);
		console.log("Text before mention:", textBeforeMention);
		const textAfterCursor = currentValue.slice(cursorPosition);
		console.log("Text after cursor:", textAfterCursor);
		const newValue = textBeforeMention + `${name}` + textAfterCursor;

		setQuery((prev) => {
			const newQuery = { ...prev };
			newQuery.questions[index].title = newValue;
			return newQuery;
		});

		setShowMentions(false);
		setMentionSearch("");
		setMentionStartIndex(-1);

		// Use setTimeout to ensure the DOM has updated before we try to focus and set selection
		setTimeout(() => {
			if (inputRef.current) {
				inputRef.current.focus();
				const newCursorPosition = mentionStartIndex + name.length; // +2 for @ and space
				inputRef.current.setSelectionRange(
					newCursorPosition,
					newCursorPosition
				);
			}
		}, 0);
	};

	const filteredNames = names?.filter((name) =>
		name?.toLowerCase().includes(mentionSearch.toLowerCase())
	);

	// useEffect(() => {
	// 	const handleClickOutside = (event) => {
	// 		if (inputRef.current && !inputRef.current.contains(event.target)) {
	// 			setShowMentions(false);
	// 		}
	// 	};

	// 	document.addEventListener("mousedown", handleClickOutside);
	// 	return () => {
	// 		document.removeEventListener("mousedown", handleClickOutside);
	// 	};
	// }, []);

	const handleGenerateQuestion = async () => {
		setIsGenerating(true);
		const text = ContextGeneratorService.convertContextToText(context);
		if (text === "") {
			showError("Context is empty. Please generate context first.");
		} else {
			const res = await gptApi.generateQuestion(text);
			if (res.success) {
				setQuery((prev) => {
					const newQuery = { ...prev };
					newQuery.questions[index].title = res.data;
					return newQuery;
				});
			} else {
				showError(res.message);
			}
		}
		setIsGenerating(false);
	};

	return (
		<FormControl fullWidth>
			<Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
				Question {index + 1}:
			</Typography>
			<div style={{ position: "relative" }}>
				<TextField
					fullWidth
					placeholder="Write a question based on context..."
					value={query.questions[index].title}
					onChange={handleQuestionChange}
					multiline
					required
					minRows={4}
					inputRef={inputRef}
				/>
				{/* <Tooltip title="Generate Question with AI">
					<IconButton
						onClick={handleGenerateQuestion}
						disabled={isGenerating}
						sx={{
							position: "absolute",
							right: 8,
							bottom: 8,
							backgroundColor: "primary.main",
							color: "white",
							"&:hover": {
								backgroundColor: "primary.dark",
							},
							width: 40,
							height: 40,
						}}
					>
						<SmartToyIcon />
					</IconButton>
				</Tooltip> */}
				{showMentions && (
					<List
						sx={{
							position: "absolute",
							zIndex: 10,
							bgcolor: "grey.200",
							border: "1px solid",
							borderColor: "divider",
							width: "100%",
							maxHeight: 200,
							overflowY: "auto",
							borderRadius: 1,
						}}
					>
						{filteredNames.map((name) => (
							<ListItemButton
								key={name}
								onClick={() => {
									console.log("ListItem clicked:", name);
									handleMentionSelect(name);
								}}
							>
								<ListItemText primary={name} />
							</ListItemButton>
						))}
					</List>
				)}
			</div>
		</FormControl>
	);
}

// Placeholder function for AI question generation
async function generateQuestionWithAI() {
	await new Promise((resolve) => setTimeout(resolve, 1000));
	return "This is a placeholder question generated by AI. Replace this with your actual AI-generated question.";
}
