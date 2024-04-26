"use client";

import React, { useEffect, useState } from "react";
import QueryApi from "@/api/queryApi";
const queryApi = new QueryApi();
import FormControl from "@mui/material/FormControl";
import {
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  Button,
  TextField,
} from "@mui/material";
import QueryCard from "./QueryCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import QueryForm from "./QueryForm";

export default function DatasetCreator({
  contextJSON,
  setContextJSON,
  context,
  setContext,
  setSelectedPlacesMap,
  setDistanceMatrix,
  setNearbyPlacesMap,
}) {
  const [queries, setQueries] = useState([]);
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
  useEffect(() => {
    fetchQueries();
  }, []);
  return (
    <div className="w-1/2 flex flex-col items-center p-5 bg-white gap-2">
      <div className="bg-white flex flex-col items-center w-full">
        <h1 className="text-3xl">Map Dataset Creator</h1>
        <p className="text-lg">
          Write question and answers with appropriate contexts
        </p>
        <h1 className="bg-black h-1 w-full my-2"></h1>
      </div>
      <QueryForm {...{ contextJSON, context }} />
      {/*<h1 className="bg-black h-1 w-full my-2"></h1>*/}
      {/*<h1 className="text-2xl w-full">Previous Queries</h1>*/}
      <div className="flex flex-col gap-2 mt-1">
        {queries.map((query, index) => (
          <QueryCard
            key={index}
            query={query}
            index={index}
            {...{
              setSelectedPlacesMap,
              setDistanceMatrix,
              setNearbyPlacesMap,
              setContextJSON,
              setContext,
              context,
              contextJSON,
            }}
          />
        ))}
      </div>
    </div>
  );
}
