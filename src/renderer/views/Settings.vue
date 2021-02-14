<template>
  <h1 class="mb-8 text-4xl">Settings</h1>
  <div class="grid grid-cols-1 gap-y-6 border-blue-100 border rounded p-1 m-1">
    <h2 class="text-2xl">Chat Bot</h2>
    <underline-input :value="bot.prefix" type="text" class="block">Command Prefix</underline-input>
    <form-button class="save" type="button" @click="save('bot')">
      Save
    </form-button>
  </div>
  <div class="grid grid-cols-1 gap-y-6 border-blue-100 border rounded p-1 m-1 mt-4">
    <h2>OBS Websockets</h2>
    <underline-input :value="obs.port" type="text" class="block">Port Number</underline-input>
    <underline-input :value="obs.password" type="password" class="block">Password</underline-input>
    <form-button class="save" type="button" @click="save('obs')">
      Save
    </form-button>
  </div>
</template>

<script>
import FormButton from '../components/inputs/FormButton.vue';
import UnderlineInput from '../components/inputs/UnderlineInput.vue';
export default {
  components: { UnderlineInput, FormButton },
  data() {
    return {
      bot: {
        prefix: '!',
      },
      obs: {
        port: 4444,
        password: 'secret',
      },
    };
  },
  async mounted() {
    this.bot = await this.$ipc.invoke('store::get', 'settings.bot', this.bot);
    this.obs = await this.$ipc.invoke('store::get', 'settings.obs', this.obs);
  },
  methods: {
    save(key) {
      this.$ipc.invoke('store::set', this[key]);
    },
  },
};
</script>

<style></style>
