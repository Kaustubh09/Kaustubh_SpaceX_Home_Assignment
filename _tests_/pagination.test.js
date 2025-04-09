// __tests__/pagination.test.js

import { paginate } from "../utils/pagination";

describe("paginate function", () => {
  const data = Array.from({ length: 50 }, (_, i) => i + 1); // Creates an array [1, 2, ..., 50]
  const itemsPerPage = 10;

  test("returns the first 10 items for page 1", () => {
    expect(paginate(data, 1, itemsPerPage)).toEqual([1,2,3,4,5,6,7,8,9,10]);
  });

  test("returns the correct items for page 3", () => {
    expect(paginate(data, 3, itemsPerPage)).toEqual([21,22,23,24,25,26,27,28,29,30]);
  });

  test("returns an empty array when the page number is beyond available data", () => {
    // Page 6 expects no data since 5 pages cover 50 items.
    expect(paginate(data, 6, itemsPerPage)).toEqual([]);
  });
});
