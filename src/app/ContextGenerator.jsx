"use client";

import React, { useEffect, useState } from "react";
import PlaceApi from "@/api/placeApi";
const placeApi = new PlaceApi();
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Select, MenuItem, Button } from "@mui/material";

export default function ContextGenerator() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  // place_id -> place
  const [savedPlacesMap, setSavedPlacesMap] = useState({});

  // place: place_id, alias: string, selectedAttributes: [string], attributes: [string]
  const [selectedPlacesMap, setSelectedPlacesMap] = useState({});

  const [distanceMatrix, setDistanceMatrix] = useState({});
  const [newDistance, setNewDistance] = useState({
    from: null,
    to: null,
  });

  const [addPlace, setAddPlace] = useState("");
  const [context, setContext] = useState([]);

  const [nearbyPlacesMap, setNearbyPlacesMap] = useState({}); // place_id -> place
  const [newNearbyPlaces, setNewNearbyPlaces] = useState({
    location: "",
    type: "",
    list: [],
  });
  const [nearbyPlacesResults, setNearbyPlacesResults] = useState([]); // list of places from nearby search

  const placeToContext = (place_id) => {
    let place = savedPlacesMap[place_id];
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
      text += `Location: ${
        attributes.includes("formatted_address") ? place.formatted_address : ""
      }${
        attributes.includes("geometry") ? "(" + lat + ", " + lng + ")" : ""
      }. `;
    }
    if (attributes.includes("opening_hours")) {
      text += `Open: ${place.opening_hours.weekday_text.join(", ")}. `;
    }
    if (attributes.includes("rating")) {
      text += `Rating: ${place.rating}. (${place.user_ratings_total} ratings). `;
    }
    return text;
  };

  const fetchPlaces = async () => {
    try {
      const res = await placeApi.getPlaces();
      if (res.success) {
        // create a map for easy access
        const newSavedPlacesMap = {};
        res.data.forEach((e) => {
          newSavedPlacesMap[e.place_id] = e;
        });
        setSavedPlacesMap(newSavedPlacesMap);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    if (search === "") return;
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

  const savePlaceToDatabase = async (place, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && place) {
      const res = await placeApi.createPlace(place);
      if (res.success) {
        const newSavedPlacesMap = { ...savedPlacesMap };
        newSavedPlacesMap[res.data[0].place_id] = res.data[0];
        setSavedPlacesMap(newSavedPlacesMap);
      }
    }
  };

  const handleSave = async () => {
    try {
      const service = new google.maps.places.PlacesService(
        document.getElementById("map")
      );
      const request = {
        placeId: selectedPlace["place_id"],
      };
      service.getDetails(request, savePlaceToDatabase);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const addNearbyPlaces = () => {
    const newSavedPlacesMap = { ...savedPlacesMap };
    const newSelectedPlacesMap = { ...selectedPlacesMap };
    const newNearbyPlacesMap = { ...nearbyPlacesMap };
    nearbyPlacesResults
      .filter((e) => e.selected)
      .forEach(async (e) => {
        if (newSavedPlacesMap[e.place.place_id] === undefined) {
          // not saved
          const service = new google.maps.places.PlacesService(
            document.getElementById("map")
          );
          const request = {
            placeId: e.place.place_id,
          };
          service.getDetails(request, async (place, status) => {
            if (
              status === google.maps.places.PlacesServiceStatus.OK &&
              place &&
              place.geometry &&
              place.geometry.location
            ) {
              const res = await placeApi.createPlace(place); //save
              if (res.success) {
                newSavedPlacesMap[res.data[0].place_id] = res.data[0];
                newSelectedPlacesMap[res.data[0].place_id] = {
                  alias: "",
                  selectedAttributes: ["formatted_address", "geometry"],
                  attributes: Object.keys(res.data[0]).filter(
                    (e) => res.data[0][e] !== null
                  ),
                };
                if (newNearbyPlacesMap[newNearbyPlaces.location]) {
                  newNearbyPlacesMap[newNearbyPlaces.location].list.push(
                    res.data[0].place_id
                  );
                } else {
                  newNearbyPlacesMap[newNearbyPlaces.location] = {
                    type: newNearbyPlaces.type,
                    list: [res.data[0].place_id],
                  };
                }
              }
            }
          });
        } else {
          if (newSelectedPlacesMap[e.place.place_id] === undefined) {
            newSelectedPlacesMap[e.place.place_id] = {
              alias: "",
              selectedAttributes: ["formatted_address", "geometry"],
              attributes: Object.keys(
                newSavedPlacesMap[e.place.place_id]
              ).filter(
                (key) => newSavedPlacesMap[e.place.place_id][key] !== null
              ),
            };
          }
          if (newNearbyPlacesMap[newNearbyPlaces.location]) {
            newNearbyPlacesMap[newNearbyPlaces.location].list.push(
              e.place.place_id
            );
          } else {
            newNearbyPlacesMap[newNearbyPlaces.location] = {
              type: newNearbyPlaces.type,
              list: [e.place.place_id],
            };
          }
        }
      });

    setNewNearbyPlaces({ location: null, type: "", list: [] });
    setSavedPlacesMap(newSavedPlacesMap);
    setSelectedPlacesMap(newSelectedPlacesMap);
    setNearbyPlacesMap(newNearbyPlacesMap);
    setNearbyPlacesResults([]);
  };

  const searchNearbyPlaces = async () => {
    if (newNearbyPlaces.location === null || newNearbyPlaces.type === "")
      return;
    try {
      const service = new google.maps.places.PlacesService(
        document.getElementById("map")
      );
      const request = {
        location: savedPlacesMap[newNearbyPlaces.location].geometry.location,
        // radius: prev.radius,
        type: newNearbyPlaces.type,
        rankBy: google.maps.places.RankBy.DISTANCE,
      };
      service.nearbySearch(request, async (places, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && places) {
          console.log("Nearby Places: ", places);
          const placesWithSelection = places.map((place) => ({
            selected: true,
            place,
          }));
          setNearbyPlacesResults(placesWithSelection);
        }
      });
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleAddSave = async () => {
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
            const newSavedPlacesMap = { ...savedPlacesMap };
            newSavedPlacesMap[res.data[0].place_id] = res.data[0];
            setSavedPlacesMap(newSavedPlacesMap);

            const newSelectedPlacesMap = { ...selectedPlacesMap };
            newSelectedPlacesMap[res.data[0].place_id] = {
              alias: "",
              selectedAttributes: ["formatted_address", "geometry"],
              attributes: Object.keys(res.data[0]).filter(
                (e) => res.data[0][e] !== null
              ),
            };
            setSelectedPlacesMap(newSelectedPlacesMap);

            setSelectedPlace(null);
            return res.data[0];
          }
        }
      });
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleAdd = (place_id) => {
    // Don't add if already added
    if (place_id === "") return;

    const newSelectedPlacesMap = { ...selectedPlacesMap };
    newSelectedPlacesMap[place_id] = {
      alias: "",
      selectedAttributes: ["formatted_address", "geometry"],
      attributes: Object.keys(savedPlacesMap[place_id]).filter(
        (key) => savedPlacesMap[place_id][key] !== null
      ),
    };
    setSelectedPlacesMap(newSelectedPlacesMap);

    setAddPlace("");
  };

  const handleDistanceAdd = () => {
    if (newDistance.from === "" || newDistance.to === "") return;
    // Fetch the distance between the two places from google maps
    const service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [savedPlacesMap[newDistance.from].formatted_address],
        destinations: [savedPlacesMap[newDistance.to].formatted_address],
        travelMode: google.maps.TravelMode.WALKING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
      },
      (response, status) => {
        if (status !== "OK") {
          console.log("Error was: ", status);
        } else {
          console.log("Response: ", response);
          const distance = response.rows[0].elements[0];
          const newDistanceMatrix = { ...distanceMatrix };
          if (newDistanceMatrix[newDistance.from])
            newDistanceMatrix[newDistance.from][newDistance.to] = {
              duration: distance.duration.text,
              distance: distance.distance.text,
            };
          else {
            newDistanceMatrix[newDistance.from] = {
              [newDistance.to]: {
                duration: distance.duration.text,
                distance: distance.distance.text,
              },
            };
          }
          setDistanceMatrix(newDistanceMatrix);
        }
      }
    );
  };
  useEffect(() => {
    fetchPlaces();
  }, []);

  return (
    <>
      <div className="flex flex-col w-1/2 bg-white gap-4  min-h-screen p-5">
        <div className="bg-white flex flex-col items-center">
          <h1 className="text-3xl text-black">Context Generator</h1>
          <p className="text-lg">Generate context for a given question</p>
          <h1 className="bg-black h-1 w-full mt-2"></h1>
        </div>

        <div className="flex flex-row gap-4">
          <div className="w-1/2 flex flex-col items-center bg-white border-4 rounded-lg border-black">
            <div className="flex flex-col bg-black w-full items-center p-1">
              <h1 className="text-3xl text-white">Offline: Choose a place</h1>
              <p className="text-base text-white">
                Choose a place from the database
              </p>
            </div>

            <div className="p-2 w-full overflow-y-auto max-h-[40vh] flex flex-col gap-1">
              {Object.keys(savedPlacesMap).map((place_id, index) => (
                <li key={index} className="flex flex-row gap-2 items-center">
                  <button
                    className={`border-black flex flex-row justify-center border w-full rounded-lg p-2 mt-2 ${
                      addPlace === place_id
                        ? "bg-[#888888]"
                        : "hover:bg-[#cccccc]"
                    }`}
                    onClick={() => {
                      if (addPlace === place_id) {
                        setAddPlace("");
                      } else {
                        setAddPlace(place_id);
                      }
                    }}
                  >
                    {savedPlacesMap[place_id].name} -{" "}
                    {savedPlacesMap[place_id].formatted_address}
                  </button>
                </li>
              ))}
            </div>
            {addPlace !== "" && (
              <button
                className="bg-blue-500 rounded-sm p-2 w-full"
                onClick={() => handleAdd(addPlace)}
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
              <div className="flex flex-row gap-[2px] pt-[2px] w-full bg-black">
                <Button
                  className="bg-blue-500 rounded-sm p-2 w-full"
                  onClick={handleAddSave}
                  variant="contained"
                  sx={{ fontSize: "1rem" }}
                >
                  Add
                </Button>
                <Button
                  className="bg-blue-500 rounded-sm p-2 w-full"
                  onClick={handleSave}
                  variant="contained"
                  sx={{ fontSize: "1rem" }}
                >
                  Save
                </Button>
              </div>
            )}
          </div>
        </div>

        {Object.keys(selectedPlacesMap).length > 0 && (
          <div className="border-4 w-full border-black rounded-lg">
            <div className="flex flex-col items-center bg-black">
              <h1 className="text-3xl text-white">Places Information</h1>
              <p className="text-lg text-white">Assign alias to the places</p>
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

                {Object.keys(selectedPlacesMap).map((place_id, index) => (
                  <div
                    key={index}
                    className="flex flex-row gap-1 items-center bg-white p-2"
                  >
                    <div className="flex flex-col gap-2 w-[70%]">
                      <h1 className={`w-full text-left`}>
                        {/* <h1 className="text-3xl">{index + 1}</h1> */}
                        {savedPlacesMap[place_id].name} -{" "}
                        {savedPlacesMap[place_id].formatted_address}
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
                          value={selectedPlacesMap[place_id].selectedAttributes}
                          onChange={(event) => {
                            const newAttributes = event.target.value;

                            const newSelectedPlacesMap = {
                              ...selectedPlacesMap,
                            };
                            newSelectedPlacesMap[place_id].selectedAttributes =
                              newAttributes;
                            setSelectedPlacesMap(newSelectedPlacesMap);
                          }}
                          input={<OutlinedInput label={"Attributes"} />}
                          // MenuProps={MenuProps}
                        >
                          {selectedPlacesMap[place_id].attributes.map(
                            (value, index) => (
                              <MenuItem
                                key={index}
                                value={value}
                                // sx={{ width: "2rem" }}
                                // style={getStyles(name, personName, theme)}
                              >
                                {value}
                              </MenuItem>
                            )
                          )}
                        </Select>
                      </FormControl>
                    </div>
                    <input
                      type="text"
                      placeholder="Alias"
                      value={selectedPlacesMap[place_id].alias}
                      className="border border-black p-2 w-[30%]"
                      onChange={(event) => {
                        const newSelectedPlacesMap = { ...selectedPlacesMap };
                        newSelectedPlacesMap[place_id].alias =
                          event.target.value;
                        setSelectedPlacesMap(newSelectedPlacesMap);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {Object.keys(selectedPlacesMap).length > 0 && (
          <div className="flex flex-col border-4 w-full border-black rounded-lg">
            <div className="flex flex-col items-center bg-black">
              <h1 className="text-3xl text-white">Distance Information</h1>
              <p className="text-lg text-white">
                Distance and Duration from one place to another
              </p>
            </div>
            {Object.keys(distanceMatrix).length > 0 && (
              <div className="flex flex-col m-3 p-1 bg-blue-500 gap-1">
                <div className="flex flex-row">
                  <h1 className="text-lg w-[30%] text-center font-bold">
                    From
                  </h1>
                  <h1 className="text-lg w-[30%] text-center font-bold">To</h1>
                  <h1 className="text-lg w-[30%] text-center font-bold">
                    Distance
                  </h1>
                  <h1 className="text-lg w-[30%] text-center font-bold">
                    Duration
                  </h1>
                </div>

                {Object.keys(distanceMatrix).map((from_id, index) => (
                  <div
                    key={index}
                    className="flex flex-row gap-1 items-center bg-white p-2"
                  >
                    <h1 className={`text-center w-1/4`}>
                      {selectedPlacesMap[from_id].alias ||
                        savedPlacesMap[from_id].name}
                    </h1>
                    <div className="flex flex-col w-3/4">
                      {Object.keys(distanceMatrix[from_id]).map(
                        (to_id, index) => (
                          <>
                            <div
                              key={index}
                              className="flex flex-row gap-1 items-center"
                            >
                              <h1 className={`text-center w-1/3`}>
                                {selectedPlacesMap[to_id].alias ||
                                  savedPlacesMap[to_id].name}
                              </h1>
                              <h1 className={`text-center w-1/3`}>
                                {distanceMatrix[from_id][to_id].distance}
                              </h1>
                              <h1 className={`text-center w-1/3`}>
                                {distanceMatrix[from_id][to_id].duration}
                              </h1>
                            </div>
                            {Object.keys(distanceMatrix[from_id]).length >
                              index + 1 && (
                              <div className="h-[1px] bg-black w-full"></div>
                            )}
                          </>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-row gap-2 w-full p-2">
              <div className="w-[40%]">
                <FormControl
                  fullWidth
                  className="input-field"
                  variant="outlined"
                  // style={{ width: "20rem" }}
                  size="small"
                >
                  <InputLabel
                    htmlFor="outlined-adornment"
                    className="input-label"
                  >
                    From
                  </InputLabel>
                  <Select
                    required
                    id="outlined-adornment"
                    className="outlined-input"
                    value={newDistance.from}
                    onChange={(event) => {
                      setNewDistance((prev) => ({
                        ...prev,
                        from: event.target.value,
                      }));
                    }}
                    input={<OutlinedInput label={"Attributes"} />}
                  >
                    {Object.keys(selectedPlacesMap).map((place_id, index) => (
                      <MenuItem key={index} value={place_id}>
                        {selectedPlacesMap[place_id].alias ||
                          savedPlacesMap[place_id].name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="w-[40%]">
                <FormControl
                  fullWidth
                  className="input-field"
                  variant="outlined"
                  // style={{ width: "20rem" }}
                  size="small"
                >
                  <InputLabel
                    htmlFor="outlined-adornment"
                    className="input-label"
                  >
                    To
                  </InputLabel>
                  <Select
                    required
                    id="outlined-adornment"
                    className="outlined-input"
                    value={newDistance.to}
                    onChange={(event) => {
                      setNewDistance((prev) => ({
                        ...prev,
                        to: event.target.value,
                      }));
                    }}
                    input={<OutlinedInput label={"Attributes"} />}
                  >
                    {Object.keys(selectedPlacesMap).map((place_id, index) => (
                      <MenuItem key={index} value={place_id}>
                        {selectedPlacesMap[place_id].alias ||
                          savedPlacesMap[place_id].name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="w-1/5">
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleDistanceAdd}
                >
                  + Add
                </Button>
              </div>
            </div>
          </div>
        )}

        {Object.keys(selectedPlacesMap).length > 0 && (
          <div className="flex flex-col border-4 w-full border-black rounded-lg">
            <div className="flex flex-col items-center bg-black">
              <h1 className="text-3xl text-white">Nearby Places</h1>
              <p className="text-lg text-white">
                Distance and Duration from one place to another
              </p>
            </div>

            {Object.keys(nearbyPlacesMap).length > 0 && (
              <div className="flex flex-col m-3 p-1 bg-blue-500 gap-1">
                <div className="flex flex-row">
                  <h1 className="text-lg w-1/3 text-center font-bold">
                    Location
                  </h1>
                  <h1 className="text-lg w-1/3 text-center font-bold">Type</h1>
                  <h1 className="text-lg w-1/3 text-center font-bold">Count</h1>
                </div>

                {Object.keys(nearbyPlacesMap).map((place_id, index) => (
                  <div
                    key={index}
                    className="flex flex-row gap-1 items-center bg-white p-2"
                  >
                    <h1 className={`text-center w-1/3`}>
                      {selectedPlacesMap[place_id].alias ||
                        savedPlacesMap[place_id].name}
                    </h1>
                    <h1 className={`text-center w-1/3`}>
                      {nearbyPlacesMap[place_id].type}
                    </h1>
                    <h1 className={`text-center w-1/3`}>
                      {nearbyPlacesMap[place_id].list.length}
                    </h1>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-row gap-2 w-full p-2">
              <div className="w-[40%]">
                <FormControl
                  fullWidth
                  className="input-field"
                  variant="outlined"
                  // style={{ width: "20rem" }}
                  size="small"
                >
                  <InputLabel
                    htmlFor="outlined-adornment"
                    className="input-label"
                  >
                    Location
                  </InputLabel>
                  <Select
                    required
                    id="outlined-adornment"
                    className="outlined-input"
                    value={newNearbyPlaces.location}
                    onChange={(event) => {
                      setNewNearbyPlaces((prev) => ({
                        ...prev,
                        location: event.target.value,
                      }));
                    }}
                    input={<OutlinedInput label={"Location"} />}
                    // MenuProps={MenuProps}
                  >
                    {Object.keys(selectedPlacesMap).map((place_id, index) => (
                      <MenuItem key={index} value={place_id}>
                        {selectedPlacesMap[place_id].alias ||
                          savedPlacesMap[place_id].name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <div className="w-[40%]">
                <FormControl
                  fullWidth
                  className="input-field"
                  variant="outlined"
                  // style={{ width: "20rem" }}
                  size="small"
                >
                  <InputLabel
                    htmlFor="outlined-adornment"
                    className="input-label"
                  >
                    Type
                  </InputLabel>
                  <Select
                    required
                    id="outlined-adornment"
                    className="outlined-input"
                    value={newNearbyPlaces.type}
                    onChange={(event) => {
                      setNewNearbyPlaces((prev) => ({
                        ...prev,
                        type: event.target.value,
                      }));
                    }}
                    input={<OutlinedInput label={"Type"} />}
                    // MenuProps={MenuProps}
                  >
                    {[
                      "accounting",
                      "airport",
                      "amusement_park",
                      "art_gallery",
                      "atm",
                      "bakery",
                      "bank",
                      "bar",
                      "beauty_salon",
                      "bicycle_store",
                      "book_store",
                      "bowling_alley",
                      "bus_station",
                      "cafe",
                      "campground",
                      "car_dealer",
                      "car_rental",
                      "car_repair",
                      "car_wash",
                      "casino",
                      "cemetery",
                      "church",
                      "city_hall",
                      "clothing_store",
                      "convenience_store",
                      "courthouse",
                      "dentist",
                      "department_store",
                      "doctor",
                      "drugstore",
                      "electrician",
                      "electronics_store",
                      "embassy",
                      "fire_station",
                      "florist",
                      "food",
                      "funeral_home",
                      "furniture_store",
                      "gas_station",
                      "gym",
                      "hair_care",
                      "hardware_store",
                      "health",
                      "hindu_temple",
                      "home_goods_store",
                      "hospital",
                      "insurance_agency",
                      "jewelry_store",
                      "laundry",
                      "lawyer",
                      "library",
                      "light_rail_station",
                      "liquor_store",
                      "local_government_office",
                      "locksmith",
                      "lodging",
                      "meal_delivery",
                      "meal_takeaway",
                      "mosque",
                      "movie_rental",
                      "movie_theater",
                      "moving_company",
                      "museum",
                      "night_club",
                      "painter",
                      "park",
                      "parking",
                      "pet_store",
                      "pharmacy",
                      "physiotherapist",
                      "place_of_worship",
                      "plumber",
                      "point_of_interest",
                      "police",
                      "political",
                      "post_office",
                      "primary_school",
                      "real_estate_agency",
                      "restaurant",
                      "roofing_contractor",
                      "rv_park",
                      "school",
                      "secondary_school",
                      "shoe_store",
                      "shopping_mall",
                      "spa",
                      "stadium",
                      "storage",
                      "store",
                      "subway_station",
                      "supermarket",
                      "taxi_stand",
                      "tourist_attraction",
                      "train_station",
                      "transit_station",
                      "travel_agency",
                      "university",
                      "veterinary_care",
                      "zoo",
                    ].map((type, index) => (
                      <MenuItem
                        key={index}
                        value={type}
                        // sx={{ width: "2rem" }}
                        // style={getStyles(name, personName, theme)}
                      >
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="w-1/5">
                <Button
                  variant="contained"
                  fullWidth
                  onClick={searchNearbyPlaces}
                >
                  Search
                </Button>
              </div>
            </div>
            {nearbyPlacesResults.length > 0 && (
              <div className="flex flex-col gap-2 p-2">
                {nearbyPlacesResults.map((e, index) => (
                  <div key={index} className="flex flex-row gap-2">
                    <input
                      type="checkbox"
                      checked={e.selected}
                      onChange={(event) => {
                        const newNearbyPlacesResults = [...nearbyPlacesResults];
                        newNearbyPlacesResults[index].selected =
                          event.target.checked;
                        setNearbyPlacesResults(newNearbyPlacesResults);
                      }}
                    />
                    <h1 className="overflow-hidden whitespace-nowrap overflow-ellipsis w-[95%]">
                      {e.place.name} | {e.place.vicinity}
                    </h1>
                  </div>
                ))}
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ fontSize: "1rem" }}
                  onClick={addNearbyPlaces}
                >
                  + Add
                </Button>
              </div>
            )}
          </div>
        )}
        {Object.keys(selectedPlacesMap).length > 0 && (
          <div className="flex flex-col border-4 w-full border-black rounded-lg">
            <div className="flex flex-col items-center bg-black">
              <h1 className="text-3xl text-white">Generated Context</h1>
              <p className="text-lg text-white">
                Context generated by our system
              </p>
            </div>
            <div className="p-2 flex flex-col gap-2 w-full">
              {context.map((text, index) => (
                <h1 key={index} className="w-full text-left">
                  {text}
                </h1>
              ))}
            </div>
            <div className="flex flex-row w-full gap-2 p-2">
              <Button
                className="bg-blue-500 rounded-lg p-2 my-2 w-full"
                onClick={() => {
                  navigator.clipboard.writeText(
                    context.reduce((acc, e) => acc + e + "\n", "")
                  );
                }}
                variant="contained"
              >
                Copy
              </Button>
              <Button
                className="bg-blue-500 rounded-lg p-2 my-2 w-full"
                onClick={() => {
                  // From selected places generate context
                  let newContext = [];
                  Object.keys(selectedPlacesMap).forEach((place_id) => {
                    const text = placeToContext(place_id);
                    if (text !== "")
                      newContext.push(
                        `Information of ${
                          selectedPlacesMap[place_id].alias ||
                          savedPlacesMap[place_id].name
                        }: ${text}`
                      );
                  });

                  Object.keys(distanceMatrix).forEach((from_id, index) => {
                    Object.keys(distanceMatrix[from_id]).forEach(
                      (to_id, index) => {
                        newContext.push(
                          `Distance from ${
                            selectedPlacesMap[from_id].alias ||
                            savedPlacesMap[from_id].name
                          } to ${
                            selectedPlacesMap[to_id].alias ||
                            savedPlacesMap[to_id].name
                          } is ${distanceMatrix[from_id][to_id].distance} (${
                            distanceMatrix[from_id][to_id].duration
                          }).`
                        );
                      }
                    );
                  });

                  Object.keys(nearbyPlacesMap).forEach((place_id, index) => {
                    newContext.push(
                      `Nearby places of ${
                        selectedPlacesMap[place_id].alias ||
                        savedPlacesMap[place_id].name
                      } of type ${nearbyPlacesMap[place_id].type} are:`
                    );
                    nearbyPlacesMap[place_id].list.forEach(
                      (near_place_id, index) => {
                        newContext.push(
                          `${index + 1}. ${
                            selectedPlacesMap[near_place_id].alias ||
                            savedPlacesMap[near_place_id].name
                          }`
                        );
                      }
                    );
                  });
                  setContext(newContext);
                }}
                variant="contained"
              >
                Generate
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="hidden" id="map"></div>
    </>
  );
}
