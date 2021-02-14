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
export default {
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
      const currentChannel = this.channel;
      const { port1, port2 } = new MessageChannel();
      this.$ipc.postMessage('chat::join-channel', { channel: this.channel }, [port1]);
      this.msgChannels.set(channel, port2);
      port2.addEventListener('message', event => {
        console.log(event);
        // this.handleMessage(currentChannel)
      });
    },
    /**
     * @param {*} channel
     * @param {*} tags
     * @param {String} message
     */
    handleMessage(channel, tags, message, self) {
      console.log(channel, tags, message, self);
      this.messages.push(message);
      // TODO: fix the prefix default
      if (message.startsWith('!')) {
        const commandName = message.split(' ')[0].replace('!', '');
        const command = this.commands.find(value => {
          return value.name === commandName;
        });
        if (command) {
          this.client.say(channel, command.action);
        }
      }
    },
  },
};
</script>

<style></style>
