<script setup lang="ts">
import type { Platform } from '@aizome/shared';

import { togglePlatform } from '../utils/postDraft.js';

const props = defineProps<{
  modelValue: Platform[];
}>();

const emit = defineEmits<{
  'update:modelValue': [platforms: Platform[]];
}>();

const platforms: {
  id: Platform;
  name: string;
  destination: string;
  mark: string;
}[] = [
    {
      id: 'facebook',
      name: 'Facebook',
      destination: 'IteaLab fanpage',
      mark: 'FB',
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      destination: 'IteaLab company page',
      mark: 'IN',
    },
  ];

function isSelected(platform: Platform): boolean {
  return props.modelValue.includes(platform);
}

function handleToggle(platform: Platform): void {
  emit('update:modelValue', togglePlatform(props.modelValue, platform));
}
</script>

<template>
  <fieldset>
    <legend class="brutal-label mb-4 text-sm font-black text-aizome-blue">
      Publishing channels
    </legend>

    <div class="grid gap-5 sm:grid-cols-2">
      <label
        v-for="platform in platforms"
        :key="platform.id"
        class="group relative cursor-pointer"
      >
        <input
          class="peer sr-only"
          type="checkbox"
          :checked="isSelected(platform.id)"
          :value="platform.id"
          @change="handleToggle(platform.id)"
        />

        <span
          class="flex min-h-24 items-center gap-4 border-2 border-aizome-blue px-4 py-3 transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-aizome-blue"
          :class="
            isSelected(platform.id)
              ? 'brutal-shadow-sm bg-aizome-neon text-aizome-ink'
              : 'bg-white text-aizome-ink group-hover:bg-aizome-midnight'
          "
        >
          <span
            class="grid size-10 shrink-0 place-items-center border-2 border-aizome-blue text-[0.7rem] font-black tracking-[0.16em]"
            :class="
              isSelected(platform.id)
                ? 'bg-aizome-blue text-white'
                : 'bg-aizome-neon text-aizome-ink'
            "
            aria-hidden="true"
          >
            {{ platform.mark }}
          </span>

          <span class="min-w-0 flex-1">
            <span class="block font-black text-aizome-ink">
              {{ platform.name }}
            </span>
            <span class="mt-0.5 block text-xs font-medium text-aizome-mist">
              {{ platform.destination }}
            </span>
          </span>

          <span
            class="border-2 border-aizome-blue px-2 py-1 text-[0.65rem] font-black uppercase tracking-[0.12em]"
            :class="
              isSelected(platform.id)
                ? 'bg-white text-aizome-blue'
                : 'bg-aizome-midnight text-aizome-mist'
            "
          >
            {{ isSelected(platform.id) ? 'Selected' : 'Off' }}
          </span>
        </span>
      </label>
    </div>
  </fieldset>
</template>
