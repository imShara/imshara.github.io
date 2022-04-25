<script setup lang="ts">
const router = useRouter();
const route = useRoute();

function dateDiff(dateStringA: string, dateStringB: string) {
  return new Date(dateStringB).getTime() - new Date(dateStringA).getTime();
}

let news = router
  .getRoutes()
  .filter((route) => route.path.startsWith("/news/") && route.meta.frontmatter);

news = news.sort((a, b) => dateDiff(a.meta.frontmatter.date, b.meta.frontmatter.date));
</script>

<template>
  <p>list news</p>
  <ul>
    <li v-for="post in news">
      <router-link :to="post.path">
        {{ post.meta.frontmatter.date }} — {{ post.meta.frontmatter.title }}
      </router-link>
    </li>
  </ul>
</template>
