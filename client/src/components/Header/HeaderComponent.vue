<template>
  <div class="bg-white">
    <div class="wrapper wrapper-header">
      <div>
        <router-link :to="{ path: '/' }">
          <img
            :src="require('@/assets/img/vnb_logo_2x.png')"
            alt="Logo-VinaBook"
          />
        </router-link>
      </div>
      <div class="top-cart-input w-600">
        <a-input
          v-model:value="search"
          placeholder="Tìm kiếm tựa sách, tác giả, nhà xuất bản"
          :style="{
            borderRadius: '50px',
            border: 'solid 1px #c7c7c7'
          }"
          class="text-15px font-medium"
          :bordered="false"
          @pressEnter="handleSearch"
        >
          <template #prefix
            ><font-awesome-icon
              icon="fa-solid fa-magnifying-glass"
              size="lg"
              class="mr-2.5"
            />
          </template>
          <template #suffix>
            <button class="btn-input" @click="handleSearch">Tìm sách</button>
          </template>
        </a-input>
      </div>
      <div class="top-cart-content flex gap-[30px]">
        <button
          class="btn-cart relative bg-[#fff] text-[#0b703d]"
          @click="goToCart"
        >
          <font-awesome-icon icon="fa-solid fa-cart-shopping" size="xl" />
          <div
            v-if="getUser"
            class="absolute -top-4 left-5 w-4 h-4 rounded-full bg-[#0a6f3c] text-white text-center text-10px"
          >
            {{ getCart.totalQty }}
          </div>
          <v-dialog v-model="alertLogin" width="auto">
            <v-card
              max-width="400"
              text="Hãy đăng nhập để sử dụng dịch vụ"
              :style="{ fontSize: '16px' }"
            >
              <template v-slot:actions>
                <v-btn
                  class="ms-auto"
                  text="Ok"
                  @click="alertLogin = false"
                ></v-btn>
              </template>
            </v-card>
          </v-dialog>
        </button>
        <div class="top-cart-register flex gap-1" v-if="!getUser">
          <div>
            <AuthComponent :text="`Đăng nhập`" />
          </div>
          |
          <div>
            <AuthComponent :text="`Đăng ký`" />
          </div>
        </div>
        <div class="flex gap-1" v-else>
          <div>
            <router-link
              :to="{ name: 'ProfileView' }"
              class="hover:underline"
              >{{ getUser.name }}</router-link
            >
          </div>
          |
          <div><button @click="logout()">Đăng xuất</button></div>
        </div>
      </div>
    </div>
  </div>
  <div class="main-top text-base bg-[#0b703d] text-white">
    <div class="wrapper flex justify-between items-center h-11 relative">
      <div class="nav w-60 flex justify-between">
        <font-awesome-icon
          icon="fa-solid fa-bars"
          size="xl"
          class="cursor-pointer"
        />
        <span>Danh Mục Sách</span>
        <div class="main-top-category-has-display">
          <button @mouseover="showMenu">
            <font-awesome-icon icon="fa-solid fa-caret-down" size="xl" />
          </button>
          <div
            class="main-top-category border-x border-b-1 border:solid border-grey z-10"
          >
            <div class="flex h-auto">
              <div class="category-slider w-72">
                <h1 class="font-semibold text-xl text-grey px-3 mb-4">
                  Danh Mục Sách
                </h1>
                <div>
                  <router-link
                    class="block text-[#212121] font-medium py-2.5 px-3 rounded-lg"
                    v-for="category in categories"
                    :key="category._id"
                    :to="{ path: `${category?.slug}` }"
                    :class="{
                      active: category?.name === categoryName ? 1 : 0
                    }"
                    @mouseover="getMenu(category._id)"
                  >
                    {{ category?.name }}
                  </router-link>
                </div>
              </div>
              <div class="category-content w-3/4">
                <h1 class="font-semibold text-xl mb-1.5 ml-20">
                  {{ categoryName }}
                </h1>
                <div class="flex justify-between mt-3 ml-20 gap-10">
                  <div class="w-1/3 content-category">
                    <h3 class="font-semibold">Danh Mục</h3>
                    <ul>
                      <li
                        v-for="cateType in categoryTypes?.slice(0, 10)"
                        :key="cateType._id"
                      >
                        <router-link :to="{ path: `${cateType?.slug}` }">{{
                          cateType?.name
                        }}</router-link>
                      </li>
                    </ul>
                  </div>
                  <div class="w-1/3 content-author">
                    <h3 class="font-semibold">Tác giả</h3>
                    <ul>
                      <li
                        v-for="author in authors?.slice(0, 10)"
                        :key="author._id"
                      >
                        <router-link
                          :to="{
                            path: `/search`,
                            query: { q: `${author?.name}` }
                          }"
                          >{{ author?.name }}</router-link
                        >
                      </li>
                    </ul>
                  </div>
                  <div class="w-1/3 content-publisher">
                    <h3 class="font-semibold">Nhà Phát Hành</h3>
                    <ul>
                      <li
                        v-for="publisher in publishers?.slice(0, 10)"
                        :key="publisher._id"
                      >
                        <a href="#">{{ publisher.name }}</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="hotline text-sm relative flex">
        <div>
          <font-awesome-icon
            icon="fa-solid fa-phone"
            size="lg"
            style="margin-bottom: 3px"
          />
          <a-tooltip placement="bottom">
            <template #title>
              <span>
                Tổng đài chăm sóc và Hỗ trợ Khách hàng hoạt động suốt 6 ngày
                trong tuần <br />
                Thứ 2 - 6: Hoạt động từ 8:00 - 17:00 T7 - Chủ nhật: <br />
                Quý khách vui lòng để lại tin nhắn qua email hotro@vinabook.com
                Chúng tôi sẽ xử lý email sớm nhất giúp quý khách.
              </span>
            </template>
            <span class="text-white ml-1.5 mr-7">Hotline: 1900 6401</span>
          </a-tooltip>
        </div>
        <div>
          <font-awesome-icon
            icon="fa-solid fa-comments"
            size="lg"
            style="margin-bottom: 3px; margin-right: 6px"
          />
          <a href="#" class="hover:underline">Hỗ trợ trực tuyến</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AuthComponent from '../Auth/AuthComponent.vue';

export default {
  components: {
    AuthComponent
  },
  data() {
    return {
      alertLogin: false,
      search: '',
      categories: [],
      categoryTypes: [],
      categoryName: '',
      publishers: [],
      authors: []
    };
  },
  computed: {
    getUser() {
      return this.$store.state.user.user;
    },
    getCurrentParams() {
      return this.$route.params?.search;
    },
    getCart() {
      return this.$store.state.cart;
    },
    getCategories() {
      return this.$store.state.category.categories;
    }
  },
  watch: {
    async getUser() {
      await this.getUserCart();
    }
  },
  async created() {
    await this.getAllCategories();
    await this.getUserCart();
  },
  methods: {
    getMenu(id) {
      const category = this.categories.find((cate) => cate._id === id);

      this.categoryName = category?.name;
      this.categoryTypes = category?.types;
      this.authors = category?.authors;
      this.publishers = category?.publishers;
    },
    showMenu() {
      this.categoryName = this.categories[0]?.name;
      this.categoryTypes = this.categories[0]?.types;
      this.authors = this.categories[0]?.authors;
      this.publishers = this.categories[0]?.publishers;
    },
    async getAllCategories() {
      try {
        await this.$store.dispatch('category/getAllCategories');
        this.categories = this.getCategories;
      } catch (error) {
        console.log(error);
        this.$toast.error(error.response?.data?.message || error.message);
      }
    },
    async getUserCart() {
      if (this.getUser) {
        try {
          await this.$store.dispatch('cart/getUserCart', {
            token: this.getUser.token
          });
        } catch (error) {
          console.log(error);
          this.$toast.error(error.response?.data?.message || error.message);
        }
      }
    },
    logout() {
      this.$store.dispatch('user/logout');
      window.location.reload();
    },
    handleSearch() {
      if (this.search) {
        const text = this.search;

        this.search = '';

        if (!this.getCurrentParams) {
          this.$router.push({
            path: '/search',
            query: {
              q: text
            }
          });
        } else {
          this.$router.push({
            path: `/${this.getCurrentParams}`,
            query: {
              q: text
            }
          });
        }
      } else {
        if (!this.getCurrentParams) {
          this.$router.push({
            path: '/search',
            query: {
              q: ''
            }
          });
        } else {
          this.$router.push({
            path: `/${this.getCurrentParams}`,
            query: {
              q: ''
            }
          });
        }
      }
    },
    goToCart() {
      if (!this.getUser) {
        this.alertLogin = true;
      } else {
        this.$router.push('/cart');
      }
    }
  }
};
</script>

<style scoped>
@import url('./style.css');
</style>
