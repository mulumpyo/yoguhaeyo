<script setup lang="ts">
import { Rocket, ShieldCheck, Star, Users } from '@lucide/vue'

const currentYear = new Date().getFullYear()

const features = [
  {
    title: '빠른 시작',
    description:
      '프로젝트를 바로 만들고, 팀원들을 초대해서 곧바로 시작해보세요.',
    icon: Rocket,
  },
  {
    title: '직관적인 UI',
    description:
      '누구나 쉽게 적응할 수 있는, 깔끔한 인터페이스를 경험해보세요.',
    icon: Star,
  },
  {
    title: '안전한 협업',
    description:
      '프로젝트 진행 상황을 안전하고 효율적으로 관리하고 기록할 수 있어요.',
    icon: ShieldCheck,
  },
  {
    title: '강력한 팀워크',
    description: '팀원 간 정보를 빠르게 공유해 시너지를 높여보세요.',
    icon: Users,
  },
]
</script>

<template>
  <div class="flex min-h-screen flex-col bg-white text-foreground">
    <ScrollHeader />

    <section
      class="flex w-full items-center justify-center py-20 text-center md:py-32 lg:py-40"
    >
      <MaxWidthWrapper class-name="max-w-4xl">
        <div class="space-y-6">
          <h1
            class="text-3xl leading-tight font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-[4rem]"
          >
            아이디어를 바로 <span class="text-primary">현실로</span> 만드는
            <br />
            협업 플랫폼, <span class="text-primary">yoguhaeyo</span>
          </h1>
          <p
            class="mx-auto max-w-[800px] text-gray-500 md:text-xl/relaxed font-medium"
          >
            복잡한 과정은 없애고, 목표로 빠르게 나아가도록 설계했어요.
          </p>
          <div class="flex justify-center pt-4">
            <GithubLoginButton
              variant="default"
              text="GitHub 계정으로 시작하기"
              class-name="py-6 text-lg font-semibold shadow-lg"
              disabled
            />
          </div>
        </div>
      </MaxWidthWrapper>
    </section>

    <section
      id="features"
      class="w-full scroll-mt-16 bg-gray-50 py-16 md:py-28 lg:py-36"
    >
      <MaxWidthWrapper>
        <div
          class="mb-12 flex flex-col items-center justify-center space-y-4 text-center"
        >
          <h2
            class="text-2xl font-extrabold tracking-tighter sm:text-3xl md:text-4xl"
          >
            차별화된 핵심 기능
          </h2>
          <p class="max-w-[900px] text-gray-500 md:text-lg">
            복잡함은 빼고, 효율과 성과에만 집중하세요.
          </p>
        </div>

        <div
          class="mx-auto grid max-w-6xl items-stretch gap-4 py-2 sm:grid-cols-2 lg:grid-cols-4"
        >
          <Card
            v-for="feature in features"
            :key="feature.title"
            class="flex h-full flex-col items-start rounded-xl border border-gray-200 bg-white/70 p-6 shadow-md backdrop-blur-sm transition-shadow duration-300 hover:shadow-xl"
          >
            <CardHeader class="mb-4 p-0">
              <component :is="feature.icon" class="h-8 w-8 text-primary" />
            </CardHeader>
            <CardContent class="p-0">
              <CardTitle class="mb-1 flex h-10 items-center text-lg font-bold">
                {{ feature.title }}
              </CardTitle>
              <CardDescription class="mt-1 text-sm text-gray-500">
                {{ feature.description }}
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </MaxWidthWrapper>
    </section>

    <footer class="w-full shrink-0 border-t bg-white">
      <MaxWidthWrapper class-name="flex items-center justify-between py-8">
        <p class="text-sm font-medium text-gray-500">
          &copy; {{ currentYear }} yoguhaeyo. All rights reserved.
        </p>
      </MaxWidthWrapper>
    </footer>
  </div>
</template>
