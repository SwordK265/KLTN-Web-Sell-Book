<template>
  <div>
    <loading v-model:active="isLoading" />
    <div class="mt-2 mb-8 text-xl flex justify-between">
      <div>
        <span class="mr-3">CategoryTypes:</span>
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
              {{
                this.type === 1 ? 'Create CategoryType' : 'Edit CategoryType'
              }}
            </h1>
          </template>

          <a-form
            :model="categoryType"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 16 }"
            name="nest-messages"
            @finish="onFinish"
            class="mt-6"
          >
            <a-form-item name="name" label="Name" :rules="[{ required: true }]">
              <a-input v-model:value="categoryType.name" />
            </a-form-item>
            <a-form-item label="Slug" name="slug" :rules="[{ required: true }]">
              <a-input
                placeholder="nguyen-van-a"
                v-model:value="categoryType.slug"
              />
            </a-form-item>
            <a-form-item
              label="Category"
              name="category"
              :rules="[{ required: true }]"
            >
              <a-select v-model:value="categoryType.category">
                <a-select-option
                  v-for="category in getCategories"
                  :key="category._id"
                  :value="category?.name"
                >
                  {{ category?.name }}
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
      bordered
      size="middle"
      :columns="columns"
      :data-source="data"
      :pagination="pagination"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'category'">
          <span>
            {{ record.category[0]?.name }}
          </span>
        </template>
        <template v-if="column.key === 'action'">
          <span>
            <v-icon @click="changeCategoryTypeInfo(record)"
              >mdi-pencil-outline</v-icon
            >
            <a-divider type="vertical" />
            <v-icon @click="deleteCategoryType(record)"
              >mdi-trash-can-outline</v-icon
            >
            <a-divider type="vertical" />
          </span>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script>
import { CATEGORY_TYPE } from '@/assets/data/message';
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
      categoryTypeId: null,
      categoryType: {
        name: '',
        slug: '',
        category: ''
      },
      columns: [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          sorter: true
        },
        {
          title: 'Slug',
          dataIndex: 'slug',
          key: 'slug',
          sorter: true
        },
        {
          title: 'Category',
          dataIndex: 'category',
          key: 'category',
          sorter: true
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
    },
    getCategories() {
      return this.$store.state.category.categories;
    }
  },
  async mounted() {
    await this.$store.dispatch('category/getAllCategories');
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

        const response = await this.$store.dispatch(
          'categoryType/getAllCategoryTypesByAdmin',
          {
            query,
            token: this.getUser?.token
          }
        );

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
      this.categoryType = {
        name: '',
        slug: '',
        category: ''
      };

      this.openModal = true;
    },
    async onFinish(values) {
      try {
        if (this.type === 1) {
          await this.$store.dispatch('categoryType/createCategoryType', {
            data: values,
            token: this.getUser?.token
          });

          this.openModal = false;
          this.$toast.success(CATEGORY_TYPE.CREATE_SUCCESS);
          await this.fetchData({});
        } else {
          // type === 2
          await this.$store.dispatch('categoryType/updateCategoryType', {
            categoryTypeId: this.categoryTypeId,
            data: values,
            token: this.getUser?.token
          });

          this.openModal = false;
          this.$toast.success(CATEGORY_TYPE.UPDATE_SUCCESS);
          await this.fetchData({});
        }
      } catch (error) {
        this.$toast.error(error.message);
      }
    },
    changeCategoryTypeInfo(data) {
      this.categoryType = {
        name: data.name,
        slug: data.slug,
        category: data.category[0]?.name
      };

      this.type = 2;
      this.categoryTypeId = data._id;
      this.openModal = true;
    },
    async deleteCategoryType(data) {
      try {
        await this.$store.dispatch('categoryType/deleteCategoryType', {
          categoryTypeId: data._id,
          token: this.getUser?.token
        });

        this.$toast.success(CATEGORY_TYPE.DELETE_SUCCESS);
        await this.fetchData({});
      } catch (error) {
        this.$toast.error(error.message);
      }
    }
  }
};
</script>
