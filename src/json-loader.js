import { readFileSync } from "fs";
import { PetriNet } from "./petri-net.js";

export function loadPetriNetFromJSON(filePath) {
	const data = JSON.parse(readFileSync(filePath, "utf-8"));

	if (!data.places || !data.transitions || !data.initialMarking) {
		throw new Error(
			"Invalid JSON: must include places, transitions, and initialMarking"
		);
	}

	if (!data.input || !data.output) {
		throw new Error("Invalid JSON: must include input and output arc matrices");
	}

	return new PetriNet(
		data.places,
		data.transitions,
		data.initialMarking,
		data.input,
		data.output
	);
}
