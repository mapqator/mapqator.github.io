"use client";

import DatasetCreator from "./DatasetCreator";
import ContextGenerator from "./ContextGenerator";
import { useState } from "react";

export default function Home() {
  const [contextJSON, setContextJSON] = useState({});
  const [context, setContext] = useState([]);
  return (
    <main className="flex min-h-screen flex-col bg-black">
      <div className="flex flex-row gap-1">
        <DatasetCreator contextJSON={contextJSON} context={context} />
        <ContextGenerator
          setContextJSON={setContextJSON}
          context={context}
          setContext={setContext}
        />
      </div>

      <footer className="w-full h-20 text-white flex items-center justify-center">
        © Mahir Labib Dihan
      </footer>
    </main>
  );
}
