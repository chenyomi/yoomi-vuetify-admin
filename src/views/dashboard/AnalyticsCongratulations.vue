<script setup>
import illustrationJohnDark from "@images/cards/illustration-john-dark.png";
import illustrationJohnLight from "@images/cards/illustration-john-light.png";
import { useTheme } from "vuetify";

const { global } = useTheme();
const illustrationJohn = computed(() =>
  global.name.value === "dark" ? illustrationJohnDark : illustrationJohnLight
);
</script>

<template>
  <VCard class="text-center text-sm-start">
    <VRow no-gutters>
      <VCol cols="12" sm="8" order="2" order-sm="1">
        <VCardItem>
          <VCardTitle class="text-md-h5 text-primary">
            欢迎来到供应商管理系统! 🎉
          </VCardTitle>
        </VCardItem>

        <VCardText>
          <span>
            现在是北京时间
            {{
              new Intl.DateTimeFormat("zh-cn", {
                timeStyle: "medium",
                dateStyle: "medium",
              }).format(new Date())
            }}
            <br />
            真实美好的一天。
          </span>
          <br />
          <VBtn variant="tonal" class="mt-4" size="small">
            加油！！冲鸭！！
          </VBtn>
        </VCardText>
      </VCol>

      <VCol cols="12" sm="4" order="1" order-sm="2" class="text-center">
        <img
          :src="illustrationJohn"
          :height="$vuetify.display.xs ? '150' : '175'"
          :class="$vuetify.display.xs ? 'mt-6 mb-n2' : 'position-absolute'"
          class="john-illustration flip-in-rtl"
        />
      </VCol>
    </VRow>
  </VCard>
</template>

<style lang="scss" scoped>
.john-illustration {
  inset-block-end: -0.0625rem;
  inset-inline-end: 3rem;
}
</style>
