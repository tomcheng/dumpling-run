import { getAdjacents } from "./gridUtils";

it("gets coordinates of unit block", () => {
  const grid = [["red"]];
  const start = [0, 0];

  const block = getAdjacents(grid, start);

  expect(block).toEqual([[0, 0]]);
});

it("gets coordinates of two element block", () => {
  const grid = [["red", "red"]];
  const start = [0, 1];

  const block = getAdjacents(grid, start);

  expect(block.length).toBe(2);
  expect(block).toContainEqual([0, 0]);
  expect(block).toContainEqual([0, 1]);
});

it("handles a u shape block", () => {
  const grid = [
    ["red", "blue", "red"],
    ["red", "blue", "red"],
    ["red", "red", "red"]
  ];
  const start = [0, 0];

  const block = getAdjacents(grid, start);

  expect(block.length).toBe(7);
  expect(block).toContainEqual([0, 0]);
  expect(block).toContainEqual([0, 2]);
  expect(block).toContainEqual([1, 0]);
  expect(block).toContainEqual([1, 2]);
  expect(block).toContainEqual([2, 0]);
  expect(block).toContainEqual([2, 1]);
  expect(block).toContainEqual([2, 2]);
});
