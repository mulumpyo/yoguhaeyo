<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const isScrolled = ref(false)

const onScroll = () => {
  const scrollY =
    typeof globalThis === 'object' && 'scrollY' in globalThis
      ? Number(globalThis.scrollY)
      : 0
  isScrolled.value = scrollY > 12
}

onMounted(() => {
  onScroll()
  if (typeof globalThis.addEventListener === 'function') {
    globalThis.addEventListener('scroll', onScroll, { passive: true })
  }
})

onBeforeUnmount(() => {
  if (typeof globalThis.removeEventListener === 'function') {
    globalThis.removeEventListener('scroll', onScroll)
  }
})
</script>

<template>
  <header
    :class="[
      'sticky top-0 z-50 border-b transition-all',
      isScrolled
        ? 'bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60'
        : 'bg-white',
    ]"
  >
    <MaxWidthWrapper class-name="flex h-16 items-center justify-between">
      <a href="#" class="text-lg font-bold tracking-tight">yoguhaeyo</a>
      <nav
        class="hidden items-center gap-6 text-sm font-medium text-gray-600 md:flex"
      >
        <a href="#features" class="hover:text-foreground">기능</a>
      </nav>
    </MaxWidthWrapper>
  </header>
</template>
