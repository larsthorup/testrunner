import { fetchPosts } from "./service.js";
import { log } from "./log.js";

/**
 * @param {number} id
 * @returns
 */
export const getPostTitle = async (id) => {
  await log(getPostTitle.name);
  const { title } = await fetchPosts(id);
  return title[0].toUpperCase() + title.substring(1);
};
