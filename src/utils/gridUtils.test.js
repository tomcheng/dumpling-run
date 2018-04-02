import { getAdjacents } from "./gridUtils";

it("gets coordinates of unit block", () => {
  const blocks = [{ id: 1, row: 0, column: 0, color: "red" }];
  const startId = 1;

  const blockIds = getAdjacents(blocks, startId);

  expect(blockIds).toEqual([1]);
});

it("gets coordinates of two element block", () => {
  const blocks = [
    { id: 1, row: 0, column: 0, color: "red" },
    { id: 2, row: 1, column: 0, color: "red" }
  ];
  const startId = 1;

  const blockIds = getAdjacents(blocks, startId);

  expect(blockIds.length).toBe(2);
  expect(blockIds).toContain(1);
  expect(blockIds).toContain(2);
});

it("handles a u shape block", () => {
  const blocks = [
    { id: 1, row: 0, column: 0, color: "red" },
    { id: 2, row: 1, column: 0, color: "blue" },
    { id: 3, row: 2, column: 0, color: "red" },
    { id: 4, row: 0, column: 1, color: "red" },
    { id: 5, row: 1, column: 1, color: "blue" },
    { id: 6, row: 2, column: 1, color: "red" },
    { id: 7, row: 0, column: 2, color: "red" },
    { id: 8, row: 1, column: 2, color: "red" },
    { id: 9, row: 2, column: 2, color: "red" },
  ];
  const startId = 1;

  const blockIds = getAdjacents(blocks, startId);

  expect(blockIds.length).toBe(7);
  expect(blockIds).toContain(1);
  expect(blockIds).toContain(3);
  expect(blockIds).toContain(4);
  expect(blockIds).toContain(6);
  expect(blockIds).toContain(7);
  expect(blockIds).toContain(8);
  expect(blockIds).toContain(9);
});
