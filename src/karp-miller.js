import { OMEGA } from "./petri-net.js";
import { TreeNode } from "./tree-node.js";

// checks if two markings are identical
function markingsEqual(a, b) {
	if (!a || !b || a.length !== b.length) return false;
	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) return false;
	}
	return true;
}

// checks if marking "a" is greater than or equal to marking "b"
function markingGeq(a, b) {
	for (let i = 0; i < a.length; i++) {
		if (!(a[i] >= b[i])) return false;
	}
	return true;
}

function applyOmega(marking, ancestorMarkings) {
	// For each ancestor M'': if marking >= M'' and not equal,
	// set positions where marking > M'' to ω.
	for (const anc of ancestorMarkings) {
		if (markingGeq(marking, anc) && !markingsEqual(marking, anc)) {
			for (let i = 0; i < marking.length; i++) {
				if (marking[i] === OMEGA) continue;
				if (marking[i] > anc[i]) {
					marking[i] = OMEGA;
				}
			}
		}
	}
	return marking;
}

// Karp–Miller coverability tree construction
export function karpMiller(petriNet) {
	const root = new TreeNode([...petriNet.initialMarking]);
	const worklist = [root];

	while (worklist.length > 0) {
		const node = worklist.shift();

		//if identical to a marking on the path from root to node
		const ancestors = node.getPathMarkings().slice(0, -1); // exclude itself
		const isDuplicateOnPath = ancestors.some((m) =>
			markingsEqual(m, node.marking)
		);
		if (isDuplicateOnPath) {
			node.status = "old";
			continue;
		}

		// if there are no enabled transitions => dead-end
		const enabled = petriNet.getEnabledTransitions(node.marking);
		if (enabled.length === 0) {
			node.status = "dead-end";
			continue;
		}

		// for each enabled transition, fire, apply omega, add child as new
		for (const t of enabled) {
			const fired = petriNet.fireTransition(node.marking, t);
			const omegaAppliedNodes = applyOmega(
				[...fired],
				node.getPathMarkings()
			);
			const child = new TreeNode(omegaAppliedNodes, node, t);
			node.addChild(child);
			worklist.push(child);
		}

		node.status = "expanded";
	}

	return root;
}

export function isBounded(root) {
	const queue = [root];
	while (queue.length) {
		const n = queue.shift();
		if (n.marking.some((v) => v === OMEGA)) return false;
		for (const c of n.children) queue.push(c);
	}
	return true;
}

export function quasiLiveTransitions(root, petriNet) {
	const result = {};
	for (const t of petriNet.transitions) result[t] = false;

	const queue = [root];
	while (queue.length) {
		const n = queue.shift();
		for (const t of petriNet.transitions) {
			if (!result[t] && petriNet.isTransitionEnabled(n.marking, t)) {
				result[t] = true;
			}
		}
		for (const c of n.children) queue.push(c);
	}
	return result;
}

// liveness: a transition t is live if, for every node,
// there exists a descendant (including possibly itself) where t is enabled.
function subtreeHasEnabled(node, t, petriNet) {
	if (petriNet.isTransitionEnabled(node.marking, t)) return true;
	for (const c of node.children) {
		if (subtreeHasEnabled(c, t, petriNet)) return true;
	}
	return false;
}

export function liveTransitions(root, petriNet) {
	const result = {};
	for (const t of petriNet.transitions) {
		let live = true;
		const queue = [root];
		while (queue.length && live) {
			const n = queue.shift();
			if (!subtreeHasEnabled(n, t, petriNet)) {
				live = false;
				break;
			}
			for (const c of n.children) queue.push(c);
		}
		result[t] = live;
	}
	return result;
}

// Utility: replace Infinity with ω
function formatMarking(marking) {
	return `[${marking.map((v) => (v === OMEGA ? "ω" : String(v))).join(", ")}]`;
}

export function printCoverabilityTree(root) {
	const lines = [];
	function dfs(node, depth = 0) {
		const prefix = "  ".repeat(depth);
		const status = node.status;
		const edge = node.transitionFromParent
			? ` --${node.transitionFromParent}--> `
			: "";
		const header = `${prefix}${edge}${formatMarking(node.marking)} [${status}]`;
		lines.push(header);
		for (const child of node.children) dfs(child, depth + 1);
	}
	dfs(root);
	return lines.join("\n");
}
