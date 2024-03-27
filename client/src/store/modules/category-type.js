/* eslint-disable no-empty-pattern */
import axios from 'axios';

export default {
  namespaced: true,
  state: {
    categoryTypes: []
  },
  mutations: {
    setCategoryTypes(state, data) {
      state.categoryTypes = data;
    }
  },
  actions: {
    async getAllCategoryTypes({ commit }) {
      const response = await axios.get(
        `${process.env.VUE_APP_SERVER_URL}/category-types`,
      );

      commit('setCategoryTypes', response.data);
    },
    async getAllCategoryTypesByAdmin({}, { query, token }) {
      const response = await axios.get(
        `${process.env.VUE_APP_SERVER_URL}/category-types/admin`,
        {
          headers: {
            authorization: `Bearer ${token}`
          },
          params: query
        }
      );

      return response.data;
    },
    async createCategoryType({}, { data, token }) {
      const response = await axios.post(
        `${process.env.VUE_APP_SERVER_URL}/category-types`,
        data,
        { headers: { authorization: `Bearer ${token}` } }
      );
      return response.data;
    },
    async updateCategoryType({}, { categoryTypeId, data, token }) {
      const response = await axios.put(
        `${process.env.VUE_APP_SERVER_URL}/category-types/${categoryTypeId}`,
        data,
        { headers: { authorization: `Bearer ${token}` } }
      );
      return response.data;
    },
    async deleteCategoryType({}, { categoryTypeId, token }) {
      await axios.delete(
        `${process.env.VUE_APP_SERVER_URL}/category-types/${categoryTypeId}`,
        {
          headers: { authorization: `Bearer ${token}` }
        }
      );
    }
  }
};
