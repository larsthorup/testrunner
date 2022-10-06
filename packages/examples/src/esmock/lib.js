import { fetchPosts } from "./service.js";

/**
 * @param {number} id
 * @returns
 */
export const getPostTitle = async (id) => {
  const { title } = await fetchPosts(id);
  return title[0].toUpperCase() + title.substring(1);
};
