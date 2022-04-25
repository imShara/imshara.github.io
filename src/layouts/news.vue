<script setup lang="ts">
import Header from "../components/Header.vue";
const route = useRoute();

//// Load image
const datePath = computed(() => route.meta.date.split("/").join("-"));
const image = computed(() => `/data/news/${datePath.value}/image.jpg`);
</script>

<template>
  <Header />
  <h1>{{ route.meta.title }}</h1>
  <p>{{ route.meta.date }}</p>
  <img :src="image" :alt="route.meta.title" />
  <router-view />
</template>
