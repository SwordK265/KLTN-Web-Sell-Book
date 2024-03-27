<template>
  <HeaderComponent />
  <CartComponent />
  <FooterComponent />
</template>

<script>
import HeaderComponent from '../components/Header/HeaderComponent.vue';
import CartComponent from '../components/Cart/CartComponent.vue';
import FooterComponent from '../components/Footer/FooterComponent.vue';

export default {
  name: 'CartView',
  components: {
    HeaderComponent,
    CartComponent,
    FooterComponent
  }
};
</script>
