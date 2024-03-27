<template>
  <div>
    <button @click="dialog = true">{{ text }}</button>
    <v-dialog v-model="dialog" width="450">
      <v-card
        width="450"
        :style="{ height: isActive === 1 ? '350px' : '550px' }"
      >
        <template v-slot:actions>
          <div
            class="relative w-1/2 py-2 mx-2 text-center hover:delay-150 hover:text-[#087b44] hover:border-b-2 hover:border-solid hover:border-[#087b44]"
            :style="{
              'border-bottom': isActive === 1 ? 'solid 2px #087b44' : '',
              color: isActive === 1 ? '#087b44' : ''
            }"
            @click="setActiveButton(1)"
          >
            <span>Đăng nhập</span>
            <div
              class="px-8 py-5 absolute text-left w-450 -left-[16px] top-[38px] bg-white"
              :style="{ display: isActive === 1 ? 'block' : 'none' }"
            >
              <div class="d-flex align-center justify-center">
                <v-sheet width="400" class="mx-auto">
                  <v-form fast-fail @submit.prevent="login">
                    <v-text-field
                      variant="outlined"
                      v-model="email"
                      label="Email"
                      placeholder="johndoe@gmail.com"
                      :rules="[rules.email]"
                      clearable
                      type="email"
                      class="mb-2"
                    ></v-text-field>

                    <v-text-field
                      variant="outlined"
                      v-model="password"
                      label="Password"
                      :rules="[rules.required]"
                      clearable
                      type="password"
                    ></v-text-field>
                    <a
                      href="#"
                      class="text-body-2 font-weight-regular flex justify-end inline-block mb-2 mt-1 hover:underline"
                      >Quên mật khẩu?</a
                    >

                    <v-btn
                      type="submit"
                      block
                      class="mt-2 mb-3 bg-green text-white"
                      >Đăng nhập</v-btn
                    >
                  </v-form>
                </v-sheet>
              </div>
            </div>
          </div>
          <div
            class="relative w-1/2 py-2 mx-2 text-center hover:delay-150 hover:text-[#087b44] hover:border-b-2 hover:border-solid hover:border-[#087b44]"
            :style="{
              'border-bottom': isActive === 2 ? 'solid 2px #087b44' : '',
              color: isActive === 2 ? '#087b44' : ''
            }"
            @click="setActiveButton(2)"
          >
            <span>Đăng ký</span>
            <div
              class="absolute px-8 py-4 text-left bg-white w-450 -right-[16px] top-[38px] hidden"
              :style="{ display: isActive === 2 ? 'block' : 'none' }"
            >
              <div class="d-flex align-center justify-center">
                <v-sheet width="400" class="mx-auto">
                  <v-form fast-fail @submit.prevent="signup">
                    <v-text-field
                      variant="outlined"
                      v-model="name"
                      label="Nhập tên"
                      :rules="[rules.required]"
                      clearable
                    ></v-text-field>

                    <v-text-field
                      variant="outlined"
                      v-model="email"
                      label="Nhập email"
                      placeholder="johndoe@gmail.com"
                      :rules="[rules.email]"
                      clearable
                      type="email"
                      class="mb-2"
                    ></v-text-field>

                    <v-text-field
                      variant="outlined"
                      v-model="password"
                      label="Nhập mật khẩu"
                      :rules="[rules.password, rules.length(6)]"
                      clearable
                      type="password"
                    ></v-text-field>

                    <v-text-field
                      variant="outlined"
                      v-model="phone"
                      label="Nhập số điện thoại"
                      clearable
                      class="mt-2"
                    ></v-text-field>

                    <v-btn type="submit" block class="mt-2 bg-green text-white"
                      >Đăng Ký</v-btn
                    >
                  </v-form>
                </v-sheet>
              </div>
              <div class="my-5 text-center">
                <p>Bằng việc bấm vào nút đăng ký, bạn đã chấp nhận</p>
                <div class="text-[#087b44] hover:underline">
                  <a href="#">chính sách bảo mật thông tin</a>
                </div>
              </div>
            </div>
          </div>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isActive: 1,
      errorLogin: false,
      dialog: false,
      name: '',
      email: '',
      password: '',
      phone: '',
      rules: {
        email: (v) => !!(v || '').match(/@/) || 'Please enter a valid email',
        length: (len) => (v) =>
          (v || '').length >= len ||
          `Invalid character length, required ${len}`,
        password: (v) =>
          !!(v || '').match(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/
          ) ||
          'Password must contain an upper case letter, a numeric character, and a special character',
        required: (v) => !!v || 'This field is required'
      }
    };
  },
  methods: {
    setActiveButton(button) {
      this.isActive = button;
    },
    async signup() {
      try {
        await this.$store.dispatch('user/signupUser', {
          name: this.name,
          email: this.email,
          password: this.password,
          phone: this.phone
        });

        this.email = this.password = this.phone = '';
        this.dialog = false;
        this.$toast.success('Signup successfully!');
      } catch (error) {
        this.$toast.error(error.response?.data?.message || error.message);
      }
    },
    async login() {
      try {
        await this.$store.dispatch('user/loginUser', {
          email: this.email,
          password: this.password
        });

        this.email = this.password = '';
        this.dialog = false;

        this.$toast.success('Login successfully!');
        // this.loading = false
      } catch (error) {
        this.$toast.error(error.response?.data?.message || error.message);
      }
    }
  },
  props: ['text']
};
</script>
