<template>
  <VSnackbar
    v-model="snackbar"
    :timeout="timeout"
    location="top"
  >
    {{ text }}
  </VSnackbar>
</template>

<script setup>
import { ref } from 'vue'

const snackbar = ref(false)
const timeout = ref(2000)
const text = ref('')

const open = option => {
  if (option.timeout) {
    timeout.value = option.timeout
  }
  if (option.text) {
    text.value = option.text
  }
  snackbar.value = true
}

defineExpose({
  open,
})
</script>
