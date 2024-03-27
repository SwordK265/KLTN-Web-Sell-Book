/* eslint-disable no-empty-pattern */
import axios from 'axios';

export default {
  namespaced: true,
  state: {
    userInvoices: []
  },
  mutations: {
    setUserInvoices(state, data) {
      state.userInvoices = data;
    }
  },
  actions: {
    async getAllPayments({}, { query, token }) {
      const response = await axios.get(
        `${process.env.VUE_APP_SERVER_URL}/payment`,
        {
          params: query,
          headers: { authorization: `Bearer ${token}` }
        }
      );

      return response.data;
    },
    async getPaymentByUser({ commit }, { query, token }) {
      const response = await axios.get(
        `${process.env.VUE_APP_SERVER_URL}/payment/user`,
        {
          params: query,
          headers: { authorization: `Bearer ${token}` }
        }
      );

      commit('setUserInvoices', response.data);
    }
  }
};
