<template>
  <div>
    <loading v-model:active="isLoading" />
    <div class="mt-2 mb-8 text-xl flex justify-between">
      <div>
        <span class="mr-3">Payments:</span>
        <span>{{ total }}</span>
      </div>
      <div>
        <a-input-search
          v-model:value="search"
          placeholder="Nhập tên"
          @search="onSearch"
          class="w-[300px]"
        />
      </div>
      <!-- <div class="bg-blue rounded">
        <a-button type="primary" @click="showModal">Create</a-button>
        <a-modal
          v-model:open="openModal"
          :footer="null"
          :closable="false"
          :width="400"
        >
          <template #title>
            <h1 class="text-center">
              {{ this.type === 1 ? 'Create Payment' : 'Edit Payment' }}
            </h1>
          </template>

          <a-form
            :model="category"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 16 }"
            name="nest-messages"
            @finish="onFinish"
            class="mt-6"
          >
            <a-form-item name="name" label="Name" :rules="[{ required: true }]">
              <a-input v-model:value="category.name" />
            </a-form-item>
            <a-form-item label="Slug" name="slug" :rules="[{ required: true }]">
              <a-input v-model:value="category.slug" />
            </a-form-item>
            <a-form-item :wrapper-col="{ span: 16, offset: 8 }">
              <a-button type="primary" html-type="submit" class="bg-blue">
                {{ type === 1 ? 'Create' : 'Edit' }}
              </a-button>
            </a-form-item>
          </a-form>
        </a-modal>
      </div> -->
    </div>
    <a-table
      class="ant-table-striped"
      bordered
      size="middle"
      :columns="columns"
      :data-source="data"
      :pagination="pagination"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'user'">
          <span>{{ record.user[0]?.name }}</span>
        </template>
        <template v-if="column.key === 'books'">
          <div
            v-for="book of record.books"
            :key="book._id"
            class="list-books-payment pb-1 border-b-1 border-solid border-[#d2d2d2]"
          >
            <span
              class="text-book-name hover:underline hover:text-[#0a6f3c] active:underline active:text-[#0a6f3c]"
              >{{ book.name }}</span
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
          <span>{{ new Intl.NumberFormat().format(record.total) }} đ</span>
        </template>
        <template v-if="column.key === 'createdAt'">
          <span>{{
            this.$moment(record.createdAt).format('YYYY-MM-DD HH:mm:ss')
          }}</span>
        </template>
        <template v-if="column.key === 'action'">
          <span>
            <v-icon>mdi-pencil-outline</v-icon>
            <a-divider type="vertical" />
            <v-icon>mdi-trash-can-outline</v-icon>
            <a-divider type="vertical" />
          </span>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script>
import Loading from 'vue-loading-overlay';

export default {
  data() {
    return {
      type: 1, // 1 - Create / 2- Edit
      openModal: false,
      isLoading: true, // Loading page
      data: [],
      search: '',
      pagination: {},
      total: 0,
      categoryId: null,
      category: {
        name: '',
        slug: ''
      },
      columns: [
        {
          title: 'Người dùng',
          dataIndex: 'user',
          key: 'user',
          sorter: true,
          width: 150
        },
        {
          title: 'Tên người nhận',
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
        },
        {
          title: 'Action',
          key: 'action'
        }
      ]
    };
  },
  components: { Loading },
  computed: {
    getUser() {
      return this.$store.state.user.user;
    }
  },
  async mounted() {
    await this.fetchData({});
  },
  methods: {
    async handleTableChange(pag, filters, sorter) {
      if (sorter && sorter.column) {
        const query = {
          orderBy: `${sorter.field}|${sorter.order === 'ascend' ? 1 : -1}`
        };

        await this.fetchData(query);
      } else if (pag) {
        const query = {
          page: pag.current,
          perPage: pag.pageSize
        };

        await this.fetchData(query);
      }
    },
    async fetchData(query) {
      try {
        this.isLoading = true;

        const response = await this.$store.dispatch('payment/getAllPayments', {
          query,
          token: this.getUser?.token
        });

        this.data = response.data;
        this.total = response.total;
        this.pagination = {
          total: response.total,
          current: response.page,
          pageSize: response.perPage
        };

        this.$router.push({
          query
        });
        this.isLoading = false;
      } catch (error) {
        this.$toast.error(error.response?.data?.message || error.message);
        this.isLoading = false;
      }
    },
    async onSearch() {
      const query = {
        q: this.search
      };

      await this.fetchData(query);
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
