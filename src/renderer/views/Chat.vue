<template>
  <input type="text" placeholder="Channel to join" v-model="channel" />
  <button type="button" @click="joinChannel">Join Channel</button>
  <ul>
    <li v-for="message in messages" :key="message.msgId">
      {{ message }}
    </li>
  </ul>
</template>

<script>
import { client } from 'tmi.js';
export default {
  data() {
    return {
      token: null,
      client: null,
      channel: '',
      lastChannel: '',
      messages: [],
    };
  },
  async mounted() {
    if (!this.token) {
      // make sure we have a twitch auth token
      this.token = await this.$ipc.invoke('auth::twitch::get-token');
    }
    if (!this.client) {
      this.client = new client({
        connection: { reconnect: true },
        identity: {
          username: 'localstreamtoolsbot',
          password: this.token.access_token,
        },
      });
      this.client.connect();
      this.client.on('message', this.handleMessage);
    }
  },
  unmounted() {
    this.client = null;
  },
  methods: {
    joinChannel() {
      if (this.lastChannel !== '' && this.lastChannel !== this.channel) {
        this.client.part(this.lastChannel);
        this.lastChannel = this.channel;
      }
      this.client.join(this.channel);
    },
    handleMessage(channel, tags, message, self) {
      console.log(channel, tags, message, self);
      this.messages.push(message);
    },
  },
};
</script>

<style></style>
