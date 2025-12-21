import { PetriNet, OMEGA } from "./petri-net.js";

// Testing petriNet class functionality 
const places = ["p1", "p2"];
const transitions = ["t1", "t2"];
const initial = [1, 0];
const input = { t1: [1, 0], t2: [0, 1] };
const output = { t1: [0, 1], t2: [1, 0] };

const net = new PetriNet(places, transitions, initial, input, output);

let marking = initial;
console.log("start", marking);
console.log("enabled at start", net.getEnabledTransitions(marking));

marking = net.fireTransition(marking, "t1");
console.log("after t1", marking);
console.log("enabled now", net.getEnabledTransitions(marking));

marking = net.fireTransition(marking, "t2");
console.log("after t2", marking);

const omegaMarking = [OMEGA, 0];
console.log("ω marking enabled", net.getEnabledTransitions(omegaMarking));
