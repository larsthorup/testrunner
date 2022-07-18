import fetch from "node-fetch";

const host = "https://jsonplaceholder.typicode.com";

/** @typedef {{title: string}} Post */

/**
 * @param {number} id
 * @returns {Promise<Post>}
 */
export const fetchPosts = async (id) => {
  const url = `${host}/posts/${id}`;
  const response = await fetch(url);
  const post = /** @type {Post} */ (await response.json());
  return post;
};
