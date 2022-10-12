/** @typedef { import('./service.js').Post } Post */

export default {
  /**
   * @param {number} id
   * @returns {Promise<Post>}
   */
  fetchPosts: async (id) => ({
    title: `some mocked title for post ${id}`,
  }),
};
