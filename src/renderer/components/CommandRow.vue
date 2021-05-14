<template>
  <div><input type="text" class="w-full text-gray-900" v-model="name" /></div>
  <div><input type="text" class="w-full text-gray-900" v-model="desc" /></div>
  <div>
    <select v-model="type" class="w-full text-gray-900" @change="typeChanged">
      <option value="response">Chat Response</option>
      <option value="obs">OBS Action</option>
    </select>
  </div>
  <div v-if="type === 'response'">
    <input type="text" class="w-full text-gray-900" v-model="action" />
  </div>
  <div v-else-if="type === 'obs'">
    <select v-model="action.name" class="w-full text-gray-900">
      <option value="toggle_source">Toggle a Source</option>
    </select>
    <input type="text" v-model="action.sourceName" class="w-full text-gray-900" />
  </div>
  <button
    type="button"
    @click="store"
    class="border border-blue-100 rounded-md bg-gray-600 hover:bg-gray-200 hover:text-gray-800"
  >
    <slot name="action">
      Submit
    </slot>
  </button>
</template>

<script>
export default {
  emits: ['store'],
  props: {
    command: {
      type: Object,
      default() {
        return {
          name: '',
          desc: '',
          type: 'response',
          action: '',
        };
      },
    },
    resetAfterStore: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      name: this.command.name,
      desc: this.command.desc,
      type: this.command.type,
      action: this.command.action,
    };
  },
  methods: {
    store() {
      this.$emit('store', { name: this.name, desc: this.desc, type: this.type, action: this.action });
    },
    typeChanged() {
      if (this.type === 'obs') {
        this.action = {};
      }
    },
  },
};
</script>

<style></style>
