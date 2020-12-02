<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <button type="button" @click="buttonClicked" class="text-white">Click Me</button>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  components: {},
  methods: {
    buttonClicked() {
      this.$ipc.invoke('button-click');
    },
  },
};
</script>