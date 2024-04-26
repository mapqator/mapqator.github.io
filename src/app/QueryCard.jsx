"use client";

import React, { useState } from "react";
import { IconButton, Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import QueryApi from "@/api/queryApi";
import QueryFields from "./QueryFields";
const queryApi = new QueryApi();
export default function QueryCard({
  query,
  index,
  setSelectedPlacesMap,
  setDistanceMatrix,
  setNearbyPlacesMap,
  setContext,
  context,
  setContextJSON,
  contextJSON,
}) {
  const [expanded, setExpanded] = useState(false);
  const [mode, setMode] = useState("view");

  return (
    <div className="flex flex-col border-4 border-black rounded-md">
      <div className="flex flex-row items-center justify-between bg-black">
        <h1 className="text-2xl font-bold text-white pl-2"> # {index + 1}</h1>
        <div>
          <IconButton
            sx={{ height: "3rem", width: "3rem" }}
            onClick={() => setExpanded((prev) => !prev)}
          >
            <div className="text-sm md:text-2xl">
              <FontAwesomeIcon
                icon={expanded ? faChevronUp : faChevronDown}
                color="white"
              />
            </div>
          </IconButton>
        </div>
      </div>
      {mode === "edit" ? (
        <QueryFields
          {...{ contextJSON, context }}
          onSave={async (new_query) => {
            const res = await queryApi.updateQuery(query.id, new_query);
            setMode("view");
            window.location.reload();
          }}
          initialQuery={query}
        />
      ) : expanded ? (
        <div className="px-1 pb-1">
          <h1 className="text-lg font-bold underline">Context (Template)</h1>
          <h1 className="text-lg">{query.context}</h1>
          <h1 className="text-lg font-bold underline">Context (GPT)</h1>
          <h1 className="text-lg">{query.context_gpt}</h1>

          <h1 className="text-xl font-bold underline">Question</h1>
          <h1 className="text-lg">{query.question}</h1>

          <h1 className="text-lg font-bold underline">Answer</h1>
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
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                // Copy the question + context to the clipboard
                navigator.clipboard.writeText(
                  `${query.question}\nContext:${query.context}`
                );
              }}
            >
              Copy
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<FontAwesomeIcon icon={faPen} />}
              onClick={async () => {
                setSelectedPlacesMap(query.context_json.places);
                setDistanceMatrix(query.context_json.distance_matrix);
                setNearbyPlacesMap(query.context_json.nearby_places);
                setContext([]);
                setContextJSON({});
                setMode("edit");
              }}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<FontAwesomeIcon icon={faTrash} />}
              onClick={async () => {
                // Delete the question from the database
                console.log("Delete question");
                const response = await queryApi.deleteQuery(query.id);
                // rrerender the page
                window.location.reload();
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      ) : (
        <h1 className="text-lg px-1">{query.question}</h1>
      )}
    </div>
  );
}
