/* eslint-disable no-empty-pattern */
import axios from 'axios';

export default {
  namespaced: true,
  state: {
    user: localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user'))
      : null
  },
  mutations: {
    setUser(state, data) {
      state.user = data;
    }
  },
  actions: {
    async signupUser({ commit }, credentials) {
      const response = await axios.post(
        `${process.env.VUE_APP_SERVER_URL}/auth/signup`,
        credentials
      );

      commit('setUser', response.data);

      localStorage.setItem('user', JSON.stringify(response.data));
    },
    async loginUser({ commit }, credentials) {
      const response = await axios.post(
        `${process.env.VUE_APP_SERVER_URL}/auth/login`,
        credentials
      );

      commit('setUser', response.data);

      localStorage.setItem('user', JSON.stringify(response.data));
    },
    logout({ commit }) {
      localStorage.removeItem('user');

      commit('setUser', null);
    },
    async updateMe({ commit }, { data, token }) {
      const response = await axios.put(
        `${process.env.VUE_APP_SERVER_URL}/users/me`,
        data,
        { headers: { authorization: `Bearer ${token}` } }
      );

      const getUser = JSON.parse(localStorage.getItem('user'));

      const newData = {
        token: getUser.token,
        name: response.data.name,
        phone: response.data?.phone || '',
        email: response.data.email
      };

      commit('setUser', newData);

      localStorage.setItem('user', JSON.stringify(newData));
    },
    async getAllUsers({}, { query, token }) {
      const response = await axios.get(
        `${process.env.VUE_APP_SERVER_URL}/users`,
        { headers: { authorization: `Bearer ${token}` }, params: query }
      );

      return response.data;
    },
    async updateUserPwd({}, { data, token }) {
      const response = await axios.post(
        `${process.env.VUE_APP_SERVER_URL}/users/update-password`,
        data,
        { headers: { authorization: `Bearer ${token}` } }
      );

      return response.data;
    },
    async createUserByAdmin({}, { data, token }) {
      const response = await axios.post(
        `${process.env.VUE_APP_SERVER_URL}/users/`,
        data,
        { headers: { authorization: `Bearer ${token}` } }
      );
      console.log(response.data);
      return response.data;
    },
    async updateUserByAdmin({}, { userId, data, token }) {
      const response = await axios.put(
        `${process.env.VUE_APP_SERVER_URL}/users/${userId}`,
        data,
        { headers: { authorization: `Bearer ${token}` } }
      );
      return response.data;
    },
    async deleteUserByAdmin({}, { userId, token }) {
      await axios.delete(`${process.env.VUE_APP_SERVER_URL}/users/${userId}`, {
        headers: { authorization: `Bearer ${token}` }
      });
    }
  },
  getters: {}
};
