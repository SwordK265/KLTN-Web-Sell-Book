<template>
  <div class="flex min-h-screen">
    <div class="w-[630px] px-12 py-4 bg-white">
      <div>
        <p class="font-bold uppercase text-lg my-4">Vinabook / Super</p>
      </div>
      <div class="mt-12">
        <p class="font-bold text-3xl">Log in</p>
        <p class="text-gray-600 text-lg">Log in to Vinabook Super</p>
        <a-form
          :model="user"
          name="basic"
          autocomplete="off"
          @finish="logIn"
          class="mt-12"
        >
          <span class="font-bold text-lg">Email</span>
          <a-form-item
            name="email"
            :rules="[
              {
                required: true,
                message: 'Please input your email!',
                email: 'Invalid email!'
              }
            ]"
            class="mt-2"
          >
            <a-input
              class="w-[534px]"
              size="large"
              v-model:value="user.email"
            />
          </a-form-item>

          <span class="font-bold text-lg">Password</span>
          <a-form-item
            name="password"
            :rules="[
              { required: true, message: 'Please input your password!' }
            ]"
            class="mt-2"
          >
            <a-input-password
              class="w-[534px]"
              size="large"
              v-model:value="user.password"
            />
          </a-form-item>

          <a-form-item>
            <a-button
              class="bg-[#313b47] text-white font-medium mt-3"
              size="large"
              block
              html-type="submit"
              >Log in</a-button
            >
          </a-form-item>
        </a-form>
      </div>
    </div>
    <div class="image bg-[]"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        email: '',
        password: ''
      }
    };
  },
  methods: {
    async logIn() {
      try {
        await this.$store.dispatch('user/loginUser', {
          email: this.user.email,
          password: this.user.password
        });

        this.email = this.password = '';

        this.$router.push({ name: 'AdminView' });
      } catch (error) {
        this.$toast.error(error.message);
      }
    }
  }
};
</script>

<style scoped>
.image {
  background-image: url('../../assets/img/img-book-image.avif');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
}
</style>
