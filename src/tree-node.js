export class TreeNode {
	constructor(marking, parent = null, transitionFromParent = null) {
		this.marking = marking;
		this.parent = parent;
		this.transitionFromParent = transitionFromParent;
		this.children = [];
		this.status = "new"; // new | old | dead-end | expanded
	}

	addChild(child) {
		this.children.push(child);
	}

	// Returns array of ancestor nodes from root to this 
	getPathNodes() {
		const path = [];
		let cur = this;
		while (cur) {
			path.unshift(cur);
			cur = cur.parent;
		}
		return path;
	}

	// Returns markings on path from root to this
	getPathMarkings() {
		return this.getPathNodes().map((n) => n.marking);
	}
}

