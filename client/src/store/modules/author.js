/* eslint-disable no-empty-pattern */
import axios from 'axios';

export default {
  namespaced: true,
  state: {
    authors: [],
    outstandingAuthor: {}
  },
  mutations: {
    setAuthors(state, data) {
      state.authors = data;
    },
    setOutstandingAuthors(state, data) {
      state.outstandingAuthor = data;
    }
  },
  actions: {
    async getAllAuthors({ commit }, { query }) {
      const response = await axios.get(
        `${process.env.VUE_APP_SERVER_URL}/authors`,
        { params: query }
      );

      commit('setAuthors', response.data);
    },
    async getAllAuthorsByAdmin({}, { query, token }) {
      const response = await axios.get(
        `${process.env.VUE_APP_SERVER_URL}/authors/admin`,
        { params: query, headers: { authorization: `Bearer ${token}` } }
      );

      return response.data;
    },
    async getOutstandingAuthor({ commit }, { query }) {
      const response = await axios.get(
        `${process.env.VUE_APP_SERVER_URL}/authors/outstanding`,
        { params: query }
      );

      commit('setOutstandingAuthors', response.data);
    },
    async createAuthor({}, { data, token }) {
      const response = await axios.post(
        `${process.env.VUE_APP_SERVER_URL}/authors/`,
        data,
        { headers: { authorization: `Bearer ${token}` } }
      );
      return response.data;
    },
    async updateAuthor({}, { authorId, data, token }) {
      const response = await axios.put(
        `${process.env.VUE_APP_SERVER_URL}/authors/${authorId}`,
        data,
        { headers: { authorization: `Bearer ${token}` } }
      );
      return response.data;
    },
    async deleteAuthor({}, { authorId, token }) {
      await axios.delete(
        `${process.env.VUE_APP_SERVER_URL}/authors/${authorId}`,
        {
          headers: { authorization: `Bearer ${token}` }
        }
      );
    }
  }
};
