<template>
  <div class="main-content">
    <loading v-model:active="isLoading" />
    <div class="wrapper flex mb-12">
      <div class="main-content-left w-3/4">
        <div class="home-book">
          <div class="main-content-left-title py-10 font-semibold text-lg">
            <span>Sách Hay</span>
          </div>
          <div
            class="main-content-left-body h-74 bg-[#f26c63] p-[38px] flex gap-14 text-white"
          >
            <div class="pic-book shadow-picture">
              <img
                :src="'http://localhost:8000/uploads/Kinh Tế/Marketing - Bán Hàng/picture_kt_mbh_16.jpg'"
                alt="#"
                width="220px"
              />
            </div>
            <div class="text-info-book grow">
              <div class="text-info-book-title font-semibold text-lg">
                <router-link
                  :to="{
                    path: '/book/22-quy-luat-bat-bien-trong-marketing-the-22-immutable-laws-of-marketing-tai-ban-2021'
                  }"
                  >22 Quy Luật Bất Biến Trong Marketing - The 22 Immutable Laws
                  Of Marketing (Tái Bản 2021)</router-link
                >
              </div>
              <span
                class="text-info-book-author text-sm pb-1 border-white border-solid border-b-[1px]"
              >
                Al Ries - Jack Trout
              </span>
              <p
                class="text-info-book-description mt-6 text-sm pb-4 border-dashed border-b-[1px] border-white"
              >
                Mời bạn đón đọc
              </p>
              <div
                class="font-medium text-info-book-price text-xl mt-4 flex justify-between align-center"
              >
                <span>39.000 đ</span>
              </div>
            </div>
          </div>
        </div>
        <ListBooksCategory :category="categories[0]" />
        <div class="home-author">
          <div class="main-content-left-title py-10 font-semibold text-lg">
            <span>Tác Giả Nổi Bật</span>
          </div>
          <div class="main-content-left-body bg-white">
            <div class="info-author h-74 p-38px flex gap-9">
              <div class="pic-author">
                <img
                  src="https://www.vinabook.com/images/thumbnails/author/210x/360353_129910542144506789460598800290180602601678n1.jpg"
                  alt="#"
                />
              </div>
              <div class="text-info-author grow max-w-578px">
                <span
                  class="font-medium text-info-author-name text-18px text-[#0a6f3c] pb-1.5 border-solid border-b-1 border-[#cecece]"
                >
                  {{ outstandingAuthor.name }}
                </span>
                <div class="text-info-author-description text-14px mt-4">
                  {{ outstandingAuthor.description }}
                </div>
              </div>
            </div>
            <div
              class="info-author-books border-dashed border-t-1 border-black px-38px pt-4 pb-6 flex gap-5"
            >
              <router-link
                v-for="book in outstandingAuthor?.top3Books"
                :key="book._id"
                :to="{ path: `book/${book.slug}` }"
              >
                <div class="author-book flex gap-4 flex-1">
                  <div>
                    <img
                      :src="`http://localhost:8000/uploads/` + book.photo"
                      alt="#"
                    />
                  </div>
                  <router-link
                    :to="{ path: `book/${book.slug}` }"
                    class="text-12px text-[#0a6f3c] hover:underline active:underline font-medium"
                    >{{ book.name }}</router-link
                  >
                </div>
              </router-link>
            </div>
          </div>
        </div>
        <ListBooksCategory :category="categories[1]" />
        <ListBooksCategory :category="categories[2]" />
        <ListBooksCategory :category="categories[3]" />
      </div>
      <div class="main-content-right w-1/4 pl-10">
        <div class="list-books-right">
          <div>
            <div class="py-10 font-semibold text-lg">
              <span>Sách Bán Chạy</span>
            </div>
            <div>
              <router-link
                v-for="book in booksSoldOut"
                :key="book._id"
                :to="{ path: `book/${book.slug}` }"
              >
                <div class="box-info-book flex gap-3 mb-5">
                  <div class="pic-book">
                    <img
                      :src="`http://localhost:8000/uploads/` + book.photo"
                      alt="#"
                      class="max-w-50px"
                    />
                  </div>
                  <div class="text-info-book">
                    <div
                      class="text-info-book-name leading-4 text-15px font-medium hover:underline hover:text-[#0a6f3c] active:underline active:text-[#0a6f3c]"
                    >
                      <router-link :to="{ path: `book/${book.slug}` }">{{
                        book.name
                      }}</router-link>
                    </div>
                    <p
                      class="text-info-book-author text-12px text-[#6b6b6b] py-0.5"
                    >
                      {{ book.author[0]?.name || 'Unknown' }}
                    </p>
                    <div
                      v-if="book.discount"
                      class="price-book text-red flex gap-3"
                    >
                      <span class="text-[#777] line-through"
                        >{{
                          new Intl.NumberFormat().format(book.price)
                        }}
                        đ</span
                      >
                      <span class="font-semibold text-15px"
                        >{{
                          new Intl.NumberFormat().format(
                            book.price - book.price * (book.discount / 100)
                          )
                        }}
                        đ</span
                      >
                    </div>
                    <div v-else class="price-book text-red">
                      <span class="font-semibold text-15px"
                        >{{
                          new Intl.NumberFormat().format(book.price)
                        }}
                        đ</span
                      >
                    </div>
                  </div>
                </div>
              </router-link>
            </div>
          </div>
          <div class="mt-32">
            <img
              :src="require('../../../assets/img/App_VNB_advertise1.png')"
              alt="Advertise App"
              class="mb-8"
            />
            <img
              :src="require('../../../assets/img/App_VNB_advertise2.png')"
              alt="Advertise App"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ListBooksCategory from './ListBooksCategory.vue';
import Loading from 'vue-loading-overlay';

export default {
  data() {
    return {
      isLoading: true
    };
  },
  computed: {
    categories() {
      return this.$store.state.category.categories;
    },
    booksSoldOut() {
      return this.$store.state.book.booksSoldOut;
    },
    outstandingAuthor() {
      return this.$store.state.author.outstandingAuthor;
    }
  },
  async mounted() {
    await this.getTop20BooksSoldOut();
    await this.getOutstandingAuthor();

    this.isLoading = false;
  },
  components: {
    ListBooksCategory,
    Loading
  },
  methods: {
    async getTop20BooksSoldOut() {
      try {
        await this.$store.dispatch('book/getTop20BooksSoldOut');
      } catch (error) {
        this.$toast.error(error.response?.data?.message || error.message);
      }
    },
    async getOutstandingAuthor() {
      try {
        await this.$store.dispatch('author/getOutstandingAuthor', {});
      } catch (error) {
        this.$toast.error(error.response?.data?.message || error.message);
      }
    }
  }
};
</script>

<style scoped>
.text-info-book-name {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
