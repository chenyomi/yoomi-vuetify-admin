<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  stats: {
    type: String,
    required: true,
  },
  change: {
    type: Number,
    required: true,
    default: 0,
  },
});
</script>

<template>
  <VCard>
    <VCardText class="d-flex align-center pb-4">
      <img width="42" :src="props.image" alt="image" />

      <VSpacer />

      <MoreBtn size="x-small" class="me-n3 mt-n4" />
    </VCardText>

    <VCardText>
      <p class="mb-1">
        {{ props.title }}
      </p>
      <h5 class="text-h5 text-no-wrap mb-3">
        {{ props.stats }}
      </h5>
      <span
        :class="props.change > 0 ? 'text-success' : 'text-error'"
        class="d-flex align-center gap-1 text-sm"
      >
        <VIcon
          v-if="props.change"
          size="18"
          :icon="props.change > 0 ? 'bx-up-arrow-alt' : 'bx-down-arrow-alt'"
        />
        {{ props.change ? props.change + "%" : "-" }}
      </span>
    </VCardText>
  </VCard>
</template>
