<template>
  <div>
    <loading v-model:active="isLoading" />
    <div class="mt-2 mb-8 text-xl flex justify-between">
      <div>
        <span class="mr-3">Users:</span>
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
            <h1 class="text-center">Create User</h1>
          </template>

          <a-form
            :model="user"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 16 }"
            name="nest-messages"
            :validate-messages="validateMessages"
            @finish="onFinish"
            class="mt-6"
          >
            <a-form-item name="name" label="Name" :rules="[{ required: true }]">
              <a-input v-model:value="user.name" />
            </a-form-item>
            <a-form-item
              name="email"
              label="Email"
              :rules="[{ type: 'email', required: true }]"
            >
              <a-input v-model:value="user.email" />
            </a-form-item>
            <a-form-item
              label="Password"
              name="password"
              :rules="[this.type === 1 ? { required: true } : {}]"
            >
              <a-input-password v-model:value="user.password" />
            </a-form-item>
            <a-form-item name="phone" label="Phone" :maxlength="10">
              <a-input v-model:value="user.phone" />
            </a-form-item>
            <a-form-item name="role" label="Role">
              <a-radio-group v-model:value="user.role">
                <a-radio value="user">User</a-radio>
                <a-radio value="admin">Admin</a-radio>
              </a-radio-group>
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
            <v-icon @click="changeUserInfo(record)">mdi-pencil-outline</v-icon>
            <a-divider type="vertical" />
            <v-icon @click="deleteUser(record)">mdi-trash-can-outline</v-icon>
            <a-divider type="vertical" />
          </span>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script>
import Loading from 'vue-loading-overlay';
import { USER } from '@/assets/data/message';

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
      userId: null,
      columns: [
        {
          title: 'Email',
          dataIndex: 'email',
          key: 'email',
          sorter: true,
          width: 300
        },
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          sorter: true
        },
        {
          title: 'Phone',
          dataIndex: 'phone',
          key: 'phone'
        },
        {
          title: 'Role',
          dataIndex: 'role',
          key: 'role'
        },
        {
          title: 'Action',
          key: 'action'
        }
      ],
      user: {
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'user'
      },
      validateMessages: {
        required: '${label} is required!',
        types: {
          email: '${label} is not a valid email!'
        }
      }
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
        const response = await this.$store.dispatch('user/getAllUsers', {
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
    },
    showModal() {
      this.type = 1;
      this.user = {
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'user'
      };

      this.openModal = true;
    },
    async onFinish(values) {
      try {
        if (this.type === 1) {
          if (!values.phone) {
            delete values.phone;
          }

          await this.$store.dispatch('user/createUserByAdmin', {
            data: values,
            token: this.getUser?.token
          });

          this.openModal = false;
          this.$toast.success(USER.CREATE_SUCCESS);
          await this.fetchData({});
        } else {
          // type === 2
          if (!values.password) {
            delete values.password;
          }

          await this.$store.dispatch('user/updateUserByAdmin', {
            userId: this.userId,
            data: values,
            token: this.getUser?.token
          });

          this.openModal = false;
          this.$toast.success(USER.UPDATE_SUCCESS);
          await this.fetchData({});
        }
      } catch (error) {
        this.$toast.error(error.message);
      }
    },
    changeUserInfo(data) {
      this.user = {
        name: data.name,
        email: data.email,
        password: data.password || '',
        phone: data.phone,
        role: data.role
      };

      this.type = 2;
      this.userId = data._id;
      this.openModal = true;
    },
    async deleteUser(data) {
      try {
        await this.$store.dispatch('user/deleteUserByAdmin', {
          userId: data._id,
          token: this.getUser?.token
        });

        this.$toast.success(USER.DELETE_SUCCESS);
        await this.fetchData({});
      } catch (error) {
        this.$toast.error(error.message);
      }
    }
  }
};
</script>
