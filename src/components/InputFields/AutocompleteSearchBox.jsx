import React, { useContext, useEffect, useState } from "react";
import mapApi from "@/api/mapApi";

import {
	Button,
	TextField,
	Divider,
	ListItemText,
	ListItem,
	Box,
} from "@mui/material";
import _ from "lodash";

import { Clear, Search } from "@mui/icons-material";
import Fuse from "fuse.js";
import { useCallback } from "react";
import { CircularProgress, InputAdornment } from "@mui/material";
import debounce from "lodash/debounce";
import { AppContext } from "@/contexts/AppContext";
import PlaceAddButton from "../Buttons/PlaceAddButton";
import { useAuth } from "@/contexts/AuthContext";

function SearchPlaceCard({ place, index, length }) {
	// Issue: Name overlaps with Add button
	return (
		<React.Fragment key={index}>
			<Box className="flex gap-1 justify-between w-full items-center px-2">
				<ListItemText
					primary={place.name}
					secondary={place.formatted_address}
				/>
				<Box className="ml-auto">
					<PlaceAddButton place_id={place.place_id} />
				</Box>
			</Box>
			<Divider component="li" />
		</React.Fragment>
	);
}
export default function AutocompleteSearchBox() {
	const [search, setSearch] = useState("");
	const [results, setResults] = useState([]);
	const [mapResults, setMapResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [recentSearches, setRecentSearches] = useState([]);
	const [shouldFetchFromAPI, setShouldFetchFromAPI] = useState(false);
	const [cache, setCache] = useState({});
	const { savedPlacesMap } = useContext(AppContext);
	const [notFound, setNotFound] = useState(false);
	const { isAuthenticated } = useAuth();
	const fuseOptions = {
		keys: ["name", "formatted_address"],
		threshold: 0.3,
		ignoreLocation: true,
	};
	const [fuse, setFuse] = useState(
		new Fuse(Object.values(savedPlacesMap), fuseOptions)
	);
	// Update fuse object whenever savedPlacesMap changes
	useEffect(() => {
		const newFuse = new Fuse(Object.values(savedPlacesMap), fuseOptions);
		setFuse(newFuse);
	}, [savedPlacesMap]);

	const searchMap = async (query) => {
		setLoading(true);
		const response = await mapApi.search(query);
		if (response.success) {
			setMapResults([...response.data.results]);
			// setCache((prev) => ({
			// 	...prev,
			// 	[query]: response.data.results,
			// }));
			if (response.data.results.length === 0) {
				setNotFound(true);
			}
		} else {
			console.error("Error fetching data:", response.error);
			setNotFound(true);
		}
		setLoading(false);
		setShouldFetchFromAPI(false);
	};

	const handleSearch = useCallback(
		debounce(async (query) => {
			console.log("Searching for: ", query, fuse);
			if (!fuse) return;

			setLoading(true);

			// Search in saved places
			// Local search
			const localResults = fuse
				.search(query)
				.map((result) => result.item);
			setResults(localResults);

			// Check cache
			// if (cache[query]) {
			//      setResults([...localResults, ...cache[query]]);
			//      setLoading(false);
			// 	    return;
			// }

			setLoading(false);
		}, 300),
		[savedPlacesMap]
	);

	useEffect(() => {
		if (search) {
			handleSearch(search);
			// setRecentSearches((prev) =>
			// 	[search, ...prev.filter((s) => s !== search)].slice(0, 5)
			// );
		} else {
			setResults([]);
		}
	}, [search, handleSearch, savedPlacesMap]);

	useEffect(() => {
		setNotFound(false);
		setMapResults([]);
	}, [search]);

	const handleKeyPress = (event) => {
		console.log("Key Pressed: ", event.key);
		if (event.key === "Enter") {
			setShouldFetchFromAPI(true);
			searchMap(search);
		}
	};

	return (
		<div className="flex flex-col gap-4 mx-auto w-full md:w-[30rem]">
			<TextField
				autoComplete="off"
				fullWidth
				onKeyPress={handleKeyPress}
				variant="outlined"
				placeholder="Search for a place"
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<Search />
						</InputAdornment>
					),
					endAdornment: (
						<InputAdornment position="end">
							{loading ? (
								<CircularProgress size={20} />
							) : (
								search && (
									<Clear
										className="cursor-pointer"
										onClick={() => setSearch("")}
									/>
								)
							)}
						</InputAdornment>
					),
				}}
			/>

			{/* {recentSearches.length > 0 && (
				<div className="flex flex-wrap gap-2">
					{recentSearches.map((recentSearch, index) => (
						<Chip
							key={index}
							label={recentSearch}
							onClick={() => setSearch(recentSearch)}
							onDelete={() =>
								setRecentSearches((prev) =>
									prev.filter((s) => s !== recentSearch)
								)
							}
						/>
					))}
				</div>
			)} */}

			<div
				className={`border rounded-md overflow-hidden ${
					mapResults.length > 0 || search
						? ""
						: search
						? "invisible"
						: "hidden"
				}`}
			>
				{mapResults.length > 0 ? (
					<ul className="max-h-72 overflow-y-auto">
						{mapResults.map((place, index) => (
							<SearchPlaceCard
								place={place}
								index={index}
								length={results.length}
								key={index}
							/>
						))}
					</ul>
				) : (
					<div className="h-60 flex items-center justify-center">
						<p className="text-lg md:text-xl text-gray-400">
							{notFound
								? "No places found"
								: "Press enter to search"}
						</p>
					</div>
				)}
			</div>

			{/* <div className="grid grid-cols-1 gap-4">
				<div
					className={`border rounded-lg overflow-hidden ${
						search ? "" : "hidden"
					}`}
				>
					<h3 className="bg-gray-200 p-2 font-bold">Recent Places</h3>
					{results.length > 0 ? (
						<ul className="h-60 overflow-y-auto">
							{results.map((place, index) => (
								<SearchPlaceCard
									place={place}
									index={index}
									length={results.length}
									key={index}
								/>
							))}
						</ul>
					) : (
						<div className="h-60 flex items-center justify-center">
							<p className="text-lg md:text-xl text-gray-400">
								No places found
							</p>
						</div>
					)}
				</div>

				<div
					className={`border rounded-lg overflow-hidden ${
						mapResults.length > 0 || search
							? ""
							: search
							? "invisible"
							: "hidden"
					}`}
				>
					<h3 className="bg-gray-200 p-2 font-bold">
						Places found in Google Map
					</h3>
					{mapResults.length > 0 ? (
						<ul className="max-h-72 overflow-y-auto">
							{mapResults.map((place, index) => (
								<SearchPlaceCard
									place={place}
									index={index}
									length={results.length}
									key={index}
								/>
							))}
						</ul>
					) : (
						<div className="h-60 flex items-center justify-center">
							<p className="text-lg md:text-xl text-gray-400">
								{notFound
									? "No places found"
									: "Press enter to search"}
							</p>
						</div>
					)}
				</div>
			</div> */}
		</div>
	);
}
