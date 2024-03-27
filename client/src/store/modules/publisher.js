/* eslint-disable no-empty-pattern */
import axios from 'axios';

export default {
  namespaced: true,
  state: {
    publishers: []
  },
  mutations: {
    setPublishers(state, data) {
      state.publishers = data;
    }
  },
  actions: {
    async getAllPublishers({ commit }, { query }) {
      const response = await axios.get(
        `${process.env.VUE_APP_SERVER_URL}/publishers`,
        { params: query }
      );

      commit('setPublishers', response.data);
    },
    async getAllPublishersByAdmin({}, { query, token }) {
      const response = await axios.get(
        `${process.env.VUE_APP_SERVER_URL}/publishers/admin`,
        { params: query, headers: { authorization: `Bearer ${token}` } }
      );

      return response.data;
    },
    async createPublisher({}, { data, token }) {
      const response = await axios.post(
        `${process.env.VUE_APP_SERVER_URL}/publishers/`,
        data,
        { headers: { authorization: `Bearer ${token}` } }
      );
      return response.data;
    },
    async updatePublisher({}, { publisherId, data, token }) {
      const response = await axios.put(
        `${process.env.VUE_APP_SERVER_URL}/publishers/${publisherId}`,
        data,
        { headers: { authorization: `Bearer ${token}` } }
      );
      return response.data;
    },
    async deletePublisher({}, { publisherId, token }) {
      await axios.delete(
        `${process.env.VUE_APP_SERVER_URL}/publishers/${publisherId}`,
        {
          headers: { authorization: `Bearer ${token}` }
        }
      );
    }
  }
};
