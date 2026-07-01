<script setup lang="ts">
import type { Platform } from '@aizome/shared';

defineProps<{
  content: string;
  platforms: Platform[];
}>();

const platformLabels: Record<Platform, string> = {
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
};
</script>

<template>
  <aside class="brutal-panel overflow-hidden" aria-labelledby="preview-title">
    <div
      class="flex items-center justify-between gap-4 border-b-2 border-aizome-blue bg-aizome-neon px-5 py-4 sm:px-6"
    >
      <div>
        <p class="brutal-label text-xs font-black text-aizome-ink">Live</p>
        <h2 id="preview-title" class="mt-1 text-xl font-black text-aizome-ink">
          Post preview
        </h2>
      </div>
      <span
        class="inline-flex items-center gap-2 border-2 border-aizome-blue bg-white px-3 py-2 text-[0.7rem] font-black uppercase tracking-[0.12em] text-aizome-blue"
      >
        <span class="size-2.5 bg-aizome-blue" aria-hidden="true"></span>
        Rendered
      </span>
    </div>

    <div class="p-5 sm:p-6">
      <div class="flex items-start gap-3">
        <div
          class="brutal-shadow-sm grid size-11 shrink-0 place-items-center border-2 border-aizome-blue bg-aizome-neon text-xs font-black tracking-[0.18em] text-aizome-ink"
          aria-hidden="true"
        >
          IT
        </div>
        <div>
          <p class="font-black text-aizome-ink">IteaLab</p>
          <p class="text-xs font-medium text-aizome-mist">
            Company update · Just now
          </p>
        </div>
      </div>

      <p
        class="brutal-shadow-sm mt-6 min-h-32 whitespace-pre-wrap border-2 border-aizome-blue bg-white px-4 py-4 text-[0.95rem] leading-7 text-aizome-ink"
        :class="{ 'text-aizome-mist': content.trim().length === 0 }"
      >
        {{
          content.trim().length > 0
            ? content
            : 'Your post will appear here as you write.'
        }}
      </p>

      <div class="mt-7 border-t-2 border-aizome-blue pt-4">
        <p class="brutal-label text-xs font-black text-aizome-blue">
          Destinations
        </p>
        <div v-if="platforms.length > 0" class="mt-3 flex flex-wrap gap-2">
          <span
            v-for="platform in platforms"
            :key="platform"
            class="border-2 border-aizome-blue bg-aizome-blue px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-white"
          >
            {{ platformLabels[platform] }}
          </span>
        </div>
        <p v-else class="mt-3 text-sm font-medium text-aizome-mist">
          Select at least one publishing channel.
        </p>
      </div>
    </div>
  </aside>
</template>
