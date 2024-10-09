<script setup>
import VerticalNavSectionTitle from "@/@layouts/components/VerticalNavSectionTitle.vue";
import Message from "@/layouts/components/Message.vue";
import { useStore } from "@/pinia/index";
import upgradeBannerDark from "@images/pro/upgrade-banner-dark.png";
import upgradeBannerLight from "@images/pro/upgrade-banner-light.png";
import VerticalNavLayout from "@layouts/components/VerticalNavLayout.vue";
import VerticalNavLink from "@layouts/components/VerticalNavLink.vue";
import { useTheme } from "vuetify";
// Components
import NavbarThemeSwitcher from "@/layouts/components/NavbarThemeSwitcher.vue";
import UserProfile from "@/layouts/components/UserProfile.vue";

const vuetifyTheme = useTheme();

const upgradeBanner = computed(() => {
  return vuetifyTheme.global.name.value === "light"
    ? upgradeBannerLight
    : upgradeBannerDark;
});

const pinia = useStore();
const message = ref();
pinia.setMessage(message);
provide("message", message);
</script>

<template>
  <VerticalNavLayout>
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <!-- 👉 Vertical nav toggle in overlay mode -->
        <IconBtn
          class="ms-n3 d-lg-none"
          @click="toggleVerticalOverlayNavActive(true)"
        >
          <VIcon icon="bx-menu" />
        </IconBtn>

        <!-- 👉 Search -->
        <div
          class="d-flex align-center cursor-pointer"
          style="user-select: none"
        >
          <!-- 👉 Search Trigger button -->
        </div>

        <VSpacer />
        <NavbarThemeSwitcher class="me-2" />

        <UserProfile />
      </div>
    </template>

    <template #vertical-nav-content>
      <VerticalNavLink
        :item="{
          title: '主页',
          icon: 'bx-home',
          to: '/dashboard',
        }"
      />
      <!-- <VerticalNavLink
        :item="{
          title: '账号中心',
          icon: 'mdi-account-cog-outline',
          to: '/account-settings',
        }"
      /> -->

      <!-- 👉 User Interface -->
      <VerticalNavSectionTitle
        :item="{
          heading: '报价管理',
        }"
      />
      <VerticalNavLink
        :item="{
          title: '未报价明细',
          icon: 'bx-color',
          to: '/noOffer',
        }"
      />
      <VerticalNavLink
        :item="{
          title: '未确认报价查询',
          icon: 'bx-cylinder',
          to: '/unOffer',
        }"
      />
      <VerticalNavLink
        :item="{
          title: '历史报价查询',
          icon: 'bx-check-square',
          to: '/hasOffer',
        }"
      />
      <!-- 👉 User Interface -->
      <VerticalNavSectionTitle
        :item="{
          heading: '订单管理',
        }"
      />
      <VerticalNavLink
        :item="{
          title: '未交订单',
          icon: 'bx-table',
          to: '/unOrder',
        }"
      />
      <VerticalNavLink
        :item="{
          title: '已交订单',
          icon: 'bx-table',
          to: '/hasOrder',
        }"
      />
      <!-- 👉 User Interface -->
      <VerticalNavSectionTitle
        :item="{
          heading: '发货管理',
        }"
      />
      <VerticalNavLink
        :item="{
          title: '发货单打印',
          icon: 'bx-basket',
          to: '/invoiceP',
        }"
      />
      <VerticalNavLink
        :item="{
          title: '发货单列表',
          icon: 'mdi-form-select',
          to: '/barcodeInvoice',
        }"
      />
      <VerticalNavLink
        :item="{
          title: '条码打印',
          icon: 'bx-align-justify',
          to: '/barcodeP',
        }"
      />
      <VerticalNavSectionTitle
        :item="{
          heading: '开票对账',
        }"
      />
      <VerticalNavLink
        :item="{
          title: '上月开票',
          icon: 'bx-bar-chart-square',
          to: '/invoicing',
        }"
      />
      <VerticalNavLink
        :item="{
          title: '已交未开票',
          icon: 'bx-data',
          to: '/unInvoicing',
        }"
      />
      <VerticalNavLink
        :item="{
          title: '收款余额表',
          icon: 'bx-sidebar',
          to: '/balaquery',
        }"
      />
      <VerticalNavSectionTitle
        :item="{
          heading: '品质管理',
        }"
      />
      <VerticalNavLink
        :item="{
          title: '不合格处罚单',
          icon: 'mdi-alpha-t-box-outline',
          to: '/unqualified',
        }"
      />
      <VerticalNavLink
        :item="{
          title: '奖励明细表',
          icon: 'bx-detail',
          to: '/reward',
        }"
      />
    </template>

    <!-- 👉 Pages -->
    <slot />
  </VerticalNavLayout>
  <Message ref="message" />
</template>

<style lang="scss" scoped>
.meta-key {
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 6px;
  block-size: 1.5625rem;
  line-height: 1.3125rem;
  padding-block: 0.125rem;
  padding-inline: 0.25rem;
}
</style>
