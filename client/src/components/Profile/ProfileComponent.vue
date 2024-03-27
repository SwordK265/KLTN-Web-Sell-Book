<template>
  <div class="bg-white h-[750px]">
    <loading v-model:active="isLoading" />
    <div class="wrapper">
      <div class="pt-10 font-medium">
        <a-tabs
          v-model:activeKey="activeKey"
          animated
          class="font-montserrat"
          :tabBarStyle="{
            color: '#888',
            textTransform: 'uppercase',
            fontWeight: '600'
          }"
          type="card"
        >
          <a-tab-pane key="1" tab="Thay đổi thông tin">
            <div
              class="mt-5 h-336 px-8 border-1 border-solid border-[#e5e5e5] w-[1000px] px-5 rounded-5px py-5"
            >
              <div
                class="text-2xl text-[#087b44] font-semibold border-b-1 border-dashed border-[#c7c7c7]"
              >
                Thông tin cá nhân
              </div>
              <div class="w-430 font-medium">
                <div class="text-lg mt-8 mb-4">
                  Xin chào bạn
                  <span class="text-[#ca2027] font-bold">{{
                    getUser?.name || ''
                  }}</span>
                </div>
                <div class="mb-6">
                  <ul>
                    <li class="flex gap-4 align-center mb-2">
                      <p class="w-32">Họ và Tên</p>
                      <a-input
                        v-model:value="name"
                        class="w-[260px] hover:border-black active:border-black focus:border-black"
                      />
                    </li>
                    <li class="flex gap-4 align-center mb-2">
                      <p class="w-32">Email</p>
                      <a-input
                        v-model:value="email"
                        class="w-[260px] hover:border-black active:border-black focus:border-black"
                      />
                    </li>
                    <li class="flex gap-4 align-center">
                      <p class="w-32">Số điện thoại</p>
                      <a-input
                        v-model:value="phone"
                        class="w-[260px] hover:border-black active:border-black focus:border-black"
                      />
                    </li>
                  </ul>
                </div>
              </div>
              <div
                class="ml-[90%] rounded-3px w-28 mt-8 mb-2 py-2.5 border-1 border-solid border-[#24890b] bg-[#2ba40d] flex justify-center"
              >
                <button
                  @click="updateUser"
                  class="uppercase text-14px text-white block"
                >
                  Lưu
                </button>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="Thay đổi mật khẩu">
            <div
              class="mt-5 h-336 px-8 border-1 border-solid border-[#e5e5e5] w-[500px] px-5 rounded-5px pt-5"
            >
              <div
                class="text-2xl text-[#087b44] font-semibold border-b-1 border-dashed border-[#c7c7c7]"
              >
                Thay đổi mật khẩu
              </div>
              <div class="w-430 font-medium">
                <div class="mt-8 mb-6">
                  <a-form
                    :model="userPwd"
                    :label-col="{ span: 12 }"
                    :wrapper-col="{ span: 16 }"
                    autocomplete="off"
                    @finish="updateUserPwd"
                  >
                    <a-form-item
                      label="Mật khẩu hiện tại"
                      name="currentPassword"
                      :rules="[
                        {
                          required: true,
                          message: 'Please input your current password!'
                        }
                      ]"
                    >
                      <a-input-password v-model:value="userPwd.currentPassword" />
                    </a-form-item>

                    <a-form-item
                      label="Mật khẩu mới"
                      name="newPassword"
                      :rules="[
                        {
                          required: true,
                          message: 'Please input your new password!'
                        }
                      ]"
                    >
                      <a-input-password v-model:value="userPwd.newPassword" />
                    </a-form-item>

                    <a-form-item
                      label="Xác nhận mật khẩu mới"
                      name="checkNewPassword"
                      :rules="[
                        {
                          required: true,
                          message: 'Please input your new password confirm!'
                        }
                      ]"
                    >
                      <a-input-password v-model:value="userPwd.checkNewPassword" />
                    </a-form-item>

                    <a-form-item :wrapper-col="{ span: 16, offset: 8 }">
                      <div class="flex justify-end">
                        <a-button
                          class="bg-green"
                          size="large"
                          html-type="submit"
                          >Lưu</a-button
                        >
                      </div>
                    </a-form-item>
                  </a-form>
                </div>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="3" tab="Lịch sử đơn hàng">
            <a-table
              class="ant-table-striped"
              size="middle"
              :scroll="{ y: 500 }"
              :columns="columns"
              :data-source="dataPayment"
              :pagination="pagination"
              @change="handleTableChange"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'books'">
                  <div
                    v-for="book of record.books"
                    :key="book._id"
                    class="list-books-payment pb-1 border-b-1 border-solid border-[#d2d2d2]"
                  >
                    <router-link
                      :to="{ path: `/book/${book.slug}` }"
                      class="text-book-name hover:underline hover:text-[#0a6f3c] active:underline active:text-[#0a6f3c]"
                      >{{ book.name }}</router-link
                    >
                    <p class="text-12px">Số lượng: {{ book.quantity }}</p>
                    <p class="text-12px text-[#c02026]">
                      Giá tiền:
                      {{
                        new Intl.NumberFormat().format(
                          book.price - book.price * (book.discount / 100)
                        )
                      }}
                      đ
                    </p>
                  </div>
                </template>
                <template v-if="column.key === 'total'">
                  <span
                    >{{ new Intl.NumberFormat().format(record.total) }} đ</span
                  >
                </template>
                <template v-if="column.key === 'createdAt'">
                  <span>{{
                    this.$moment(record.createdAt).format('YYYY-MM-DD HH:mm:ss')
                  }}</span>
                </template>
              </template>
            </a-table>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import Loading from 'vue-loading-overlay';

export default {
  data() {
    return {
      isLoading: true,
      dataPayment: [],
      activeKey: ref('1'),
      name: '',
      email: '',
      phone: '',
      userPwd: {
        currentPassword: '',
        newPassword: '',
        checkNewPassword: ''
      },
      columns: [
        {
          title: 'Tên',
          dataIndex: 'name',
          key: 'name',
          sorter: true,
          width: 150
        },
        {
          title: 'Số điện thoại',
          dataIndex: 'phone',
          key: 'phone',
          width: 100
        },
        {
          title: 'Địa chỉ',
          dataIndex: 'location',
          key: 'location',
          width: 200
        },
        {
          title: 'Sách',
          dataIndex: 'books',
          key: 'books'
        },
        {
          title: 'Tổng tiền',
          dataIndex: 'total',
          key: 'total',
          width: 120
        },
        {
          title: 'Phương thức thanh toán',
          dataIndex: 'method',
          key: 'method',
          width: 150
        },
        {
          title: 'Ngày đặt hàng',
          dataIndex: 'createdAt',
          key: 'createdAt',
          sorter: true,
          width: 150
        }
      ],
      pagination: {}
    };
  },
  components: {
    Loading
  },
  computed: {
    getUser() {
      return this.$store.state.user.user;
    },
    getUserPayment() {
      return this.$store.state.payment.userInvoices;
    }
  },
  async mounted() {
    this.getInfoUser();
    await this.fetchPaymentUser({});
  },
  methods: {
    getInfoUser() {
      this.name = this.getUser?.name || '';
      this.email = this.getUser?.email || '';
      this.phone = this.getUser?.phone || '';
    },
    async updateUser() {
      try {
        await this.$store.dispatch('user/updateMe', {
          data: {
            name: this.name,
            email: this.email,
            phone: this.phone
          },
          token: this.getUser.token
        });
      } catch (error) {
        this.$toast.error(error.response?.data?.message || error.message);
      }
    },
    async fetchPaymentUser(query) {
      try {
        this.isLoading = true;
        await this.$store.dispatch('payment/getPaymentByUser', {
          query: { ...query, perPage: 10 },
          token: this.getUser?.token
        });

        this.dataPayment = this.getUserPayment.data;
        this.pagination = {
          total: this.getUserPayment.total,
          current: this.getUserPayment.page,
          pageSize: this.getUserPayment.perPage
        };
        this.isLoading = false;
      } catch (error) {
        this.$toast.error(error.message);
      }
    },
    async handleTableChange(pag, filters, sorter) {
      if (sorter && sorter.column) {
        const query = {
          orderBy: `${sorter.field}|${sorter.order === 'ascend' ? 1 : -1}`
        };

        await this.fetchPaymentUser(query);
      } else if (pag) {
        const query = {
          page: pag.current,
          perPage: pag.pageSize
        };

        await this.fetchPaymentUser(query);
      }
    },
    async updateUserPwd() {
      try {
        if (this.userPwd.newPassword !== this.userPwd.checkNewPassword) {
          this.$toast.error('Mật khẩu mới ko trùng khớp');
        } else {
          delete this.userPwd.checkNewPassword;
        }

        const response = await this.$store.dispatch('user/updateUserPwd', {
          data: this.userPwd,
          token: this.getUser?.token
        });

        this.$toast.success(response.message);
        this.userPwd = {
          currentPassword: '',
          newPassword: '',
          checkNewPassword: ''
        };
      } catch (error) {
        this.$toast.error(error.message);
      }
    }
  }
};
</script>

<style scoped>
.text-book-name {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.list-books-payment:last-child {
  border: none transparent;
}
</style>
