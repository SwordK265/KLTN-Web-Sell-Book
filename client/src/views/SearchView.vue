<template>
  <HeaderComponent />
  <div class="bg-white">
    <loading v-model:active="isLoading" :is-full-page="fullPage" />
    <div class="wrapper py-8 flex gap-8">
      <div class="w-280 rounded-3px">
        <div
          class="border-t-1 border-l-1 border-r-1 border-solid border-[#e5e5e5]"
        >
          <ul>
            <li
              class="py-5px pl-15px pr-1 h-9 font-semibold border-b-1 border-dashed border-[#e6e6e6] flex align-center justify-between"
            >
              <span>Kho Sách Giảm Giá</span>
              <v-icon class="text-[#e6e6e6]">mdi-chevron-right</v-icon>
            </li>
            <li
              class="py-5px pl-15px pr-1 h-9 font-semibold border-b-1 border-dashed border-[#e6e6e6] flex align-center justify-between"
            >
              <span>Sách Bán Chạy</span>
              <v-icon class="text-[#e6e6e6]">mdi-chevron-right</v-icon>
            </li>
            <li
              class="py-5px pl-15px pr-1 h-9 font-semibold border-b-1 border-dashed border-[#e6e6e6] flex align-center justify-between"
            >
              <span>Sách Mới Phát Hành</span>
              <v-icon class="text-[#e6e6e6]">mdi-chevron-right</v-icon>
            </li>
            <li
              class="py-5px pl-15px pr-1 h-9 font-semibold border-b-1 border-dashed border-[#e6e6e6] flex align-center justify-between"
            >
              <span>Sách Sắp Phát Hành</span>
              <v-icon class="text-[#e6e6e6]">mdi-chevron-right</v-icon>
            </li>
            <li
              class="py-5px pl-15px pr-1 h-9 font-semibold flex align-center justify-between"
            >
              <span>Combo Ưu Đãi</span>
              <v-icon class="text-[#e6e6e6]">mdi-chevron-right</v-icon>
            </li>
          </ul>
        </div>
        <div class="border-l-1 border-r-1 border-solid border-[#e5e5e5]">
          <h1
            class="py-5 px-15px text-base font-semibold uppercase border-t-1 border-dashed border-[#e6e6e6]"
          >
            Danh mục
            <span v-if="category">{{ category?.name }}</span>
          </h1>
          <router-link
            v-for="type in types"
            :key="type._id"
            :to="{ name: 'SearchView', params: { search: `${type.slug}` } }"
            class="py-5px pl-15px pr-1 h-9 font-medium border-t-1 border-dashed border-[#e6e6e6] flex align-center justify-between"
          >
            <span>{{ type.name }}</span>
            <v-icon class="text-[#e6e6e6]">mdi-chevron-right</v-icon>
          </router-link>
        </div>
        <div class="border-l-1 border-r-1 border-solid border-[#e5e5e5]">
          <h1
            class="py-5 px-15px text-base font-semibold uppercase border-t-1 border-dashed border-[#e6e6e6]"
          >
            Tác Giả
            <span v-if="category">{{ category?.name }}</span>
          </h1>
          <button
            v-for="author in authors"
            :key="author._id"
            @click="handleSearch(author.slug)"
            class="w-[100%] py-5px pl-15px pr-1 h-9 font-medium border-t-1 border-dashed border-[#e6e6e6] flex align-center justify-between"
          >
            <span>{{ author.name }}</span>
            <v-icon class="text-[#e6e6e6]">mdi-chevron-right</v-icon>
          </button>
        </div>
        <div
          class="border-l-1 border-r-1 border-b-1 border-solid border-[#e5e5e5]"
        >
          <h1
            class="py-5 px-15px text-base font-semibold uppercase border-t-1 border-dashed border-[#e6e6e6]"
          >
            Nhà Xuất Bản
            <span v-if="category">{{ category?.name }}</span>
          </h1>
          <button
            v-for="publisher in publishers"
            :key="publisher._id"
            @click="handleSearch(publisher.slug)"
            class="w-[100%] py-5px pl-15px pr-1 h-9 font-medium border-t-1 border-dashed border-[#e6e6e6] flex align-center justify-between"
          >
            <span>{{ publisher.name }}</span>
            <v-icon class="text-[#e6e6e6]">mdi-chevron-right</v-icon>
          </button>
        </div>
      </div>
      <div class="grow p-15px mt-5 mb-10">
        <h1
          class="text-lg text-[#008340] pb-1.5 border-b-1 border-dashed border-[#c7c7c7] font-medium"
        >
          Kết quả tìm kiếm: {{ $route.query.q }}
          {{ category & $route.query.q ? `thuộc ${category?.name}` : '' }}
        </h1>
        <div v-if="books.length">
          <div
            class="mt-30px grid grid-cols-5 gap-x-2.5 gap-y-9 justify-items-center"
          >
            <router-link
              v-for="book in books?.slice(0, 40)"
              :key="book._id"
              :to="{ name: 'BookDetailView', params: { id: `${book.slug}` } }"
              class="block"
            >
              <a-card
                size="small"
                :bordered="false"
                hoverable
                class="flex flex-col justify-between font-montserrat hover:text-[#087b39] active:text-[#087b39]"
              >
                <div class="h-180 w-115 flex items-end relative">
                  <router-link
                    :to="{
                      name: 'BookDetailView',
                      params: { id: `${book.slug}` }
                    }"
                  >
                    <img
                      :src="'http://localhost:8000/uploads/' + book.photo"
                      alt="#"
                  /></router-link>
                  <div
                    v-if="book.discount"
                    class="absolute bg-red px-1 py-0.5 -right-3 -bottom-3"
                  >
                    -10%
                  </div>
                </div>
                <div class="w-115 mt-3">
                  <div class="book-name font-medium">
                    <router-link
                      :to="{
                        name: 'BookDetailView',
                        params: { id: `${book.slug}` }
                      }"
                      class="hover:text-[#087b39] hover:underline active:text-[#087b39] active:underline"
                      >{{ book?.name }}</router-link
                    >
                  </div>
                  <p class="text-[#747474] text-11px my-1 hover:text-[#087b39]">
                    {{ book.author[0]?.name || 'Unknown' }}
                  </p>
                </div>
                <div class="text-14px text-[#c02026] font-medium">
                  <span v-if="book.discount"
                    >{{
                      new Intl.NumberFormat().format(
                        book.price - book.price * (book.discount / 100)
                      )
                    }}
                    đ</span
                  >
                  <span v-else
                    >{{ new Intl.NumberFormat().format(book.price) }} đ</span
                  >
                </div>
                <div
                  v-if="!book.quantity"
                  class="text-11px text-[#c02026] font-medium flex justify-end"
                >
                  <span>Tạm hết hàng</span>
                </div>
              </a-card>
            </router-link>
          </div>
          <div
            class="mt-50px border-t-1 border-dashed border-[#e5e5e5] pt-3 flex justify-end"
          >
            <a-pagination
              v-model:current="pagination.current"
              v-model:pageSize="pagination.pageSize"
              :total="pagination.total"
              @change="handlePagination"
            />
          </div>
        </div>
        <div v-else class="px-5 py-15 bg-[#fafafa] font-medium">
          <a-empty />
        </div>
      </div>
    </div>
  </div>
  <FooterComponent />
</template>

<script>
import Loading from 'vue-loading-overlay';
import HeaderComponent from '../components/Header/HeaderComponent.vue';
import FooterComponent from '../components/Footer/FooterComponent.vue';

export default {
  name: 'SearchView',
  data() {
    return {
      isLoading: true,
      fullPage: false,
      pagination: {
        total: 0,
        current: 1,
        pageSize: 20
      },
      category: {},
      types: [],
      authors: [],
      publishers: [],
      books: []
    };
  },
  components: {
    HeaderComponent,
    FooterComponent,
    Loading
  },
  computed: {
    getCategories() {
      return this.$store.state.category.categories;
    },
    getBooks() {
      return this.$store.state.book.books;
    },
    getAuthors() {
      return this.$store.state.author.authors;
    },
    getPublishers() {
      return this.$store.state.publisher.publishers;
    },
    getCurrentParams() {
      return this.$route.params.search;
    },
    getCurrentQuery() {
      return this.$route.query;
    }
  },
  watch: {
    async getCurrentParams() {
      const loading = this.$loading.show({
        active: true,
        container: this.fullPage ? null : this.$refs.formContainer
      });
      await this.checkRoute();
      loading.hide();
    },
    async getCurrentQuery() {
      const loading = this.$loading.show({
        active: true,
        container: this.fullPage ? null : this.$refs.formContainer
      });
      await this.checkRoute();
      loading.hide();
    }
  },
  async mounted() {
    await this.checkRoute();
    this.isLoading = false;
  },
  methods: {
    async checkRoute() {
      try {
        if (this.getCurrentParams === 'search') {
          await this.getData('category/getAllCategories', {
            query: this.getCurrentQuery
          });
        } else {
          await this.getData('category/getCategory', {
            search: this.getCurrentParams,
            query: this.getCurrentQuery
          });
        }
      } catch (error) {
        this.$toast.error(error.response?.data?.message || error.message);
      }
    },
    async getData(actions, data) {
      try {
        // If - have slug / Else - no slug
        if (data.search) {
          // Actions category.
          this.category = await this.$store.dispatch(actions, data.search);

          // Actions for books
          await this.$store.dispatch('book/getAllBooksBySLug', data);

          this.books = this.getBooks.data;
          this.pagination = {
            total: this.getBooks.total,
            current: this.getBooks.page,
            pageSize: this.getBooks.perPage
          };

          // Save data
          this.types = this.category.types;
          this.authors = this.category.authors;
          this.publishers = this.category.publishers;
        } else {
          // Actions category.
          await this.$store.dispatch(actions);

          // Actions author.
          await this.$store.dispatch('author/getAllAuthors', {});

          // Actions publisher.
          await this.$store.dispatch('publisher/getAllPublishers', {});

          // Save data
          this.authors = this.getAuthors.data;
          this.publishers = this.getPublishers.data;
          this.types = this.getCategories;

          // Actions for books
          await this.$store.dispatch('book/getAllBooks', data);

          this.books = this.getBooks.data;
          this.pagination = {
            total: this.getBooks.total,
            current: this.getBooks.page,
            pageSize: this.getBooks.perPage
          };
        }
      } catch (error) {
        this.$toast.error(error.response?.data?.message || error.message);
      }
    },
    handleSearch(slug) {
      this.$router.push({
        path: `/${this.getCurrentParams}`,
        query: {
          q: slug
        }
      });
    },
    handlePagination() {
      this.$router.push({
        path: `/${this.getCurrentParams}`,
        query: {
          q: this.getCurrentQuery.q,
          page: this.pagination.current
        }
      });
    }
  }
};
</script>

<style scoped>
.book-name {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
