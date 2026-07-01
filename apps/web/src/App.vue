<script setup lang="ts">
const stack = [
  { label: 'Web', value: 'Vue 3 + Vite' },
  { label: 'API', value: 'Express + TypeScript' },
  { label: 'Data', value: 'PostgreSQL' },
] as const;
</script>

<template>
  <div class="min-h-screen bg-aizome-canvas text-aizome-ink">
    <header class="border-b border-aizome-mist/60 bg-white">
      <div
        class="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8"
      >
        <a class="text-xl font-semibold tracking-tight text-aizome-navy" href="/">
          Aizome
        </a>
        <span class="text-sm font-medium text-aizome-blue">IteaLab</span>
      </div>
    </header>

    <main class="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-5">
      <section class="lg:col-span-3">
        <p
          class="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-aizome-cyan"
        >
          Foundation ready
        </p>
        <h1
          class="max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-aizome-navy sm:text-5xl"
        >
          One calm workspace for IteaLab publishing.
        </h1>
        <p class="mt-6 max-w-xl text-lg leading-8 text-aizome-blue">
          The application skeleton is in place. Post creation and platform
          integrations will be added in later milestones.
        </p>
      </section>

      <aside
        class="border-l-4 border-aizome-aqua bg-aizome-wash/60 p-6 lg:col-span-2"
        aria-label="Project stack"
      >
        <h2 class="text-sm font-semibold uppercase tracking-wider text-aizome-navy">
          Project stack
        </h2>
        <dl class="mt-5 space-y-4">
          <div
            v-for="item in stack"
            :key="item.label"
            class="flex items-baseline justify-between gap-4 border-b border-aizome-mist/70 pb-3 last:border-0"
          >
            <dt class="text-sm text-aizome-blue">{{ item.label }}</dt>
            <dd class="text-right font-semibold text-aizome-navy">
              {{ item.value }}
            </dd>
          </div>
        </dl>
      </aside>
    </main>
  </div>
</template>
