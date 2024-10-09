<script setup>
import loginApi from '@/api/login';
import Message from "@/layouts/components/Message.vue";
import { useStore } from "@/pinia/index";
import logo from '@images/logo.jpg';
import { useRouter } from 'vue-router';
const message = ref()
const router = useRouter()
const store = useStore()
const form = ref({
  phone: '15957485856',
  password: '429322',
  remember: false,
})
onMounted(() => {
  nextTick(() => {
    store.setMessage(message)
  })
})
const isPasswordVisible = ref(false)
const goLogin = () => {
  loginApi.login(form.value).then(res => {
    localStorage.setItem("token", res.data.token);
    router.push('/')
  })
}
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard
      class="auth-card pa-4 pt-7"
      max-width="448"
    >
      <VCardItem class="justify-center">
        <template #prepend>
          <div class="d-flex">
            <img :src="logo" style="width: 50px;border-radius: 4px;" alt="">
          </div>
        </template>

        <VCardTitle class="text-2xl font-weight-bold">
          供应商管理系统
        </VCardTitle>
      </VCardItem>

      <VCardText class="pt-2">
        <h5 class="text-h5 mb-1">
          欢迎来到供应商管理系统！ 👋🏻
        </h5>
        <p class="mb-0">
         请登录你的账号
        </p>
      </VCardText>

      <VCardText>
        <VForm @submit.prevent="goLogin">
          <VRow>
            <!-- email -->
            <VCol cols="12">
              <VTextField
                v-model="form.phone"
                autofocus
                placeholder="请输入你的账号"
                label="账号"
              />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <VTextField
                v-model="form.password"
                label="密码"
                placeholder="············"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'bx-hide' : 'bx-show'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />

              <!-- remember me checkbox -->
              <div class="d-flex align-center justify-space-between flex-wrap mt-1 mb-4">
                <VCheckbox
                  v-model="form.remember"
                  label="记住密码"
                />

                <RouterLink
                  class="text-primary ms-2 mb-1"
                  to="javascript:void(0)"
                >
                  忘记密码?
                </RouterLink>
              </div>

              <!-- login button -->
              <VBtn
                block
                type="submit"
              >
                登录
              </VBtn>
            </VCol>

            <VCol
              cols="12"
              class="d-flex align-center"
            >
            </VCol>

          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </div>
   <Message ref="message" />
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";

.auth-wrapper {
  background-image: url("../assets/images/bg.png");
  background-size: cover;
}

</style>
