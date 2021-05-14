<template>
  <h1>Chat Commands</h1>
  <div class="grid grid-cols-5 gap-x-2 gap-y-4">
    <div>Command</div>
    <div>Description</div>
    <div>Type</div>
    <div>Action</div>
    <div></div>
    <template v-for="(command, index) in commands" :key="`chat_command_${index}`">
      <command-row :command="command" @store="storeCommand($event, index)">
        <template v-slot:action>
          Update
        </template>
      </command-row>
    </template>
    <command-row @store="storeCommand($event)" :resetAfterStore="true">
      <template v-slot:action>
        Add
      </template>
    </command-row>
  </div>
</template>

<script>
import CommandRow from '../components/CommandRow.vue';
export default {
  components: { CommandRow },
  data() {
    return {
      commands: [],
      prefix: '',
    };
  },
  async mounted() {
    this.commands = await this.$ipc.invoke('store::get', 'commands', []);
    this.prefix = await this.$ipc.invoke('store::get', 'prefix', '!');
  },
  methods: {
    /**
     * Store a new command/update an existing one
     *
     * @param {Object} command the new command data to store/update
     * @param {Object|null} index the index of the command if we are updating a command
     */
    storeCommand(command, index = null) {
      if (index === null) {
        this.commands.push(command);
        this.$ipc.invoke('store::set-array-push', 'commands', command);
      } else {
        this.commands[index] = command;
        this.$ipc.invoke('store::set-array-by-index', 'commands', index, command);
      }
    },
  },
};
</script>

<style></style>
