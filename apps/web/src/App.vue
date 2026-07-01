<script setup lang="ts">
import type { Platform } from '@aizome/shared';
import { computed, ref } from 'vue';

import PlatformSelector from './components/PlatformSelector.vue';
import PostPreview from './components/PostPreview.vue';
import { canPublishPost } from './utils/postDraft.js';

const content = ref('');
const selectedPlatforms = ref<Platform[]>(['facebook', 'linkedin']);
const draftNotice = ref('');

const characterCount = computed(() => content.value.length);
const canPublish = computed(() =>
  canPublishPost(content.value, selectedPlatforms.value),
);

function handleDraftReview(): void {
  draftNotice.value =
    'Draft ready. API submission is intentionally not connected in this UI pass.';
}
</script>

<template>
  <div class="min-h-screen text-aizome-ink">
    <header class="border-b-2 border-aizome-blue bg-white">
      <div
        class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8"
      >
        <a
          class="flex items-center gap-4 font-semibold tracking-tight text-aizome-ink"
          href="/"
        >
          <span
            class="brutal-shadow-sm grid size-11 place-items-center border-2 border-aizome-blue bg-aizome-neon text-xs font-black tracking-[0.18em] text-aizome-ink"
          >
            AZ
          </span>
          <span class="flex flex-col">
            <span class="text-lg font-black uppercase tracking-[0.14em]">
              Aizome
            </span>
            <span class="text-xs font-medium text-aizome-mist">
              IteaLab publishing desk
            </span>
          </span>
        </a>

        <div class="flex flex-wrap items-center gap-3 text-xs font-bold">
          <span
            class="brutal-panel-soft inline-flex items-center gap-2 bg-aizome-midnight px-3 py-2"
          >
            <span class="size-2.5 bg-aizome-blue" aria-hidden="true"></span>
            Frontend mock
          </span>
          <span
            class="brutal-panel-soft inline-flex items-center gap-2 bg-aizome-neon px-3 py-2"
          >
            <span class="size-2.5 bg-white" aria-hidden="true"></span>
            2 channels ready
          </span>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
      <section
        class="brutal-panel overflow-hidden"
        aria-labelledby="mission-title"
      >
        <div class="grid lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.6fr)]">
          <div class="bg-aizome-neon px-5 py-8 sm:px-8 sm:py-10">
            <p
              class="brutal-label inline-flex border-2 border-aizome-blue bg-white px-3 py-1.5 text-xs font-black"
            >
              Social composer
            </p>
            <h1
              id="mission-title"
              class="mt-5 max-w-3xl text-4xl font-black leading-none tracking-[-0.04em] sm:text-6xl"
            >
              Media Centralize
            </h1>
            <p class="mt-5 max-w-2xl text-base font-medium leading-7 sm:text-lg">
              Compose once, live preview, and prepare the update for every audience.
            </p>
          </div>

          <dl class="grid grid-cols-3 border-t-2 border-aizome-blue lg:grid-cols-1 lg:border-l-2 lg:border-t-0">
            <div class="p-4 sm:p-5">
              <dt class="brutal-label text-[0.65rem] font-black text-aizome-mist">
                Channels
              </dt>
              <dd class="mt-2 text-xl font-black sm:text-2xl">02</dd>
            </div>
            <div class="border-l-2 border-aizome-blue p-4 sm:p-5 lg:border-l-0 lg:border-t-2">
              <dt class="brutal-label text-[0.65rem] font-black text-aizome-mist">
                Mode
              </dt>
              <dd class="mt-2 text-sm font-black sm:text-base">Mock</dd>
            </div>
            <div class="border-l-2 border-aizome-blue p-4 sm:p-5 lg:border-l-0 lg:border-t-2">
              <dt class="brutal-label text-[0.65rem] font-black text-aizome-mist">
                Limit
              </dt>
              <dd class="mt-2 text-sm font-black sm:text-base">3,000</dd>
            </div>
          </dl>
        </div>
      </section>

      <form
        class="mt-10 grid items-start gap-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(22rem,0.8fr)]"
        @submit.prevent="handleDraftReview"
      >
        <section
          class="brutal-panel overflow-hidden"
          aria-labelledby="editor-title"
        >
          <div
            class="flex items-center justify-between gap-4 border-b-2 border-aizome-blue bg-aizome-neon px-5 py-4 sm:px-6"
          >
            <div>
              <p class="brutal-label text-[0.7rem] font-black text-aizome-ink">
                Compose
              </p>
              <h2 id="editor-title" class="mt-1 text-xl font-black">
                Post content
              </h2>
            </div>
            <span
              class="inline-flex items-center gap-2 border-2 bg-white px-3 py-2 text-xs font-bold tabular-nums"
              :class="
                characterCount > 2800
                  ? 'border-red-700 text-red-700'
                  : 'border-aizome-blue text-aizome-blue'
              "
            >
              <span
                class="size-2.5"
                :class="characterCount > 2800 ? 'bg-red-700' : 'bg-aizome-blue'"
                aria-hidden="true"
              ></span>
              {{ characterCount }} / 3000
            </span>
          </div>

          <label class="sr-only" for="post-content">Post content</label>
          <textarea
            id="post-content"
            v-model="content"
            class="block min-h-64 w-full resize-y border-0 bg-white px-5 py-5 text-base leading-7 text-aizome-ink outline-none placeholder:text-aizome-mist focus:bg-aizome-midnight sm:min-h-72 sm:px-6"
            maxlength="3000"
            placeholder="What would you like to share with the IteaLab community?"
          ></textarea>

          <div class="border-t-2 border-aizome-blue px-5 py-5 sm:px-6">
            <PlatformSelector v-model="selectedPlatforms" />
          </div>

          <div
            class="flex flex-col gap-5 border-t-2 border-aizome-blue bg-aizome-midnight px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
          >
            <p class="max-w-md text-xs font-medium leading-5 text-aizome-mist">
              Review is local for now. No post will be sent to Facebook or
              LinkedIn.
            </p>
            <button
              type="submit"
              class="brutal-button min-h-11 border-2 border-aizome-blue bg-aizome-neon px-5 text-sm font-black text-aizome-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-aizome-blue disabled:cursor-not-allowed disabled:bg-white disabled:text-aizome-mist disabled:shadow-none"
              :disabled="!canPublish"
            >
              Review draft
            </button>
          </div>

          <p
            v-if="draftNotice"
            class="border-t-2 border-aizome-blue bg-aizome-neon px-5 py-3 text-sm font-bold sm:px-6"
            role="status"
            aria-live="polite"
          >
            {{ draftNotice }}
          </p>
        </section>

        <PostPreview
          class="xl:sticky xl:top-8"
          :content="content"
          :platforms="selectedPlatforms"
        />
      </form>
    </main>
  </div>
</template>
