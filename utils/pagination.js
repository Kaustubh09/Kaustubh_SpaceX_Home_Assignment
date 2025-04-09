// utils/pagination.js

/**
 * Returns a slice of the data array corresponding to the given page.
 *
 * @param {Array} data - Array containing all items.
 * @param {number} currentPage - The current page number.
 * @param {number} itemsPerPage - Number of items to display per page.
 * @returns {Array} - A slice of the data array for the current page.
 */
export const paginate = (data, currentPage, itemsPerPage) => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return data.slice(startIdx, startIdx + itemsPerPage);
  };
  