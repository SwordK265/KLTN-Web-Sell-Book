<template>
  <div>
    <loading v-model:active="isLoading" />
    <div class="mt-2 mb-8 text-xl flex justify-between">
      <div>
        <span class="mr-3">Books:</span>
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
      <div class="bg-blue rounded">
        <a-button type="primary" @click="showModal">Create</a-button>
        <a-modal
          v-model:open="openModal"
          :footer="null"
          :closable="false"
          :width="400"
        >
          <template #title>
            <h1 class="text-center">
              {{ this.type === 1 ? 'Create Book' : 'Edit Book' }}
            </h1>
          </template>

          <a-form
            :model="book"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 16 }"
            name="nest-messages"
            @finish="onFinish"
            class="mt-6"
          >
            <a-form-item name="name" label="Name" :rules="[{ required: true }]">
              <a-input v-model:value="book.name" />
            </a-form-item>
            <a-form-item label="Slug" name="slug" :rules="[{ required: true }]">
              <a-input placeholder="nguyen-van-a" v-model:value="book.slug" />
            </a-form-item>
            <a-form-item label="Description" name="description">
              <a-textarea v-model:value="book.description" :rows="4" />
            </a-form-item>
            <a-form-item
              label="Price"
              name="price"
              :rules="[{ required: true }]"
            >
              <a-input-number
                id="inputPrice"
                v-model:value="book.price"
                :min="1"
                style="width: 100%"
              />
            </a-form-item>
            <a-form-item label="Language" name="language">
              <a-radio-group v-model:value="book.language">
                <a-radio value="Tiếng Việt">Tiếng Việt</a-radio>
                <a-radio value="Tiếng Anh">Tiếng Anh</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item label="Photo" name="photo">
              <a-upload
                action="http://localhost:8000/photo/upload"
                v-model:file-list="fileList"
                :maxCount="1"
                accept="image/*"
                list-type="picture-card"
                @change="handleUpload"
              >
                <div>
                  <v-icon>mdi-plus</v-icon>
                  <div style="margin-top: 8px">Upload</div>
                </div>
              </a-upload>
            </a-form-item>
            <a-form-item label="Size" name="size">
              <a-input v-model:value="book.size" />
            </a-form-item>
            <a-form-item label="Page Number" name="page_number">
              <a-input-number
                id="inputPageNumber"
                v-model:value="book.page_number"
                :min="1"
                :max="10000"
                style="width: 100%"
              />
            </a-form-item>
            <a-form-item label="Weight" name="weight">
              <a-input-number
                id="inputWeight"
                v-model:value="book.weight"
                :min="1"
                :max="10000"
                style="width: 100%"
              />
            </a-form-item>
            <a-form-item label="Date Release" name="date_release">
              <a-input v-model:value="book.date_release" />
            </a-form-item>
            <a-form-item label="Format" name="format">
              <a-radio-group v-model:value="book.format">
                <a-radio value="Bìa cứng">Bìa Cứng</a-radio>
                <a-radio value="Bìa mềm">Bìa Mềm</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item
              label="Quantity"
              name="quantity"
              :rules="[{ required: true }]"
            >
              <a-input-number
                id="inputQuantity"
                v-model:value="book.quantity"
                :min="1"
                :max="1000"
                style="width: 100%"
              />
            </a-form-item>
            <a-form-item label="Sold" name="sold">
              <a-input-number
                id="inputSold"
                v-model:value="book.sold"
                :min="1"
                style="width: 100%"
                :max="10000"
              />
            </a-form-item>
            <a-form-item label="Discount" name="discount">
              <a-input-number
                id="inputDiscount"
                v-model:value="book.discount"
                :min="1"
                style="width: 100%"
                :max="100"
              />
            </a-form-item>
            <a-form-item label="Author" name="author">
              <a-select v-model:value="book.author">
                <a-select-option
                  v-for="author in getAuthors"
                  :key="author._id"
                  :value="author?.name"
                >
                  {{ author?.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="Publisher" name="publisher">
              <a-select v-model:value="book.publisher">
                <a-select-option
                  v-for="publisher in getPublishers"
                  :key="publisher._id"
                  :value="publisher?.name"
                >
                  {{ publisher?.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              label="Category"
              name="category"
              :rules="[{ required: true }]"
            >
              <a-select v-model:value="book.category">
                <a-select-option
                  v-for="category in getCategories"
                  :key="category._id"
                  :value="category?.name"
                >
                  {{ category?.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              label="CategoryType"
              name="category_type"
              :rules="[{ required: true }]"
            >
              <a-select v-model:value="book.category_type">
                <a-select-option
                  v-for="cateType in getCategoryTypes"
                  :key="cateType._id"
                  :value="cateType?.name"
                >
                  {{ cateType?.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item :wrapper-col="{ span: 16, offset: 8 }">
              <a-button type="primary" html-type="submit" class="bg-blue">
                {{ type === 1 ? 'Create' : 'Edit' }}
              </a-button>
            </a-form-item>
          </a-form>
        </a-modal>
      </div>
    </div>
    <a-table
      class="ant-table-striped"
      size="middle"
      bordered
      :scroll="{ x: 2500 }"
      :columns="columns"
      :data-source="data"
      :pagination="pagination"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <span class="text-overflow">{{ record.name }} </span>
        </template>
        <template v-if="column.key === 'slug'">
          <span class="text-overflow">{{ record.slug }}</span>
        </template>
        <template v-if="column.key === 'description'">
          <span class="text-overflow">{{ record.description }}</span>
        </template>
        <template v-if="column.key === 'price'">
          <span>{{ new Intl.NumberFormat().format(record.price) }} đ</span>
        </template>
        <template v-if="column.key === 'weight'">
          <span>{{ record.weight }}</span>
        </template>
        <template v-if="column.key === 'photo'">
          <img :src="`http://localhost:8000/uploads/` + record.photo" alt="#" />
        </template>
        <template v-if="column.key === 'discount'">
          <span>{{ record.discount }}%</span>
        </template>
        <template v-if="column.key === 'author'">
          <span v-show="record.author[0]?.name"
            >{{ record.author[0]?.name }}
          </span>
        </template>
        <template v-if="column.key === 'publisher'">
          <span v-show="record.publisher[0]?.name"
            >{{ record.publisher[0]?.name }}
          </span>
        </template>
        <template v-if="column.key === 'category'">
          <span v-show="record.category[0]?.name"
            >{{ record.category[0]?.name }}
          </span>
        </template>
        <template v-if="column.key === 'category_type'">
          <span v-show="record.category_type[0]?.name"
            >{{ record.category_type[0]?.name }}
          </span>
        </template>
        <template v-if="column.key === 'action'">
          <span>
            <v-icon @click="changeBookInfo(record)">mdi-pencil-outline</v-icon>
            <a-divider type="vertical" />
            <v-icon @click="deleteBook(record)">mdi-trash-can-outline</v-icon>
            <a-divider type="vertical" />
          </span>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script>
import { BOOK } from '@/assets/data/message';
import Loading from 'vue-loading-overlay';

export default {
  data() {
    return {
      type: 1, // 1 - Create / 2- Edit
      openModal: false,
      file: [],
      isLoading: true, // Loading page
      search: '',
      pagination: {
        total: 0,
        current: 1,
        pageSize: 20
      },
      total: 0,
      data: [],
      bookId: null,
      book: {
        name: '',
        slug: '',
        description: '',
        price: '',
        language: 'Tiếng Việt',
        size: '',
        page_number: '',
        weight: '',
        date_release: '',
        format: 'Bìa cứng',
        quantity: '',
        photo: '',
        sold: '',
        discount: '',
        author: '',
        publisher: '',
        category: '',
        category_type: ''
      },
      columns: [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          sorter: true,
          width: 200
        },
        {
          title: 'Slug',
          dataIndex: 'slug',
          key: 'slug',
          sorter: true,
          width: 200
        },
        {
          title: 'Description',
          dataIndex: 'description',
          key: 'description',
          width: 400
        },
        {
          title: 'Price',
          dataIndex: 'price',
          key: 'price',
          sorter: true,
          width: 120
        },
        {
          title: 'Language',
          dataIndex: 'language',
          key: 'language',
          width: 100
        },
        {
          title: 'Size',
          dataIndex: 'size',
          key: 'size',
          width: 100
        },
        {
          title: 'Page Number',
          dataIndex: 'page_number',
          key: 'page_number',
          sorter: true,
          width: 100
        },
        {
          title: 'Weight',
          dataIndex: 'weight',
          key: 'weight',
          sorter: true,
          width: 100
        },
        {
          title: 'Date Release',
          dataIndex: 'date_release',
          key: 'date_release',
          sorter: true,
          width: 140
        },
        {
          title: 'Format',
          dataIndex: 'format',
          key: 'format',
          width: 100
        },
        {
          title: 'Quantity',
          dataIndex: 'quantity',
          key: 'quantity',
          sorter: true,
          width: 100
        },
        {
          title: 'Sold',
          dataIndex: 'sold',
          key: 'sold',
          sorter: true,
          width: 100
        },
        {
          title: 'Photo',
          dataIndex: 'photo',
          key: 'photo',
          width: 200
        },
        {
          title: 'Discount',
          dataIndex: 'discount',
          key: 'discount',
          sorter: true,
          width: 100
        },
        {
          title: 'Author',
          dataIndex: 'author',
          key: 'author',
          width: 140,
          sorter: true
        },
        {
          title: 'Publisher',
          dataIndex: 'publisher',
          key: 'publisher',
          sorter: true,
          width: 140
        },
        {
          title: 'Category',
          dataIndex: 'category',
          key: 'category',
          sorter: true,
          width: 200
        },
        {
          title: 'CategoryType',
          dataIndex: 'category_type',
          key: 'category_type',
          sorter: true,
          width: 200
        },
        {
          title: 'Action',
          key: 'action',
          width: 100
        }
      ],
      fileList: [
        {
          name: '',
          url: ''
        }
      ]
    };
  },
  components: { Loading },
  computed: {
    getUser() {
      return this.$store.state.user.user;
    },
    getCategories() {
      return this.$store.state.category.categories;
    },
    getCategoryTypes() {
      const categories = this.$store.state.category.categories;

      if (!this.book.category) {
        return [];
      }

      const findType = categories.find((el) => el.name === this.book.category);

      return findType.types;
    },
    getAuthors() {
      return this.$store.state.author.authors.data;
    },
    getPublishers() {
      return this.$store.state.publisher.publishers.data;
    }
  },
  async mounted() {
    await this.getDataRelevant();
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

        const response = await this.$store.dispatch('book/getAllBooksByAdmin', {
          query: { ...query, perPage: 5 },
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
    },
    showModal() {
      this.type = 1;
      this.book = {
        name: '',
        slug: '',
        description: '',
        price: '',
        language: 'Tiếng Việt',
        size: '',
        page_number: '',
        weight: '',
        date_release: '',
        format: 'Bìa mềm',
        quantity: '',
        sold: '',
        photo: '',
        discount: '',
        author: '',
        publisher: '',
        category: '',
        category_type: ''
      };

      this.openModal = true;
    },
    async handlePagination() {
      await this.fetchData({
        page: this.pagination.current
      });
    },
    async onFinish(values) {
      for (const field in values) {
        if (values[field] === '') {
          delete values[field];
        }
      }

      try {
        if (this.type === 1) {
          await this.$store.dispatch('book/createBook', {
            data: {
              ...values,
              photo: this.fileList[0].name
            },
            token: this.getUser?.token
          });
          this.openModal = false;
          this.$toast.success(BOOK.CREATE_SUCCESS);
          await this.fetchData({});
        } else {
          // type === 2
          await this.$store.dispatch('book/updateBook', {
            bookId: this.bookId,
            data: {
              ...values,
              photo: this.fileList[0].name
            },
            token: this.getUser?.token
          });

          this.openModal = false;
          this.$toast.success(BOOK.UPDATE_SUCCESS);
          await this.fetchData({});
        }
      } catch (error) {
        this.$toast.error(error.message);
      }
    },
    changeBookInfo(data) {
      this.book = {
        name: data.name,
        slug: data.slug,
        description: data.description || '',
        price: data.price,
        language: data.language,
        size: data.size || '',
        page_number: data.page_number || '',
        weight: data.weight || '',
        date_release: data.date_release || '',
        format: data.format,
        quantity: data.quantity,
        sold: data.sold || '',
        discount: data.discount || '',
        author: data.author[0]?.name || '',
        publisher: data.publisher[0]?.name || '',
        category: data.category[0]?.name,
        category_type: data.category_type[0]?.name
      };
      this.fileList[0] = {
        name: data.photo,
        url: `${process.env.VUE_APP_SERVER_PUBLIC_IMG_URL}/${data.photo}`
      };
      this.type = 2;
      this.bookId = data._id;
      this.openModal = true;
    },
    async deleteBook(data) {
      try {
        await this.$store.dispatch('book/deleteBook', {
          bookId: data._id,
          token: this.getUser?.token
        });
        this.$toast.success(BOOK.DELETE_SUCCESS);
        await this.fetchData({});
      } catch (error) {
        this.$toast.error(error.message);
      }
    },
    async getDataRelevant() {
      try {
        await this.$store.dispatch('category/getAllCategories');
        await this.$store.dispatch('author/getAllAuthors', {});
        await this.$store.dispatch('publisher/getAllPublishers', {});
      } catch (error) {
        this.$toast.error(error.message);
      }
    },
    handleUpload(info) {
      if (info.file.status === 'done') {
        this.fileList[0] = {
          name: info.file.name,
          url: `${process.env.VUE_APP_SERVER_PUBLIC_IMG_URL}/${info.file.name}`
        };
        this.$toast.success(`Image ${info.file.name} uploaded successfully`);
      } else if (info.file.status === 'error') {
        this.$toast.error(`Image ${info.file.name} upload failed.`);
      }
    }
  }
};
</script>

<style scoped>
.text-overflow {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
