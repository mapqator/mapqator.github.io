"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import PlaceApi from "@/api/placeApi";
const placeApi = new PlaceApi();
import QueryApi from "@/api/queryApi";
const queryApi = new QueryApi();
import { TextareaAutosize } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import {
  Select,
  MenuItem,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  Button,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

function QueryCard({ query }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      {expanded ? (
        <div className="flex flex-col gap-1 p-1 border-2 border-black rounded-md">
          <div className="flex flex-row items-end justify-between">
            <h1 className="text-xl font-bold">Question</h1>
            <div>
              <IconButton
                sx={{ height: "3rem", width: "3rem" }}
                onClick={() => setExpanded(false)}
              >
                <div className="text-sm md:text-2xl">
                  <FontAwesomeIcon
                    icon={expanded ? faChevronUp : faChevronDown}
                    color="black"
                  />
                </div>
              </IconButton>
            </div>
          </div>
          <h1 className="text-lg">{query.question}</h1>
          <h1 className="text-lg font-bold">Context</h1>
          <h1 className="text-lg">{query.context}</h1>
          <h1 className="text-lg font-bold">Answer</h1>
          {query.answer.type === "mcq" ? (
            <div className="flex flex-col gap-1">
              {query.answer.options.map((option, index) => (
                <div key={index} className="flex flex-row gap-2">
                  <input
                    type="radio"
                    checked={query.answer.correct === index}
                  />
                  <h1 className="text-lg">{option}</h1>
                </div>
              ))}
            </div>
          ) : (
            <h1 className="text-lg">{query.answer.correct}</h1>
          )}
          <div className="flex flex-row gap-2 mx-auto">
            <Button variant="contained" color="primary">
              Ask Gemini
            </Button>
            <Button variant="contained" color="primary">
              Ask GPT
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-row gap-1 border-2 border-black items-center p-1 rounded-md">
          <h1 className="text-lg w-[95%]">{query.question}</h1>
          <div>
            <IconButton
              sx={{ height: "3rem", width: "3rem" }}
              onClick={() => setExpanded(true)}
            >
              <div className="text-sm md:text-2xl">
                <FontAwesomeIcon
                  icon={expanded ? faChevronUp : faChevronDown}
                  color="black"
                />
              </div>
            </IconButton>
          </div>
        </div>
      )}
    </div>
  );
}
export default function Home() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [query, setQuery] = useState({
    question: "",
    answer: {
      type: "mcq",
      options: [],
      correct: -1,
    },
    context: "",
  });
  const [addPlace, setAddPlace] = useState(null);
  const [context, setContext] = useState([]);
  const [newOption, setNewOption] = useState("");
  const [queries, setQueries] = useState([]);
  const placeToContext = (e) => {
    let place = e.place;
    let attributes = e.selectedAttributes;
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
      text += `Location: ${
        attributes.includes("formatted_address") ? place.formatted_address : ""
      }(${attributes.includes("geometry") ? lat + ", " + lng : ""}). `;
    }
    if (attributes.includes("opening_hours")) {
      text += `Open: ${place.opening_hours.weekday_text.join(", ")}. `;
    }
    if (attributes.includes("rating")) {
      text += `Rating: ${place.rating}. (${place.user_ratings_total} ratings). `;
    }
    return text;
  };
  const fetchQueries = async () => {
    try {
      const res = await queryApi.getQueries();
      if (res.success) {
        console.log("Data: ", res.data);
        setQueries(res.data);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const fetchPlaces = async () => {
    try {
      const res = await placeApi.getPlaces();
      if (res.success) {
        // save in lexigraphical order of name
        console.log("Data: ", res.data);
        res.data.sort((a, b) => a.name.localeCompare(b.name));
        setSavedPlaces(res.data);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchPlaces();
    fetchQueries();
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();
    try {
      const service = new google.maps.places.PlacesService(
        document.getElementById("map")
      );
      const request = {
        query: search,
        fields: ["name", "formatted_address", "place_id", "geometry"],
      };
      service.textSearch(request, (places, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && places) {
          setResults(places);
        }
      });
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleSelectPlace = (place) => {
    if (selectedPlace === place) {
      setSelectedPlace(null);
    } else {
      setSelectedPlace(place);
    }
  };

  const handleSave = () => {
    console.log("Saved: ", selectedPlace);
    // Save the selected place as needed
    try {
      const service = new google.maps.places.PlacesService(
        document.getElementById("map")
      );
      const request = {
        placeId: selectedPlace["place_id"],
      };
      service.getDetails(request, async (place, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          place &&
          place.geometry &&
          place.geometry.location
        ) {
          console.log("Saving:", place);
          const res = await placeApi.createPlace(place);
          if (res.success) {
            console.log("Place saved successfully");
            // Add the saved place to the list
            setSavedPlaces([...savedPlaces, place]);
          }
        }
      });
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-row gap-1 bg-black">
      <div className="w-1/2 flex flex-col items-center p-5 bg-white">
        <h1 className="text-3xl">Map Dataset Creator</h1>

        <h1 className="bg-black h-1 w-full my-2"></h1>
        <label className="text-lg w-full text-left font-bold">Question</label>
        <textarea
          className="border border-black w-full"
          value={query.question}
          onChange={(e) =>
            setQuery((prev) => ({ ...prev, question: e.target.value }))
          }
        />

        <FormControl fullWidth>
          <FormLabel id="demo-radio-buttons-group-label">
            <label className="text-lg w-full text-left font-bold text-black focus:text-black">
              Type
            </label>
          </FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="mcq"
            name="radio-buttons-group"
            value={query.answer.type}
            onChange={(e) =>
              setQuery((prev) => ({
                ...prev,
                answer: {
                  ...prev.answer,
                  type: e.target.value,
                  correct: e.target.value === "mcq" ? -1 : "",
                  options: e.target.value === "mcq" ? [] : undefined,
                },
              }))
            }
            row
          >
            <FormControlLabel value="mcq" control={<Radio />} label="MCQ" />
            <FormControlLabel value="short" control={<Radio />} label="Short" />
            {/* <FormControlLabel value="other" control={<Radio />} label="Other" /> */}
          </RadioGroup>
        </FormControl>

        {query.answer.type === "mcq" ? (
          <div className="w-full">
            <FormLabel id="demo-radio-buttons-group-label">
              <label className="text-lg w-full text-left font-bold text-black focus:text-black">
                Answer
              </label>
            </FormLabel>

            <div className="flex flex-row justify-start items-center gap-2">
              <input
                type="text"
                placeholder="Option"
                className="border border-black rounded p-2"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
              />
              <button
                className="bg-blue-500 rounded-lg p-3"
                onClick={() => {
                  if (newOption === "") return;
                  setQuery((prev) => ({
                    ...prev,
                    answer: {
                      ...prev.answer,
                      options: [...prev.answer.options, newOption],
                    },
                  }));
                  setNewOption("");
                }}
              >
                + Add option
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {query.answer.options.map((option, index) => (
                <div
                  key={index}
                  className="flex flex-row justify-start items-center gap-2"
                >
                  <input
                    type="radio"
                    checked={query.answer.correct === index}
                    onChange={() =>
                      setQuery((prev) => ({
                        ...prev,
                        answer: { ...prev.answer, correct: index },
                      }))
                    }
                  />
                  <h1 className="text-lg">{option}</h1>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <label className="text-lg w-full text-left font-bold">Answer</label>
            <textarea
              className="border border-black w-full"
              value={query.answer.correct}
              onChange={(e) =>
                setQuery((prev) => ({
                  ...prev,
                  answer: { ...prev.answer, correct: e.target.value },
                }))
              }
            />
          </>
        )}

        <label className="text-lg w-full text-left font-bold">Context</label>
        <textarea
          className="border border-black w-full"
          value={query.context}
          onChange={(e) =>
            setQuery((prev) => ({ ...prev, context: e.target.value }))
          }
        />
        <button
          className="bg-blue-500 rounded-lg p-2 mt-2 w-full"
          onClick={async () => {
            const res = await queryApi.createQuery(query);
            if (res.success) {
              console.log("Query saved successfully");
            }
          }}
        >
          Save
        </button>
        <h1 className="bg-black h-1 w-full my-2"></h1>
        <h1 className="text-2xl w-full">Previous Queries</h1>
        <div className="flex flex-col gap-2 mt-1">
          {queries.map((query, index) => (
            <QueryCard key={index} query={query} />
          ))}
        </div>
      </div>
      <div className="flex flex-col w-1/2 bg-white gap-4  min-h-screen p-5">
        <div className="bg-white flex flex-col items-center">
          <h1 className="text-3xl text-black">Context Generator</h1>
          <p className="text-lg">Generate context for a given question</p>
          <h1 className="bg-black h-1 w-full mt-2"></h1>

          {/* <div className="border-4 w-full border-black rounded-lg">
            <div className="flex flex-col items-center bg-black">
              <h1 className="text-2xl text-white">Selected Places</h1>
              <p className="text-lg text-white">
                Places that are used in context
              </p>
            </div>
            <div className="flex flex-col m-3 p-1 bg-blue-400 gap-1">
              <div className="flex flex-row">
                <h1 className="text-lg w-[70%] text-center font-bold">Place</h1>
                <h1 className="text-lg w-[30%] text-center font-bold">Alias</h1>
              </div>
              {selectedPlaces.map((e, index) => (
                <div
                  key={index}
                  className="flex flex-row gap-1 items-center bg-white px-2"
                >
                  <h1
                    className={`flex flex-row justify-center full p-2 mt-2 w-[70%]`}
                  >
                
                    {e.place.name} - {e.place.formatted_address}
                  </h1>
                  <input
                    type="text"
                    placeholder="Alias"
                    value={e.alias}
                    className="border border-black p-2 w-[30%]"
                    onChange={(event) => {
                      const newSelectedPlaces = [...selectedPlaces];
                      newSelectedPlaces[index].alias = event.target.value;
                      setSelectedPlaces(newSelectedPlaces);
                    }}
                  />
                </div>
              ))}
            </div>
          </div> */}
        </div>

        <div className="flex flex-row gap-4">
          <div className="w-1/2 flex flex-col items-center bg-white border-4 rounded-lg border-black">
            <div className="flex flex-col bg-black w-full items-center p-1">
              <h1 className="text-3xl text-white">Offline: Choose a place</h1>
              <p className="text-base text-white">
                Choose a place from the database
              </p>
            </div>

            {/* <form
            className="flex flex-col items-center mt-10"
            onSubmit={handleSearch}
          >
            <input
              type="text"
              placeholder="Search for a place"
              className="border border-black rounded-lg p-2"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="bg-blue-500 rounded-lg p-2 mt-2 w-full"
              type="submit"
            >
              Search
            </button>
          </form> */}
            {/* Show the saved places */}
            {/* <button
              className="bg-blue-500 rounded-lg p-2 mt-2 w-full"
              onClick={fetchPlaces}
            >
              refresh
            </button> */}

            <div className="p-2 w-full overflow-y-auto max-h-[40vh] flex flex-col gap-1">
              {savedPlaces.map((place, index) => (
                <li key={index} className="flex flex-row gap-2 items-center">
                  <button
                    className={`border-black flex flex-row justify-center border w-full rounded-lg p-2 mt-2 ${
                      addPlace === place ? "bg-[#888888]" : "hover:bg-[#cccccc]"
                    }`}
                    onClick={() => {
                      if (addPlace === place) {
                        setAddPlace(null);
                      } else {
                        setAddPlace(place);
                      }
                    }}
                  >
                    {/* <h1 className="text-3xl">{index + 1}</h1> */}
                    {place.name} - {place.formatted_address}
                  </button>
                </li>
              ))}
            </div>
            {addPlace && (
              <button
                className="bg-blue-500 rounded-sm p-2 w-full"
                onClick={() => {
                  // Don't add if already added
                  if (
                    selectedPlaces.find((e) => e.place === addPlace) !==
                    undefined
                  ) {
                    setAddPlace(null);
                    return;
                  }
                  setSelectedPlaces([
                    ...selectedPlaces,
                    {
                      place: addPlace,
                      alias: "",
                      selectedAttributes: Object.keys(addPlace).filter(
                        (e) => addPlace[e] !== null
                      ),
                      attributes: Object.keys(addPlace).filter(
                        (e) => addPlace[e] !== null
                      ),
                    },
                  ]);
                  console.log(
                    Object.keys(addPlace).filter((e) => addPlace[e] !== null)
                  );
                  setAddPlace(null);
                }}
              >
                + Add
              </button>
            )}
          </div>
          <div className="w-1/2 flex flex-col items-center bg-white border-4 rounded-lg border-black gap-1">
            <div className="flex flex-col bg-black w-full items-center p-1">
              <h1 className="text-3xl text-white">
                Online: Search for a place
              </h1>
              <p className="text-base text-center text-white">
                Search for a place and save it to the database
              </p>
            </div>
            <div className="p-2 w-full overflow-y-auto max-h-[40vh] flex flex-col gap-2">
              <form
                className="flex flex-col items-center w-full"
                onSubmit={handleSearch}
              >
                <input
                  type="text"
                  placeholder="Search for a place"
                  className="border border-black rounded-lg p-2 w-full"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  className="bg-blue-500 rounded-lg p-2 mt-2 w-full"
                  type="submit"
                >
                  Search
                </button>
              </form>

              {/* <h1 className="bg-black h-1 w-full my-2"></h1> */}
              <ul className="flex flex-col gap-2">
                {results.map((place, index) => (
                  <li key={index}>
                    <button
                      className={`border-black border rounded-lg p-2 w-full ${
                        selectedPlace === place
                          ? "bg-[#888888]"
                          : "hover:bg-[#cccccc]"
                      }`}
                      onClick={() => handleSelectPlace(place)}
                    >
                      {place.name} - {place.formatted_address}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            {selectedPlace && (
              <button
                className="bg-blue-500 rounded-sm p-2 mt-2 w-full"
                onClick={handleSave}
              >
                Save
              </button>
            )}
          </div>
        </div>

        {selectedPlaces.length > 0 && (
          <div className="border-4 w-full border-black rounded-lg">
            <div className="flex flex-col items-center bg-black">
              <h1 className="text-2xl text-white">Generated Context</h1>
              <p className="text-lg text-white">
                Assign alias to the places and generate context
              </p>
            </div>
            <div className="flex flex-col items-center px-2">
              <div className="flex flex-col m-3 p-1 bg-blue-500 gap-1 w-full">
                <div className="flex flex-row">
                  <h1 className="text-lg w-[70%] text-center font-bold">
                    Place
                  </h1>
                  <h1 className="text-lg w-[30%] text-center font-bold">
                    Alias
                  </h1>
                </div>

                {selectedPlaces.map((e, index) => (
                  <div
                    key={index}
                    className="flex flex-row gap-1 items-center bg-white p-2"
                  >
                    <div className="flex flex-col gap-2 w-[70%]">
                      <h1 className={`w-full text-left`}>
                        {/* <h1 className="text-3xl">{index + 1}</h1> */}
                        {e.place.name} - {e.place.formatted_address}
                      </h1>
                      <FormControl
                        // fullWidth
                        className="input-field"
                        variant="outlined"
                        style={{ width: "20rem" }}
                        size="small"
                      >
                        <InputLabel
                          htmlFor="outlined-adornment"
                          className="input-label"
                        >
                          Attributes
                        </InputLabel>
                        <Select
                          required
                          multiple
                          id="outlined-adornment"
                          className="outlined-input"
                          value={e.selectedAttributes}
                          onChange={(event) => {
                            const newAttributes = event.target.value;
                            const newSelectedPlaces = [...selectedPlaces];
                            console.log("New Attributes: ", newAttributes);
                            console.log(
                              "Old Attributes: ",
                              newSelectedPlaces[index].selectedAttributes
                            );
                            newSelectedPlaces[index].selectedAttributes =
                              newAttributes;
                            setSelectedPlaces(newSelectedPlaces);
                          }}
                          input={<OutlinedInput label={"Attributes"} />}
                          // MenuProps={MenuProps}
                        >
                          {e.attributes.map((value, index) => (
                            <MenuItem
                              key={index}
                              value={value}
                              // sx={{ width: "2rem" }}
                              // style={getStyles(name, personName, theme)}
                            >
                              {value}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                    <input
                      type="text"
                      placeholder="Alias"
                      value={e.alias}
                      className="border border-black p-2 w-[30%]"
                      onChange={(event) => {
                        const newSelectedPlaces = [...selectedPlaces];
                        newSelectedPlaces[index].alias = event.target.value;
                        setSelectedPlaces(newSelectedPlaces);
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="p-2 flex flex-col gap-2 w-full">
                {context.map((text, index) => (
                  <h1 key={index} className="w-full text-left">
                    {text}
                  </h1>
                ))}
              </div>
              <button
                className="bg-blue-500 rounded-lg p-2 m-2 w-full"
                onClick={() => {
                  // From selected places generate context
                  let newContext = [];
                  selectedPlaces.forEach((e) => {
                    newContext.push(
                      `Information of ${
                        e.alias === "" ? e.place.name : e.alias
                      }: ${placeToContext(e)}`
                    );
                  });
                  setContext(newContext);
                }}
              >
                Generate
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="hidden" id="map"></div>
    </main>
  );
}
