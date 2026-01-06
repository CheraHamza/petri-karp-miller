import { PetriNet } from "./petri-net.js";
import {
	karpMiller,
	printCoverabilityTree,
	isBounded,
	quasiLiveTransitions,
	liveTransitions,
} from "./karp-miller.js";
import { loadPetriNetFromJSON } from "./json-loader.js";
import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function analyzePetriNet(net, netName) {
	console.log("=".repeat(80));
	console.log(`${netName}`);
	console.log("=".repeat(80));

	// Build coverability tree
	const root = karpMiller(net);

	// Print tree
	console.log("\nCoverability Tree:\n");
	console.log(printCoverabilityTree(root));

	// Analyze properties
	const bounded = isBounded(root);
	const quasiLive = quasiLiveTransitions(root, net);
	const live = liveTransitions(root, net);

	console.log("\nAnalysis Results:");
	console.log("-".repeat(80));
	console.log(`Bounded: ${bounded ? "YES" : "NO"}`);
	console.log(
		`Quasi-live transitions: ${
			Object.entries(quasiLive)
				.filter(([t, v]) => v)
				.map(([t]) => t)
				.join(", ") || "NONE"
		}`
	);
	console.log(
		`Not quasi-live: ${
			Object.entries(quasiLive)
				.filter(([t, v]) => !v)
				.map(([t]) => t)
				.join(", ") || "NONE"
		}`
	);
	console.log(
		`Live transitions: ${
			Object.entries(live)
				.filter(([t, v]) => v)
				.map(([t]) => t)
				.join(", ") || "NONE"
		}`
	);

	console.log("\n");
}

// note: path must be an absolute path
function analyseFromFile(filePath) {
	const netName = JSON.parse(readFileSync(filePath, "utf-8")).name;
	const net = loadPetriNetFromJSON(filePath);
	analyzePetriNet(net, netName);
}

const examplesDir = join(__dirname, "..", "examples");

// analyse all files
// const files = readdirSync(examplesDir);
// for (const file of files) {
// 	analyseFromFile(join(examplesDir, file));
// }

// analyse one file
analyseFromFile(join(examplesDir, "example4-givenexample.json"));
