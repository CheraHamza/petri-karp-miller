# Petri Karp-Miller Algorithm

This repository contains an implementation of the Petri Karp-Miller algorithm, as part of a project for the course "Specification and Verification of Systems (SVS)" at the University of Constantine 2 Abdelhamid Mehri.

## Features

- Karp–Miller coverability tree construction for Petri nets.
- ω-application to finitely represent potentially infinite state spaces.
- Text visualization of the coverability tree.
- Property analysis: boundedness, quasi-liveness, and liveness.
- **JSON input support** for easy test case creation

## Languages and Tools

- JavaScript (Node.js)
- npm for package management

## Requirements (versions used for development)

- Node.js v22.14.0
- npm v10.9.2

## Installation & Run

1. Clone the repository
2. Navigate to the project directory
3. Run the application:
   ```bash
    node src/index.js          # modify src/index.js to change input file
   ```

## JSON Input Format

You can define Petri nets in JSON files with the following structure:

```json
{
	"name": "Example Name",
	"places": ["p1", "p2", "p3"],
	"transitions": ["t1", "t2"],
	"initialMarking": [1, 0, 0],
	"input": {
		"t1": [1, 0, 0],
		"t2": [0, 1, 1]
	},
	"output": {
		"t1": [0, 1, 0],
		"t2": [1, 0, 1]
	}
}
```

The `input` and `output` objects map transition names to arrays representing tokens consumed/produced at each place.

## Example Test Cases

The `examples/` directory contains 4 simple test cases demonstrating different Petri net properties:

1. **example1-bounded.json** - Simple cyclic bounded net
2. **example2-unbounded.json** - Unbounded producer (ω in coverability tree)
3. **example3-deadend.json** - Net with dead-end states
4. **example4-givenexample.json** - Given example from the project description

### Notes

- ω is represented with `Infinity` and printed as `ω`.
