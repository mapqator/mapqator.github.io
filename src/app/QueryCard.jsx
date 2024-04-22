"use client";

import React, { useState } from "react";
import { IconButton, Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

export default function QueryCard({ query }) {
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
          <h1 className="text-lg font-bold">Context</h1>
          <h1 className="text-lg">{query.context}</h1>
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
