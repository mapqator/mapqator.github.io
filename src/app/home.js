import DatasetCreator from "./DatasetCreator";
import ContextGenerator from "./ContextGenerator";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-row gap-1 bg-black">
      <DatasetCreator />
      <ContextGenerator />
    </main>
  );
}
