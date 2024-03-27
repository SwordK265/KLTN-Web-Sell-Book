import { createStore } from 'vuex';
import user from './modules/user';
import category from './modules/category';
import cart from './modules/cart';
import book from './modules/book';
import author from './modules/author';
import publisher from './modules/publisher';
import categoryType from './modules/category-type';
import payment from './modules/payment';

const store = createStore({
  modules: {
    user,
    category,
    cart,
    book,
    author,
    publisher,
    categoryType,
    payment
  }
});

export default store;
