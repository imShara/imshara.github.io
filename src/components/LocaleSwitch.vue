<script lang="ts" setup>
//// Functions
// const setLanguage = function (targetLocale: string) {
//   locale.value = targetLocale;
//   localStorage.setItem("lang", targetLocale);
// };

const route = useRoute();

const alternateLinks = computed(() => {
  if (!route?.meta?.alternate) {
    return [];
  }

  return route.meta.alternate.map((item) => ({
    rel: "alternate",
    hreflang: item.locale,
    href: `https://helpukraine.kz/${item.path}`,
  }));
});

useHead({
  link: alternateLinks,
});
</script>

<template>
  <ul>
    <li v-for="link in route.meta.alternate" :key="link.path">
      <router-link :to="link.path">{{ link.locale }}</router-link>
    </li>
  </ul>
</template>
