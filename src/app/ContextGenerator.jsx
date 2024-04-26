"use client";

import React, { useEffect, useState } from "react";
import PlaceApi from "@/api/placeApi";
const placeApi = new PlaceApi();
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Select, MenuItem, Button, TextField, IconButton } from "@mui/material";
import OnlineSearch from "./OnlineSearch";
import OfflineSearch from "./OfflineSearch";
import PlaceInformation from "./PlaceInformation";
import DistanceInformation from "./DistanceInformation";
import NearbyInformation from "./NearbyInformation";
import ContextPreview from "./ContextPreview";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";

export default function ContextGenerator({
  setContextJSON,
  context,
  setContext,
  distanceMatrix,
  setDistanceMatrix,
  selectedPlacesMap,
  setSelectedPlacesMap,
  nearbyPlacesMap,
  setNearbyPlacesMap,
}) {
  const [savedPlacesMap, setSavedPlacesMap] = useState({});

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

  useEffect(() => {
    fetchPlaces();
  }, []);

  return (
    <>
      <div className="flex flex-col w-1/2 bg-white gap-4  min-h-screen p-5">
        <div className="absolute top-5 right-5">
          <IconButton
            onClick={() => {
              setSelectedPlacesMap({});
              setDistanceMatrix({});
              setNearbyPlacesMap({});
              setContext([]);
              setContextJSON({});
            }}
          >
            <FontAwesomeIcon icon={faRefresh} color="black" />
          </IconButton>
        </div>
        <div className="bg-white flex flex-col items-center">
          <h1 className="text-3xl text-black">Context Generator</h1>
          <p className="text-lg">Generate context for a given question</p>
          <h1 className="bg-black h-1 w-full mt-2"></h1>
        </div>

        <div className="flex flex-row gap-4">
          <OfflineSearch
            savedPlacesMap={savedPlacesMap}
            selectedPlacesMap={selectedPlacesMap}
            setSelectedPlacesMap={setSelectedPlacesMap}
          />
          <OnlineSearch
            savedPlacesMap={savedPlacesMap}
            setSavedPlacesMap={setSavedPlacesMap}
            selectedPlacesMap={selectedPlacesMap}
            setSelectedPlacesMap={setSelectedPlacesMap}
          />
        </div>

        <PlaceInformation
          {...{ selectedPlacesMap, setSelectedPlacesMap, savedPlacesMap }}
        />

        <DistanceInformation
          {...{
            selectedPlacesMap,
            savedPlacesMap,
            distanceMatrix,
            setDistanceMatrix,
          }}
        />

        <NearbyInformation
          {...{
            savedPlacesMap,
            setSavedPlacesMap,
            selectedPlacesMap,
            savedPlacesMap,
            nearbyPlacesMap,
            setNearbyPlacesMap,
          }}
        />
        <ContextPreview
          {...{
            setContextJSON,
            context,
            setContext,
            savedPlacesMap,
            selectedPlacesMap,
            distanceMatrix,
            nearbyPlacesMap,
          }}
        />
      </div>
      <div className="hidden" id="map"></div>
    </>
  );
}
