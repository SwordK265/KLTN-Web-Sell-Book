<template>
  <div>
    <loading v-model:active="isLoading" />
    <div class="mt-2 mb-8 text-xl flex justify-between">
      <div>
        <span class="mr-3">Carts:</span>
        <span>{{ total }}</span>
      </div>
      <div>
        <a-input-search
          v-model:value="search"
          enter-button
          placeholder="Nhập tên"
          @search="onSearch"
          class="w-[300px]"
        />
      </div>
    </div>
    <a-table
      class="ant-table-striped"
      size="middle"
      bordered
      :columns="columns"
      :data-source="data"
      :pagination="pagination"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'books'">
          <div class="grid grid-cols-4 gap-x-[1.125rem] gap-y-[1.875rem]">
            <div
              v-for="book of record.books"
              :key="book._id"
              class="list-books-payment pb-1 flex justify-between gap-5"
            >
              <div v-if="book.book?.photo">
                <img
                  :src="`http://localhost:8000/uploads/` + book.book.photo"
                  alt="#"
                  class="max-w-[80px]"
                />
              </div>
              <div>
                <p v-if="book.book?.name" class="text-book-name mb-2">
                  {{ book.book.name }}
                </p>
                <p class="text-12px" v-if="book?.quantity">
                  Số lượng: {{ book.quantity }}
                </p>
                <p class="text-12px text-[#c02026]" v-if="book.book?.price">
                  Giá tiền:
                  {{
                    new Intl.NumberFormat().format(
                      book.book.price -
                        book.book.price * (book.book.discount / 100)
                    )
                  }}
                  đ
                </p>
              </div>
            </div>
          </div>
        </template>
        <template v-if="column.key === 'user'">
          <span>{{ record.user[0]?.name }}</span>
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
      columns: [
        {
          title: 'User',
          dataIndex: 'user',
          key: 'user',
          sorter: true,
          width: 200
        },
        {
          title: 'Books',
          dataIndex: 'books',
          key: 'books'
        },
        {
          title: 'Action',
          key: 'action',
          width: 100
        }
      ]
    };
  },
  computed: {
    getUser() {
      return this.$store.state.user.user;
    }
  },
  components: { Loading },
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
        const response = await this.$store.dispatch('cart/getAllCarts', {
          query: { ...query, perPage: 10 },
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
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
