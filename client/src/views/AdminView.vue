<template>
  <a-layout>
    <a-layout-header class="flex align-center justify-between">
      <div>
        <img :src="require('../assets/img/vnb_logo_2x.png')" alt="vinabook" />
      </div>
      <div class="text-white">
        <v-icon size="large" class="mr-2">mdi-account-circle</v-icon>
        <a-dropdown placement="bottom" :arrow="{ pointAtCenter: true }">
          <a class="ant-dropdown-link text-base" @click.prevent>{{
            getUser?.name
          }}</a>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <a @click="logout">Đăng xuất</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </a-layout-header>
    <a-layout>
      <a-layout-sider width="250" style="background: #fff">
        <a-menu
          v-model:selectedKeys="selectedKeys"
          v-model:openKeys="openKeys"
          mode="inline"
          :style="{
            minHeight: '875px',
            borderRight: 0
          }"
        >
          <a-menu-item key="1">
            <div class="flex align-center gap-2">
              <v-icon>mdi-account-details-outline</v-icon>
              <span class="font-semibold">Manage Users</span>
            </div>
          </a-menu-item>
          <a-sub-menu key="sub1">
            <template #title>
              <div class="flex align-center gap-2">
                <v-icon>mdi-database-outline</v-icon>
                <span class="font-semibold">Manage Data</span>
              </div>
            </template>
            <a-menu-item key="2">Authors</a-menu-item>
            <a-menu-item key="3">Publishers</a-menu-item>
            <a-menu-item key="4">Categories</a-menu-item>
            <a-menu-item key="5">CategoryTypes</a-menu-item>
            <a-menu-item key="6">Books</a-menu-item>
            <a-menu-item key="7">Payments</a-menu-item>
            <a-menu-item key="8">Carts</a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>
      <a-layout style="padding: 24px 24px 24px">
        <a-layout-content class="bg-[#fff] p-6 m-0 min-h-[280px]">
          <router-view></router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'AdminView',
  data() {
    return {
      selectedKeys: ref(['1']),
      openKeys: ref(['sub1', 'sub2'])
    };
  },
  computed: {
    getUser() {
      return this.$store.state.user.user;
    }
  },
  watch: {
    selectedKeys() {
      this.handleClick();
    }
  },
  components: {},
  mounted() {
    this.handleClick();
  },
  methods: {
    handleClick() {
      switch (this.selectedKeys[0]) {
        case '1':
          this.$router.push('/vinabook-super/users');
          break;
        case '2':
          this.$router.push('/vinabook-super/authors');
          break;
        case '3':
          this.$router.push('/vinabook-super/publishers');
          break;
        case '4':
          this.$router.push('/vinabook-super/categories');
          break;
        case '5':
          this.$router.push('/vinabook-super/category-types');
          break;
        case '6':
          this.$router.push('/vinabook-super/books');
          break;
        case '7':
          this.$router.push('/vinabook-super/payments');
          break;
        case '8':
          this.$router.push('/vinabook-super/carts');
          break;
        default:
          this.$router.push('/vinabook-super/users');
      }
    },
    logout() {
      this.$store.dispatch('user/logout');
      this.$router.push({ name: 'Login' });
    }
  }
};
</script>
