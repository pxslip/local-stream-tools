<template>
  <div class="lg:container grid gap-1 grid-cols-6">
    <nav id="nav" class="col-span-1 text-gray-100">
      <router-link class="block" to="/">Home</router-link>
      <router-link class="block" to="/chat">Chat</router-link>
      <router-link class="block" to="/commands">Commands</router-link>
      <router-link class="block" to="/settings">Settings</router-link>
      <router-link class="block" to="/about">About</router-link>
    </nav>
    <main class="col-span-5">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
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
