<template>
  <HeaderComponent />
  <main>
    <loading v-model:active="isLoading" />
    <div class="bg-white">
      <div class="wrapper book-detail">
        <div class="book-detail-title pt-9 mb-3">
          <a-breadcrumb>
            <a-breadcrumb-item>Trang Chủ</a-breadcrumb-item>
            <a-breadcrumb-item
              ><router-link :to="{ path: `/${book.category?.slug}` }">{{
                book.category?.name
              }}</router-link></a-breadcrumb-item
            >
            <a-breadcrumb-item
              ><router-link :to="{ path: `/${book.category_type?.slug}` }">{{
                book.category_type?.name
              }}</router-link></a-breadcrumb-item
            >
            <a-breadcrumb-item>{{ book?.name }}</a-breadcrumb-item>
          </a-breadcrumb>
        </div>
        <div
          class="book-detail-content pt-9 mb-12 border-t-1 border-[#cdcdcd] border-solid"
        >
          <div class="book-detail-info h-auto flex gap-10">
            <div class="pic-book">
              <img
                :src="'http://localhost:8000/uploads/' + book.photo"
                alt="#"
                width="242px"
              />
            </div>
            <div class="book-detail-text w-500">
              <p class="book-detail-name text-2xl text-[#404040] h-auto">
                {{ book.name }}
              </p>
              <div
                class="book-detail-author-publisher mt-3 text-[#22242d] leading-5"
              >
                <p>
                  Tác giả:
                  <router-link
                    :to="{
                      path: '/search',
                      query: {
                        q: `${book.author?.slug}`
                      }
                    }"
                    class="text-[#087b39] hover:underline font-medium"
                    >{{ book.author?.name }}</router-link
                  >
                </p>
                <p>
                  Nhà phát hành:
                  <router-link
                    :to="{
                      path: '/search',
                      query: {
                        q: `${book.publisher?.slug}`
                      }
                    }"
                    class="text-[#087b39] hover:underline font-medium"
                    >{{ book.publisher?.name }}</router-link
                  >
                </p>
              </div>
              <p
                class="book-detail-description text-15px leading-26px pt-4 mb-4 text-[#66645c]"
              >
                {{ book.description }}
              </p>
              <div
                class="book-detail-other-info border-dashed border-t border-black py-2"
              >
                <p class="text-base mb-3">Thông tin kèm theo</p>
                <ul>
                  <li class="mt-2">
                    <font-awesome-icon
                      icon="fa-solid fa-circle-check"
                      size="xl"
                      class="text-[#0b703d] mr-2"
                    />
                    <span>Dịch vụ bọc sách plastic cao cấp cho sách</span>
                  </li>
                  <li class="mt-2">
                    <font-awesome-icon
                      icon="fa-solid fa-circle-check"
                      size="xl"
                      class="text-[#0b703d] mr-2"
                    />
                    <span
                      >Miễn phí giao hàng toàn quốc cho đơn hàng 250.000đ</span
                    >
                  </li>
                </ul>
              </div>
              <div class="flex gap-14 mt-4 align-center">
                <label class="font-semibold text-base">Số lượng:</label>
                <div class="h-8 flex align-center">
                  <a-input-number
                    v-model:value="quantity"
                    :min="1"
                    :max="book.quantity"
                    size="large"
                  />
                </div>
              </div>
            </div>
            <div class="book-detail-price grow max-h-[380px] flex justify-end">
              <div
                class="w-72 p-4 border-1 border-solid rounded-3px border-[#dcdbdb] shadow-box-book-price"
              >
                <p
                  class="text-base pb-2 border-dashed border-b-1 border-[#c7c7c7]"
                >
                  Thông tin thanh toán
                </p>
                <ul
                  class="book-price-info mt-5 pb-4 border-dashed border-b-1 border-black"
                >
                  <li class="flex justify-between mb-1.5 text-15px">
                    <p class="book-price-rea text-[#404040]l">Giá bìa</p>
                    <p class="line-through">
                      {{ new Intl.NumberFormat().format(book.price) }} đ
                    </p>
                  </li>
                  <li class="flex justify-between mb-2">
                    <p class="book-price-sell text-15px text-[#404040]">
                      Giá bán
                    </p>
                    <p class="text-[#ca2027] text-xl">
                      {{
                        new Intl.NumberFormat().format(
                          book.price - (book.price * book.discount) / 100
                        )
                      }}
                      đ
                    </p>
                  </li>
                  <li class="flex justify-between text-15px">
                    <p class="book-price-discount text-[#404040]">Tiết kiệm</p>
                    <p class="text-[#087b39]">
                      {{
                        new Intl.NumberFormat().format(
                          (book.price * book.discount) / 100
                        )
                      }}
                      đ ({{ book.discount }}%)
                    </p>
                  </li>
                </ul>
                <div class="box-book-status pt-2">
                  <div v-if="book.quantity">
                    <div
                      class="status-label text-[#087b39] flex justify-end py-2"
                    >
                      <font-awesome-icon
                        icon="fa-solid fa-circle-check"
                        size="xl"
                        class="mr-2"
                      />
                      <span class="text-14px uppercase font-semibold"
                        >Có hàng</span
                      >
                    </div>
                    <p class="status-description text-13px mt-3 text-center">
                      Miễn phí giao hàng cho sản phẩm này.
                    </p>
                    <div
                      @click="addToCart"
                      class="uppercase btn-buy-now font-semibold text-[#e1af04] my-3 h-10 border-2 border-solid border-[#e1af04] rounded-3px cursor-pointer text-14px text-center"
                    >
                      <font-awesome-icon
                        icon="fa-solid fa-cart-plus"
                        size="xl"
                        class="mt-2 pr-5"
                      />
                      <span>Thêm vào giỏ hàng</span>
                    </div>
                    <div
                      @click="showModal"
                      class="uppercase btn-buy-now bg-[#ffc705] my-3 h-10 border-1 border-solid border-[#e1af04] rounded-3px cursor-pointer hover:bg-[#fce233] active:bg-[#fce233] text-14px flex justify-center align-center font-semibold"
                    >
                      <span>Mua ngay</span>
                      <a-modal
                        v-model:open="openModal"
                        :footer="null"
                        :closable="false"
                        centered
                      >
                        <div class="flex gap-10">
                          <div>
                            <img
                              :src="
                                `http://localhost:8000/uploads/` +
                                this.book.photo
                              "
                              alt="#"
                              class="max-w-[242px]"
                            />
                          </div>
                          <div class="grow">
                            <p class="mb-4 text-lg font-semibold">
                              {{ this.book.name }}
                            </p>
                            <div class="text-14px font-medium">
                              <p>Số lượng: {{ this.quantity }}</p>
                              <p>
                                Giá:
                                <span class="text-[#ca2027] text-xl"
                                  >{{
                                    new Intl.NumberFormat().format(
                                      (this.book.price -
                                        (this.book.price * this.book.discount) /
                                          100) *
                                        this.quantity
                                    )
                                  }}
                                  đ
                                </span>
                              </p>
                            </div>
                            <div class="flex justify-end mt-10">
                              <a-button
                                class="bg-[#0b703d] text-white"
                                size="large"
                                @click="confirmOrder"
                                >Xác nhận</a-button
                              >
                            </div>
                          </div>
                        </div>
                      </a-modal>
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
                    <v-dialog v-model="alertSuccess" width="auto">
                      <v-card max-width="500" :style="{ fontSize: '16px' }">
                        <template v-slot:actions>
                          <div class="flex flex-col gap-5 align-center p-5">
                            <div>
                              <v-icon :size="50">mdi-check-circle</v-icon>
                            </div>
                            <p>Thêm vào giỏ hàng thành công</p>
                          </div>
                        </template>
                      </v-card>
                    </v-dialog>
                  </div>
                  <div v-else>
                    <div class="status-label text-red flex justify-end py-2">
                      <font-awesome-icon
                        icon="fa-solid fa-circle-xmark"
                        size="xl"
                        class="mr-2"
                      />
                      <span class="text-14px uppercase font-semibold"
                        >Hết hàng
                      </span>
                    </div>
                    <p class="status-description text-[#999] text-12px">
                      Sách này sẽ được Vinabook.com nhập trong thời gian sắp tới
                      và sẽ có thông báo tới quý khách. Xin lỗi vì sự bất tiện
                      này.
                    </p>
                    <div
                      class="btn-buy-now bg-grey mt-8 h-10 border-1 border-solid rounded-3px cursor-pointer text-14px flex justify-center font-semibold"
                    >
                      <button><v-icon>mdi-cart-off</v-icon></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <a-tabs
          v-model:activeKey="activeKey"
          animated
          :tabBarGutter="40"
          :tabBarStyle="{
            color: '#888',
            textTransform: 'uppercase',
            fontWeight: '600'
          }"
          class="font-montserrat pb-8"
        >
          <a-tab-pane key="1" tab="Giới thiệu sách">
            <div class="text-[#555] flex gap-14">
              <div class="w-3/4 h-auto">
                <p class="text-base mt-5 mb-2.5 font-semibold">
                  {{ book.name }}
                </p>
                <div>
                  <h3 class="text-15px mt-8 font-semibold">
                    {{ book.name }}
                  </h3>
                  <p class="text-17px py-1.5">
                    {{ book.description }}
                  </p>
                </div>
              </div>
              <div
                class="w-1/4 h-58 mt-6 border-1 border-solid border-[#d1d3d4] p-5 shadow-box-author-info-detail-book"
              >
                <h3
                  class="text-base text-[#087b39] pb-2.5 mt-1 border-b-1 border-dashed border-black"
                >
                  Thông tin tác giả
                </h3>
                <div>
                  <div class="text-[16px] text-[#087b39] mb-5px mt-3">
                    <router-link
                      :to="{
                        path: '/search',
                        query: {
                          q: `${book.author?.slug}`
                        }
                      }"
                      class="hover:text-[#087b39]"
                      >{{ book.author?.name }}
                    </router-link>
                  </div>
                  <p class="author-detail-description mb-4 text-14px">
                    {{ book.author?.description }}
                  </p>
                  <div class="text-[#087b39]">
                    <font-awesome-icon
                      icon="fa-solid fa-angles-right"
                      class="mr-2"
                    />
                    <router-link
                      :to="{
                        path: '/search',
                        query: {
                          q: `${book.author?.slug}`
                        }
                      }"
                      class="hover:text-[#087b39]"
                      >Xem tất cả sách của tác giả
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="Thông tin chi tiết">
            <div class="text-[#555] pb-12">
              <h2 class="text-16px py-5 font-semibold">Thông tin chi tiết</h2>
              <div class="w-[900px] flex justify-between text-14px">
                <ul>
                  <li class="flex gap-10 mb-1.5">
                    <p class="w-32">Tác giả:</p>
                    <p class="font-medium">{{ book.author?.name }}</p>
                  </li>
                  <li class="flex gap-10 mb-1.5">
                    <p class="w-32">Nhà phát hành:</p>
                    <p class="font-medium">{{ book.publisher?.name }}</p>
                  </li>
                  <li class="flex gap-10 mb-1.5">
                    <p class="w-32">Khối lượng:</p>
                    <p class="font-medium">{{ book.weight }} gram</p>
                  </li>
                  <li class="flex gap-10 mb-1.5">
                    <p class="w-32">Định dạng:</p>
                    <p class="font-medium">{{ book.format }}</p>
                  </li>
                  <li class="flex gap-10">
                    <p class="w-32">Ngày phát hành:</p>
                    <p class="font-medium">{{ book.date_release }}</p>
                  </li>
                </ul>
                <ul>
                  <li class="flex gap-10 mb-1.5">
                    <p class="w-28">Mã sản phẩm:</p>
                    <p class="font-medium">{{ book._id?.slice(-10) }}</p>
                  </li>
                  <li class="flex gap-10 mb-1.5">
                    <p class="w-28">Ngôn ngữ:</p>
                    <p class="font-medium">{{ book.language }}</p>
                  </li>
                  <li class="flex gap-10 mb-1.5">
                    <p class="w-28">Kích thước:</p>
                    <p class="font-medium">{{ book.size }}</p>
                  </li>
                  <li class="flex gap-10">
                    <p class="w-28">Số trang:</p>
                    <p class="font-medium">{{ book.page_number }}</p>
                  </li>
                </ul>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="3" tab="Đánh giá & bình luận">
            <div class="flex gap-5 align-end mb-4">
              <span class="text-xl">Đánh giá:</span>
              <a-rate :value="2.5" allow-half />
              <span class="text-xl">(2.5 / 5)</span>
            </div>
            <a-list
              class="text-xl font-montserrat"
              header="Bình Luận"
              item-layout="horizontal"
              :data-source="comments"
            >
              <template #renderItem="{ item }">
                <a-list-item>
                  <a-comment :author="item.author">
                    <template #actions>
                      <span
                        v-for="(action, index) in item.actions"
                        :key="index"
                        >{{ action }}</span
                      >
                    </template>
                    <template #avatar>
                      <a-avatar>
                        <template #icon>
                          <v-icon class="pb-1">mdi-account</v-icon>
                        </template>
                      </a-avatar>
                    </template>
                    <template #content>
                      <p>
                        {{ item.content }}
                      </p>
                    </template>
                    <template #datetime>
                      <a-tooltip :title="2">
                        <span>{{ item.datetime }} days ago</span>
                      </a-tooltip>
                    </template>
                  </a-comment>
                </a-list-item>
              </template>
            </a-list>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </main>
  <FooterComponent />
</template>

<script>
import { ref } from 'vue';
import HeaderComponent from '../components/Header/HeaderComponent.vue';
import FooterComponent from '../components/Footer/FooterComponent.vue';
import Loading from 'vue-loading-overlay';

export default {
  name: 'BookDetailView',
  data() {
    return {
      openModal: false,
      isLoading: true,
      activeKey: ref('1'),
      comments: [
        {
          actions: ['Reply to'],
          author: 'Han Solo',
          avatar: 'https://joeschmoe.io/api/v1/random',
          content:
            'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
          datetime: 2
        },
        {
          actions: ['Reply to'],
          author: 'Han Solo',
          avatar: 'https://joeschmoe.io/api/v1/random',
          content:
            'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
          datetime: 2
        }
      ],
      book: {},
      alertLogin: false,
      alertSuccess: false,
      quantity: 1
    };
  },
  async mounted() {
    await this.getBook();
    this.isLoading = false;
  },
  components: {
    HeaderComponent,
    FooterComponent,
    Loading
  },
  methods: {
    async getBook() {
      try {
        const book = await this.$axios.get(
          `${process.env.VUE_APP_SERVER_URL}/books/${this.$route.params.id}`
        );

        this.book = book.data;
      } catch (error) {
        this.$toast.error(error.response?.data?.message || error.message);
      }
    },
    async addToCart() {
      if (this.$store.state.user.user) {
        try {
          await this.$store.dispatch('cart/addBookToUserCart', {
            data: { bookId: this.book._id, quantity: this.quantity },
            token: this.$store.state.user.user.token
          });
          this.alertSuccess = true;
        } catch (error) {
          this.$toast.error(error.response?.data?.message || error.message);
          window.location.reload();
        }
      } else {
        this.alertLogin = true;
      }
    },
    showModal() {
      this.openModal = true;
    },
    async confirmOrder() {
      if (this.$store.state.user.user) {
        try {
          await this.$store.dispatch('cart/addBookToUserCart', {
            data: { bookId: this.book._id, quantity: this.quantity },
            token: this.$store.state.user.user.token
          });

          this.$router.push({ name: 'CartView' });
        } catch (error) {
          this.$toast.error(error.response?.data?.message || error.message);
          window.location.reload();
        }
      } else {
        this.alertLogin = true;
      }
    }
  }
};
</script>

<style scoped>
.book-detail-description {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.author-detail-description {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
}
</style>
