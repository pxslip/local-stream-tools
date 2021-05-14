<template>
  <underline-input v-model="channel" type="text">Channel</underline-input>
  <button type="button" @click="joinChannel">Join Channel</button>
  <ul>
    <li v-for="message in messages" :key="message.msgId">
      {{ message }}
    </li>
  </ul>
</template>

<script>
import UnderlineInput from '../components/inputs/UnderlineInput.vue';
export default {
  components: { UnderlineInput },
  data() {
    return {
      channel: '',
      lastChannel: '',
      messages: [],
      commands: null,
      /**
       * @type {Map<string, MessagePort>}
       */
      msgChannels: new Map(),
    };
  },
  methods: {
    joinChannel() {
      const { port1, port2 } = new MessageChannel();
      this.$ipc.postMessage('chat::join-channel', { channel: this.channel }, [port1]);
      this.msgChannels.set(this.channel, port2);
      port2.onmessage = this.handleMessage;
    },
    /**
     * @param {*} channel
     * @param {*} tags
     * @param {String} message
     */
    handleMessage(event) {
      console.log(event);
      const { message } = event.data;
      this.messages.push(message);
    },
  },
};
</script>

<style></style>
