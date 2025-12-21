export const OMEGA = Infinity;

export class PetriNet {
	constructor(places, transitions, initialMarking, input, output) {
		this.places = places; // array of place names
		this.transitions = transitions; // array of transition names
		this.initialMarking = initialMarking; // initial marking array
		this.input = input; // input arcs matrix
		this.output = output; // output arcs matrix
	}

	// check if a transition is enabled at a given marking
	isTransitionEnabled(marking, transition) {
		const tIndex = this.transitions.indexOf(transition);
		if (tIndex === -1) return false;

		for (let p = 0; p < this.places.length; p++) {
			const requiredTokens = this.input[transition][p];
			const availableTokens = marking[p];

			// if available is ω, always enabled
			if (availableTokens === OMEGA) continue;

			//if required > available, not enabled
			if (requiredTokens > availableTokens) {
				return false;
			}
		}
		return true;
	}

	// get all enabled transitions at a marking
	getEnabledTransitions(marking) {
		return this.transitions.filter((t) => this.isTransitionEnabled(marking, t));
	}

	// fire a transition and return new marking
	fireTransition(marking, transition) {
		if (!this.isTransitionEnabled(marking, transition)) {
			throw new Error(`Transition ${transition} is not enabled`);
		}

		const newMarking = [...marking];
		const tIndex = this.transitions.indexOf(transition);

		for (let p = 0; p < this.places.length; p++) {
			// Handles ω specially
			if (newMarking[p] === OMEGA) {
				// ω - n = ω, ω + n = ω
				continue;
			}

			const consumed = this.input[transition][p] || 0;
			const produced = this.output[transition][p] || 0;

			newMarking[p] = newMarking[p] - consumed + produced;
		}

		return newMarking;
	}
}
