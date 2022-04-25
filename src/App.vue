<script setup lang="ts">
const { locale } = useI18n({
  inheritLocale: true,
  useScope: "global",
});

const route = useRoute();
if (route.params.locale) {
  locale.value = route.params.locale.toString();
}
</script>

<template>
  <router-view />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
