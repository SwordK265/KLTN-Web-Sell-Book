<template>
  <div>
    <loading v-model:active="isLoading" />
    <div class="mt-2 mb-8 text-xl flex justify-between">
      <div>
        <span class="mr-3">Authors:</span>
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
              {{ this.type === 1 ? 'Create Author' : 'Edit Author' }}
            </h1>
          </template>

          <a-form
            :model="author"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 16 }"
            name="nest-messages"
            @finish="onFinish"
            class="mt-6"
          >
            <a-form-item name="name" label="Name" :rules="[{ required: true }]">
              <a-input v-model:value="author.name" />
            </a-form-item>
            <a-form-item
              name="description"
              label="Description"
              :rules="[{ required: true }]"
            >
              <a-textarea v-model:value="author.description" :rows="4" />
            </a-form-item>
            <a-form-item label="Slug" name="slug" :rules="[{ required: true }]">
              <a-input placeholder="nguyen-van-a" v-model:value="author.slug" />
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
        <template v-if="column.key === 'action'">
          <span>
            <v-icon @click="changeAuthorInfo(record)"
              >mdi-pencil-outline</v-icon
            >
            <a-divider type="vertical" />
            <v-icon @click="deleteAuthor(record)">mdi-trash-can-outline</v-icon>
            <a-divider type="vertical" />
          </span>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script>
import { AUTHOR } from '@/assets/data/message';
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
      authorId: null,
      author: {
        name: '',
        description: '',
        slug: ''
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
          width: 1000
        },
        {
          title: 'Action',
          key: 'action'
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
        const response = await this.$store.dispatch(
          'author/getAllAuthorsByAdmin',
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
      this.author = {
        name: '',
        description: '',
        slug: ''
      };

      this.openModal = true;
    },
    async onFinish(values) {
      try {
        if (this.type === 1) {
          await this.$store.dispatch('author/createAuthor', {
            data: values,
            token: this.getUser?.token
          });

          this.openModal = false;
          this.$toast.success(AUTHOR.CREATE_SUCCESS);
          await this.fetchData({});
        } else {
          // type === 2
          await this.$store.dispatch('author/updateAuthor', {
            authorId: this.authorId,
            data: values,
            token: this.getUser?.token
          });

          this.openModal = false;
          this.$toast.success(AUTHOR.UPDATE_SUCCESS);
          await this.fetchData({});
        }
      } catch (error) {
        this.$toast.error(error.message);
      }
    },
    changeAuthorInfo(data) {
      this.author = {
        name: data.name,
        description: data.description,
        slug: data.slug
      };

      this.type = 2;
      this.authorId = data._id;
      this.openModal = true;
    },
    async deleteAuthor(data) {
      try {
        await this.$store.dispatch('author/deleteAuthor', {
          authorId: data._id,
          token: this.getUser?.token
        });

        this.$toast.success(AUTHOR.DELETE_SUCCESS);
        await this.fetchData({});
      } catch (error) {
        this.$toast.error(error.message);
      }
    }
  }
};
</script>
