<script setup>
import { useRoute } from "vue-router";
onMounted(() => {});
const iframe = ref();
const route = useRoute();
localStorage.setItem("d-id", route.query.id);
localStorage.setItem("d-type", route.query.type);
if (!route.query.id || !route.query.type) {
  localStorage.setItem("d-id", null);
  localStorage.setItem("d-type", null);
}
</script>

<template>
  <iframe
    ref="iframe"
    src="/ankareport/index.html"
    frameborder="0"
    style="height: 100vh; width: 100vw"
  ></iframe>
</template>

<style lang="scss"></style>
