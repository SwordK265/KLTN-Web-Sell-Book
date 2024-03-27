<template>
  <HeaderComponent />
  <main>
    <PicturesComponent />
    <MainContentComponent />
  </main>
  <FooterComponent />
</template>

<script>
import HeaderComponent from '../components/Header/HeaderComponent.vue';
import FooterComponent from '../components/Footer/FooterComponent.vue';
import PicturesComponent from '../components/Home/PicturesComponent.vue';
import MainContentComponent from '../components/Home/Content/MainContentComponent.vue';

export default {
  name: 'HomeView',
  components: {
    HeaderComponent,
    FooterComponent,
    PicturesComponent,
    MainContentComponent
  }
};
</script>
