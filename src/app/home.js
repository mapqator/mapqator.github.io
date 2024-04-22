import DatasetCreator from "./DatasetCreator";
import ContextGenerator from "./ContextGenerator";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col gap-1 bg-black">
      <div className="flex flex-row">
        <DatasetCreator />
        <ContextGenerator />
      </div>

      <footer className="w-full h-20 text-white flex items-center justify-center">
        © Mahir Labib Dihan
      </footer>
    </main>
  );
}
