/* eslint-disable no-empty-pattern */
import axios from 'axios';

export default {
  namespaced: true,
  state: {
    books: [],
    booksSoldOut: []
  },
  mutations: {
    setBooks(state, data) {
      state.books = data;
    },
    setBooksSoldOut(state, data) {
      state.booksSoldOut = data;
    }
  },
  actions: {
    async getAllBooks({ commit }, { query }) {
      const response = await axios.get(
        `${process.env.VUE_APP_SERVER_URL}/books`,
        {
          params: {
            q: query?.q?.split('+')?.join(' '),
            ...query
          }
        }
      );

      commit('setBooks', response.data);
    },
    async getAllBooksByAdmin({}, { query, token }) {
      const response = await axios.get(
        `${process.env.VUE_APP_SERVER_URL}/books/admin`,
        {
          headers: {
            authorization: `Bearer ${token}`
          },
          params: query
        }
      );

      return response.data;
    },
    async getAllBooksBySLug({ commit }, { search, query }) {
      const response = await axios.get(
        `${process.env.VUE_APP_SERVER_URL}/books/cate/${search}`,
        {
          params: {
            q: query?.q?.split('+')?.join(' '),
            ...query
          }
        }
      );

      commit('setBooks', response.data);
    },
    async getTop20BooksSoldOut({ commit }) {
      const response = await axios.get(
        `${process.env.VUE_APP_SERVER_URL}/books/top-20-sold-out`
      );

      commit('setBooksSoldOut', response.data);
    },
    async createBook({}, { data, token }) {
      const response = await axios.post(
        `${process.env.VUE_APP_SERVER_URL}/books`,
        data,
        { headers: { authorization: `Bearer ${token}` } }
      );
      return response.data;
    },
    async updateBook({}, { bookId, data, token }) {
      const response = await axios.put(
        `${process.env.VUE_APP_SERVER_URL}/books/${bookId}`,
        data,
        { headers: { authorization: `Bearer ${token}` } }
      );
      return response.data;
    },
    async deleteBook({}, { bookId, token }) {
      await axios.delete(
        `${process.env.VUE_APP_SERVER_URL}/books/${bookId}`,
        {
          headers: { authorization: `Bearer ${token}` }
        }
      );
    }
  }
};
