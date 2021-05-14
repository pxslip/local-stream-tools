<template>
  <div class="lg:container grid gap-1 grid-cols-6">
    <left-nav />
    <main class="col-span-5">
      <router-view />
    </main>
  </div>
</template>

<script>
import LeftNav from './components/LeftNav';
export default {
  components: { LeftNav },
  created() {
    let hash = window.location.hash.replace('#', '');
    if (hash) {
      this.$router.replace(hash);
    } else {
      this.$router.replace('/');
    }
  },
};
</script>

<style>
body {
  @apply text-gray-100;
}
</style>
