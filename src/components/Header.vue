<script setup lang="ts">
const { t, locale } = useI18n({
  inheritLocale: true,
});
</script>

<template>
  <p>{{ t("hello") }}, {{ locale }}</p>
  <LocaleSwitch></LocaleSwitch>
</template>
