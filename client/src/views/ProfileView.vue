<template>
  <HeaderComponent />
  <ProfileComponent />
  <FooterComponent />
</template>

<script>
import HeaderComponent from '../components/Header/HeaderComponent.vue';
import ProfileComponent from '@/components/Profile/ProfileComponent.vue';
import FooterComponent from '../components/Footer/FooterComponent.vue';

export default {
  name: 'ProfileView',
  data() {
    return {};
  },
  components: {
    HeaderComponent,
    ProfileComponent,
    FooterComponent
  }
};
</script>
