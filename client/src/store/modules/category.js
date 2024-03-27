/* eslint-disable no-empty-pattern */
import axios from 'axios';

export default {
  namespaced: true,
  state: {
    categories: []
  },
  mutations: {
    setCategories(state, data) {
      state.categories = data;
    }
  },
  actions: {
    async getAllCategories({ commit }) {
      const response = await axios.get(
        `${process.env.VUE_APP_SERVER_URL}/categories`
      );

      commit('setCategories', response.data);
    },
    async getAllCategoriesByAdmin({}, { query, token }) {
      const response = await axios.get(
        `${process.env.VUE_APP_SERVER_URL}/categories/admin`,
        {
          headers: {
            authorization: `Bearer ${token}`
          },
          params: query
        }
      );

      return response.data;
    },
    async getCategory({}, credentials) {
      const response = await axios.get(
        `${process.env.VUE_APP_SERVER_URL}/categories/${credentials}`
      );

      return response.data;
    },
    async createCategory({}, { data, token }) {
      const response = await axios.post(
        `${process.env.VUE_APP_SERVER_URL}/categories`,
        data,
        { headers: { authorization: `Bearer ${token}` } }
      );
      return response.data;
    },
    async updateCategory({}, { categoryId, data, token }) {
      const response = await axios.put(
        `${process.env.VUE_APP_SERVER_URL}/categories/${categoryId}`,
        data,
        { headers: { authorization: `Bearer ${token}` } }
      );
      return response.data;
    },
    async deleteCategory({}, { categoryId, token }) {
      await axios.delete(
        `${process.env.VUE_APP_SERVER_URL}/categories/${categoryId}`,
        {
          headers: { authorization: `Bearer ${token}` }
        }
      );
    }
  }
};
