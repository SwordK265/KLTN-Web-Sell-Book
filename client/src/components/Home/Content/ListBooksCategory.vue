<template>
  <div class="list-books-left relative">
    <div
      v-if="category"
      class="list-books-left-title py-10 font-semibold text-lg"
    >
      <span>{{ category?.name }}</span>
    </div>
    <div class="list-books-left-body">
      <div
        class="box-info-wrapper grid grid-cols-3 grid-rows-2 gap-x-[1.125rem] gap-y-[1.875rem]"
      >
        <router-link
          v-for="book in category?.books?.slice(0, 6)"
          :key="book._id"
          :to="{ path: `book/${book.slug}` }"
          class="box-info-book bg-white p-2.5 border border-[#eaeaea] border-solid cursor-pointer"
        >
          <div class="flex gap-4 mb-5 h-32">
            <div class="pic-book mt-[-20px] w-[34%]">
              <img :src="imageUrl + '/' + book.photo" alt="#" class="h-36" />
            </div>
            <div class="text-info-book w-40">
              <div
                class="text-info-book-name truncate font-semibold hover:underline hover:text-[#0a6f3c] active:underline active:text-[#0a6f3c]"
              >
                <router-link :to="{ path: `book/${book.slug}` }">{{
                  book?.name
                }}</router-link>
              </div>
              <p class="text-info-book-author text-xs text-[#848282]">
                {{ book?.author?.name || 'Unknown' }}
              </p>
              <div class="border-t my-3.5"></div>
              <div
                class="text-info-book-description leading-[1.125rem] text-[13px] h-[70px"
              >
                {{ book?.description }}
              </div>
            </div>
          </div>
          <div
            v-if="book.discount"
            class="price-book flex justify-between align-center pt-2.5 pb-1.5 text-[#c02026] border-[#d2d2d2] border-t border-dashed"
          >
            <div
              class="bg-[#f03737] text-[#fff] px-[10px] py-[5px] text-center font-semibold"
            >
              <span>{{ book.discount }}%</span>
            </div>
            <div class="flex gap-3">
              <div class="text-[#777] line-through">
                <span>{{ new Intl.NumberFormat().format(book.price) }} đ</span>
              </div>
              <div class="text-14px">
                <span class="font-semibold"
                  >{{
                    new Intl.NumberFormat().format(
                      book.price - book.price * (book.discount / 100)
                    )
                  }}
                  đ</span
                >
              </div>
            </div>
          </div>
          <div
            v-else
            class="price-book flex justify-end pt-2.5 pb-1.5 text-[#c02026] border-[#d2d2d2] border-t border-dashed"
          >
            <span class="text-14px font-semibold"
              >{{ new Intl.NumberFormat().format(book.price) }} đ</span
            >
          </div>
        </router-link>
      </div>
      <div
        class="read-more hover:underline active:underline absolute top-[42px] right-0"
      >
        <router-link
          :to="{ path: `/${category?.slug}` }"
          class="text-sm text-[#0a6f3c]"
          >Xem thêm</router-link
        >
        <font-awesome-icon
          size="xs"
          class="ml-2 text-[#929292]"
          icon="fa-solid fa-chevron-right"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['category'],
  data() {
    return {
      imageUrl: 'http://localhost:8000/uploads'
    };
  }
};
</script>

<style scoped>
.text-info-book-description {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
