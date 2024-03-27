/* eslint-disable no-empty-pattern */
import axios from 'axios';
import PaymentMethods from '@/assets/data/paymentMethods';

export default {
  namespaced: true,
  state: {
    books: [],
    totalQty: 0,
    totalPrice: 0
  },
  mutations: {
    saveCart(state, data) {
      state.books = data?.books?.map((el) => {
        el.total =
          (el.book.price - (el.book.price * el.book.discount) / 100) *
          el.quantity;

        return el;
      });

      state.totalQty = data?.books?.reduce(
        (acc, currentValue) => acc + currentValue.quantity,
        0
      );

      state.totalPrice = data?.books?.reduce(
        (acc, currentValue) => acc + currentValue.total,
        0
      );
    }
  },
  actions: {
    async getAllCarts({}, { query, token }) {
      const response = await axios.get(
        `${process.env.VUE_APP_SERVER_URL}/carts`,
        { headers: { authorization: `Bearer ${token}` }, params: query }
      );

      return response.data;
    },
    async getUserCart({ commit }, { token }) {
      const response = await axios.get(
        `${process.env.VUE_APP_SERVER_URL}/carts/user`,
        { headers: { authorization: `Bearer ${token}` } }
      );

      console.log(response.data);

      commit('saveCart', response.data);
    },
    async addBookToUserCart({ commit }, { data, token }) {
      const response = await axios.post(
        `${process.env.VUE_APP_SERVER_URL}/carts`,
        data,
        { headers: { authorization: `Bearer ${token}` } }
      );

      commit('saveCart', response.data);
    },
    async saveUserCart({}, { data, token }) {
      await axios.post(`${process.env.VUE_APP_SERVER_URL}/carts/save`, data, {
        headers: { authorization: `Bearer ${token}` }
      });
    },
    async updateBookToUserCart({ commit }, { bookId, quantity, token }) {
      const response = await axios.put(
        `${process.env.VUE_APP_SERVER_URL}/carts/${bookId}`,
        { quantity },
        { headers: { authorization: `Bearer ${token}` } }
      );

      commit('saveCart', response.data);
    },
    async deleteBookToUserCart({ commit }, { bookId, token }) {
      const response = await axios.delete(
        `${process.env.VUE_APP_SERVER_URL}/carts/${bookId}`,
        { headers: { authorization: `Bearer ${token}` } }
      );

      commit('saveCart', response.data);
    },
    async payByVnPay(_, { data, token }) {
      const response = await axios.post(
        `${process.env.VUE_APP_SERVER_URL}/payment/vn-pay`,
        { ...data, method: PaymentMethods.VN_PAY },
        { headers: { authorization: `Bearer ${token}` } }
      );

      return response.data;
    },
    async payOnDelivery(_, { data, token }) {
      const response = await axios.post(
        `${process.env.VUE_APP_SERVER_URL}/payment/on-delivery`,
        { ...data, method: PaymentMethods.PAYMENT_ON_DELIVERY },
        { headers: { authorization: `Bearer ${token}` } }
      );

      return response.data;
    }
  }
};
