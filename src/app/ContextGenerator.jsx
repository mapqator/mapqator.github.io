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
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [distances, setDistances] = useState([
    {
      from: null,
      to: null,
      attributes: ["duration", "distance"],
      value: { duration: "", distance: "" },
    },
  ]);

  const [addPlace, setAddPlace] = useState(null);
  const [context, setContext] = useState([]);

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
        // save in lexigraphical order of name
        console.log("Data: ", res.data);
        res.data.sort((a, b) => a.name.localeCompare(b.name));
        setSavedPlaces(res.data);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

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
  const handleSave = async () => {
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
            console.log("Place saved successfully", res.data[0]);
            // Add the saved place to the list
            setSavedPlaces([...savedPlaces, res.data[0]]);
            console.log("Returning: ", res.data[0]);
            return res.data[0];
          }
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
            console.log("Place saved successfully", res.data[0]);
            // Add the saved place to the list
            setSavedPlaces([...savedPlaces, res.data[0]]);
            setSelectedPlaces([
              ...selectedPlaces,
              {
                place: res.data[0],
                alias: "",
                selectedAttributes: ["formatted_address", "geometry"],
                attributes: Object.keys(res.data[0]).filter(
                  (e) => res.data[0][e] !== null
                ),
              },
            ]);
            setSelectedPlace(null);
            return res.data[0];
          }
        }
      });
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleAdd = (place) => {
    // Don't add if already added
    console.log("Place: ", place);
    if (place === null || place === undefined) return;
    if (selectedPlaces.find((e) => e.place === place) !== undefined) {
      setAddPlace(null);
      return;
    }
    setSelectedPlaces([
      ...selectedPlaces,
      {
        place: place,
        alias: "",
        selectedAttributes: ["formatted_address", "geometry"],
        attributes: Object.keys(place).filter((e) => place[e] !== null),
      },
    ]);

    setAddPlace(null);
  };

  const handleDistanceAdd = () => {
    const prev = distances[distances.length - 1];
    console.log(
      "->",
      "place_id:" + prev.from.place.place_id,
      "place_id:" + prev.to.place.place_id
    );
    if (prev.from === null || prev.to === null) return;
    // Fetch the distance between the two places from google maps
    const service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [prev.from.place.formatted_address],
        destinations: [prev.to.place.formatted_address],
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
          const newDistances = [...distances];
          newDistances[distances.length - 1].value = {
            duration: distance.duration.text,
            distance: distance.distance.text,
          };
          console.log("Distance: ", newDistances[distances.length - 1].value);
          setDistances([
            ...newDistances,
            {
              from: null,
              to: null,
              attributes: ["duration", "distance"],
              value: { duration: "", distance: "" },
            },
          ]);
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

              {distances.length > 1 && (
                <div className="flex flex-col m-3 p-1 bg-blue-500 gap-1 w-full">
                  <div className="flex flex-row">
                    <h1 className="text-lg w-[30%] text-center font-bold">
                      From
                    </h1>
                    <h1 className="text-lg w-[30%] text-center font-bold">
                      To
                    </h1>
                    <h1 className="text-lg w-[30%] text-center font-bold">
                      Distance
                    </h1>
                    <h1 className="text-lg w-[30%] text-center font-bold">
                      Duration
                    </h1>
                  </div>

                  {distances.map((e, index) =>
                    index < distances.length - 1 ? (
                      <div
                        key={index}
                        className="flex flex-row gap-1 items-center bg-white p-2"
                      >
                        <h1 className={`text-center w-1/4`}>
                          {e.from.alias || e.from.place.name}
                        </h1>
                        <h1 className={`text-center w-1/4`}>
                          {e.to.alias || e.to.place.name}
                        </h1>
                        <h1 className={`text-center w-1/4`}>
                          {e.value.distance}
                        </h1>
                        <h1 className={`text-center w-1/4`}>
                          {e.value.duration}
                        </h1>
                      </div>
                    ) : null
                  )}
                </div>
              )}

              <div className="flex flex-row gap-2 w-full">
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
                      value={distances[distances.length - 1].from}
                      onChange={(event) => {
                        const newDistances = [...distances];
                        newDistances[distances.length - 1].from =
                          event.target.value;
                        setDistances(newDistances);
                      }}
                      input={<OutlinedInput label={"Attributes"} />}
                      // MenuProps={MenuProps}
                    >
                      {selectedPlaces.map((e, index) => (
                        <MenuItem
                          key={index}
                          value={e}
                          // sx={{ width: "2rem" }}
                          // style={getStyles(name, personName, theme)}
                        >
                          {e.alias || e.place.name}
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
                      value={distances[distances.length - 1].to}
                      onChange={(event) => {
                        const newDistances = [...distances];
                        newDistances[distances.length - 1].to =
                          event.target.value;
                        setDistances(newDistances);
                      }}
                      input={<OutlinedInput label={"Attributes"} />}
                      // MenuProps={MenuProps}
                    >
                      {selectedPlaces.map((e, index) => (
                        <MenuItem
                          key={index}
                          value={e}
                          // sx={{ width: "2rem" }}
                          // style={getStyles(name, personName, theme)}
                        >
                          {e.alias || e.place.name}
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

              <div className="p-2 flex flex-col gap-2 w-full">
                {context.map((text, index) => (
                  <h1 key={index} className="w-full text-left">
                    {text}
                  </h1>
                ))}
              </div>
              <div className="flex flex-row w-full gap-2 mb-2">
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
                    selectedPlaces.forEach((e) => {
                      const text = placeToContext(e);
                      if (text !== "")
                        newContext.push(
                          `Information of ${
                            e.alias === "" ? e.place.name : e.alias
                          }: ${text}`
                        );
                    });

                    distances.forEach((e, index) => {
                      if (index < distances.length - 1) {
                        newContext.push(
                          `Distance from ${
                            e.from.alias === ""
                              ? e.from.place.name
                              : e.from.alias
                          } to ${
                            e.to.alias === "" ? e.to.place.name : e.to.alias
                          } is ${e.value.distance} (${e.value.duration}).`
                        );
                      }
                    });
                    setContext(newContext);
                  }}
                  variant="contained"
                >
                  Generate
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="hidden" id="map"></div>
    </>
  );
}
