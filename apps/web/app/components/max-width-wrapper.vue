<script setup>
const props = defineProps({
  className: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div
    :class="`mx-auto w-full max-w-7xl px-4 md:px-8 lg:px-12 ${props.className}`"
  >
    <slot />
  </div>
</template>
