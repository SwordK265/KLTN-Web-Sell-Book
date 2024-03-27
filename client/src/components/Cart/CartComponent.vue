<template>
  <div>
    <div class="wrapper">
      <loading v-model:active="isLoading" />
      <div class="font-semibold flex mb-5 mt-4">
        <h1 class="text-xl uppercase">Giỏ hàng</h1>
        <span class="text-base ml-5px self-center"
          >({{ getCart.totalQty }} sản phẩm)</span
        >
      </div>
      <div class="flex gap-5">
        <div class="w-820 mb-10">
          <div
            class="flex mb-2.5 py-2.5 bg-white rounded-lg text-15px items-center font-medium"
          >
            <div class="w-14 flex justify-center items-center">
              <input
                @change="(e) => toggleAllBook(e.target.checked)"
                :checked="isCheckAll"
                type="checkbox"
                class="h-[20px] w-[20px] rounded cursor-pointer"
              />
            </div>
            <div class="w-472">
              <p>Chọn tất cả ({{ getCart.totalQty }} sản phẩm)</p>
            </div>
            <div class="w-90"><span>Số lượng</span></div>
            <div class="w-36 text-center"><span>Thành tiền</span></div>
          </div>
          <div>
            <div
              v-for="book in books"
              :key="book._id"
              class="list-books-cart flex py-5 border-t-1 border-solid border-[#ededed] bg-white items-center"
            >
              <div class="w-16 flex justify-center items-center">
                <input
                  @change="(e) => selectBook(e.target.checked, book.book._id)"
                  :checked="selecteds.includes(book.book._id)"
                  type="checkbox"
                  class="h-[20px] w-[20px] rounded cursor-pointer"
                />
              </div>
              <div class="w-28">
                <img
                  :src="'http://localhost:8000/uploads/' + book.book.photo"
                  alt="#"
                  class="h-[120px]"
                />
              </div>
              <div class="grow flex">
                <div class="w-80 px-15px flex flex-col gap-[60px]">
                  <h3 class="text-14px">
                    {{ book.book.name }}
                  </h3>
                  <div class="flex justify-between align-center">
                    <div>
                      <span class="font-semibold text-15px"
                        >{{
                          new Intl.NumberFormat().format(
                            book.book.price -
                              (book.book.price * book.book.discount) / 100
                          )
                        }}
                        đ</span
                      >
                      <span class="ml-2.5 line-through"
                        >{{
                          new Intl.NumberFormat().format(book.book.price)
                        }}
                        đ</span
                      >
                    </div>
                  </div>
                </div>
                <div
                  class="grow flex gap-8 align-center justify-around text-15px"
                >
                  <div class="ml-3 h-8 flex align-center">
                    <a-input-number
                      v-model:value="book.quantity"
                      :min="1"
                      :max="book.book.quantity"
                      @step="handleInputQty(book.book._id, book.quantity)"
                      @pressEnter="handleInputQty(book.book._id, book.quantity)"
                    />
                  </div>
                  <span class="font-semibold text-[#c92127]"
                    >{{ new Intl.NumberFormat().format(book.total) }} đ</span
                  >
                </div>
              </div>
              <div class="w-16 text-center">
                <v-icon @click="deleteBookInCart(book.book._id)"
                  >mdi-trash-can-outline</v-icon
                >
              </div>
            </div>
          </div>
        </div>
        <div class="px-15px">
          <div class="border-1 border-solid border-[#ccc] bg-white rounded">
            <h2
              class="bg-[#117c47] text-white text-center text-16px p-2.5 rounded-t uppercase border-b-1 border-solid border-[#ccc]"
            >
              Tóm tắt đơn hàng
            </h2>
            <div class="p-15px">
              <ul>
                <li class="flex justify-between py-3px">
                  <span>Sản phẩm</span>
                  <span>{{ getCart.totalQty }}</span>
                </li>
                <li class="flex justify-between py-3px">
                  <span>Phí vận chuyển</span>
                  <span>Miễn phí</span>
                </li>
                <li class="flex justify-between py-3px font-medium">
                  <span class="uppercase">Tạm tính</span>
                  <span
                    >{{
                      new Intl.NumberFormat().format(getCart.totalPrice)
                    }}
                    đ</span
                  >
                </li>
              </ul>
              <p class="text-center italic mt-4">
                (Đã bao gồm Thuế VAT và Phí đóng gói cơ bản).
              </p>
              <div
                class="flex justify-between font-semibold border-t-1 border-solid border-black mt-15px pt-15px"
              >
                <span class="uppercase">Tổng cộng</span>
                <span class="text-[#c92127]"
                  >{{
                    new Intl.NumberFormat().format(getCart.totalPrice)
                  }}
                  đ</span
                >
              </div>
            </div>
          </div>
          <div
            @click="openOrderConfirm"
            class="mx-auto mt-6 rounded-xl text-center w-[80%] py-3 cursor-pointer text-lg font-bold bg-[#fdc92d] uppercase font-semibold"
          >
            Thanh toán
          </div>
          <div
            @click="this.$router.back()"
            class="mx-auto mt-4 mb-6 rounded-xl text-center w-[80%] py-3 cursor-pointer text-lg font-bold bg-[#cecdcd] text-white uppercase font-semibold"
          >
            Quay lại
          </div>
          <a-modal v-model:open="open" :footer="null" :width="750">
            <template #title>
              <h1 class="text-center">Xác nhận thông tin đơn hàng</h1>
            </template>

            <a-tabs v-model:activeKey="activeTabModal">
              <a-tab-pane key="1" tab="Sản phẩm đã chọn">
                <a-table
                  :dataSource="
                    books.filter((b) => selecteds.includes(b.book._id))
                  "
                  :columns="columns"
                  :pagination="false"
                >
                  <template #bodyCell="{ column, record: book }">
                    <template v-if="column.key === 'product'">
                      <div class="flex">
                        <div class="w-32">
                          <img
                            :src="
                              'http://localhost:8000/uploads/' + book.book.photo
                            "
                            alt="#"
                            class="h-[120px] object-contain"
                          />
                        </div>
                        <div class="w-336 px-15px flex flex-col gap-[60px]">
                          <h3 class="text-14px">
                            {{ book.book.name }}
                          </h3>
                          <div class="flex justify-between align-center">
                            <div>
                              Đơn giá:
                              <span class="font-semibold text-15px"
                                >{{
                                  new Intl.NumberFormat().format(
                                    book.book.price
                                  )
                                }}
                                đ</span
                              >
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                    <template v-if="column.key === 'quantity'">
                      <span class="w-1/2 text-center">{{ book.quantity }}</span>
                    </template>
                    <template v-if="column.key === 'price'">
                      <span class="w-1/2 font-semibold"
                        >{{
                          new Intl.NumberFormat().format(book.total)
                        }}
                        đ</span
                      >
                    </template>
                  </template>
                </a-table>
                <div class="my-4 flex justify-end align-center gap-3">
                  <span class="text-xl">Tổng cộng: </span>
                  <span class="text-xl font-bold my-2 text-[#c92127]"
                    >{{
                      new Intl.NumberFormat().format(
                        books.reduce((total, curr) => {
                          if (!selecteds.includes(curr.book._id)) return total;
                          return total + curr.total;
                        }, 0)
                      )
                    }}
                    đ</span
                  >
                </div>
              </a-tab-pane>
              <a-tab-pane key="2" tab="Đặt hàng">
                <div>
                  <h1 class="text-lg font-medium mb-4">Địa chỉ giao hàng</h1>
                  <a-space direction="vertical" class="w-[400px]">
                    <div>
                      <label class="w-[100px]">Họ và Tên</label>
                      <a-input
                        v-model:value="infoOrder.name"
                        placeholder="Nhập họ và tên"
                      />
                    </div>
                    <div>
                      <label class="w-[100px]">Số điện thoại</label>
                      <a-input
                        v-model:value="infoOrder.phone"
                        placeholder="Nhập số điện thoại"
                        :maxlength="10"
                      />
                    </div>
                    <div>
                      <label class="w-[100px]">Địa chỉ</label>
                      <a-textarea
                        v-model:value="infoOrder.location"
                        placeholder="Nhập địa chỉ giao hàng"
                        :rows="4"
                      />
                    </div>
                  </a-space>
                </div>
                <div>
                  <h1 class="text-lg font-medium mt-5 mb-4">
                    Phương thức thanh toán
                  </h1>
                  <a-radio-group v-model:value="activeRadioModal">
                    <a-radio :value="1">Thanh toán khi nhận hàng</a-radio>
                    <a-radio :value="2">VNPay</a-radio>
                  </a-radio-group>
                </div>
                <div class="flex justify-end">
                  <button
                    @click="buyOrder"
                    class="mt-6 w-135 p-2 rounded bg-green text-center font-medium"
                  >
                    Đặt hàng
                  </button>
                </div>
              </a-tab-pane>
            </a-tabs>
          </a-modal>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from 'vue-loading-overlay';
import { ref } from 'vue';
import { CART } from '@/assets/data/message';

export default {
  data() {
    return {
      activeTabModal: ref('1'),
      activeRadioModal: ref(1),
      isLoading: true,
      quantity: '',
      books: [],
      selecteds: [],
      isCheckAll: false,
      open: false,
      columns: [
        {
          title: 'Sản phẩm',
          dataIndex: 'product',
          key: 'product'
        },
        {
          title: 'Số lượng',
          dataIndex: 'quantity',
          key: 'quantity'
        },
        {
          title: 'Thành tiền',
          dataIndex: 'price',
          key: 'price'
        }
      ],
      infoOrder: {
        name: '',
        phone: '',
        location: ''
      }
    };
  },
  components: {
    Loading
  },
  async mounted() {
    await this.getBooksInCart();
  },
  computed: {
    getCart() {
      return this.$store.state.cart;
    },
    getBooksCart() {
      return this.$store.state.cart.books;
    },
    getUser() {
      return this.$store.state.user.user;
    }
  },
  watch: {
    getBooksCart(value) {
      this.books = value;
      this.isLoading = false;
    }
  },
  methods: {
    async getBooksInCart() {
      try {
        await this.$store.dispatch('cart/getUserCart', {
          token: this.getUser?.token
        });

        this.books = this.getBooksCart;

        await this.checkQuantityBooks();
      } catch (error) {
        this.$toast.error(error.response?.data?.message || error.message);
      }
    },
    async handleInputQty(bookId, quantity) {
      try {
        await this.$store.dispatch('cart/updateBookToUserCart', {
          bookId,
          quantity,
          token: this.getUser?.token
        });

        this.$toast.success(CART.UPDATE_SUCCESS);
      } catch (error) {
        this.$toast.error(error.response?.data?.message || error.message);
      }
    },
    async deleteBookInCart(bookId) {
      try {
        await this.$store.dispatch('cart/deleteBookToUserCart', {
          bookId,
          token: this.getUser?.token
        });

        this.$toast.success(CART.DELETE_SUCCESS);
      } catch (error) {
        this.$toast.error(error.response?.data?.message || error.message);
      }
    },
    async selectBook(isCheck, bookId) {
      if (isCheck) {
        this.selecteds.push(bookId);
      } else {
        this.selecteds = this.selecteds.filter(
          (selected) => selected !== bookId
        );
      }
    },
    async toggleAllBook(isCheck) {
      if (isCheck) {
        this.selecteds.splice(
          0,
          this.selecteds.length,
          ...this.books.map((b) => b.book._id)
        );
        this.isCheckAll = true;
      } else {
        this.selecteds.splice(0, this.selecteds.length);
        this.isCheckAll = true;
      }
    },
    async openOrderConfirm() {
      if (!this.selecteds.length) {
        this.$toast.info(CART.WARNING_SELECTION);
        return;
      }
      this.open = true;

      // check quantity books in cart
      await this.getBooksInCart();
    },
    async payment(radio, action) {
      try {
        const selectedProducts = this.books
          .filter((b) => this.selecteds.includes(b.book._id))
          .map((b) => ({
            bookId: b.book._id,
            name: b.book.name,
            discount: b.book.discount,
            slug: b.book.slug,
            quantity: b.quantity,
            price: b.book.price
          }));

        const total = selectedProducts.reduce((initValue, value) => {
          return (
            initValue +
            (value.price - (value.price * value.discount) / 100) *
              value.quantity
          );
        }, 0);

        if (
          !this.infoOrder.name ||
          !this.infoOrder.phone ||
          !this.infoOrder.location
        ) {
          this.$toast.info(CART.WARNING_INFO_ORDER);
          return;
        }

        const response = await this.$store.dispatch(action, {
          data: {
            books: selectedProducts,
            name: this.infoOrder.name,
            phone: this.infoOrder.phone,
            location: this.infoOrder.location,
            total
          },
          token: this.getUser.token
        });

        if (radio === 1) {
          this.$toast.success(response.message);
          window.location.reload();
        } else if (radio === 2) {
          window.location.href = response;
        }
      } catch (error) {
        this.$toast.error(error.response?.data?.message || error.message);
        window.location.reload();
      }
    },
    async buyOrder() {
      // check quantity books in cart
      await this.getBooksInCart();

      if (this.activeRadioModal === 1) {
        await this.payment(this.activeRadioModal, 'cart/payOnDelivery');
      } else if (this.activeRadioModal === 2) {
        await this.payment(this.activeRadioModal, 'cart/payByVnPay');
      }
    },
    async checkQuantityBooks() {
      if (this.books.some((book) => book.quantity > book.book.quantity)) {
        const books = this.books.map((book) => {
          if (book.quantity > book.book.quantity) {
            book.quantity = book.book.quantity;
          }

          return {
            book: book.book._id,
            quantity: book.quantity
          };
        });

        await this.$store.dispatch('cart/saveUserCart', {
          data: books,
          token: this.getUser?.token
        });

        this.$toast.info(CART.WARNING_QUANTITY_ORDER);
        window.location.reload();
      }
    }
  }
};
</script>

<style scoped>
.list-books-cart:first-child {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.list-books-cart:last-child {
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}
</style>
