<template>
  <div><input type="text" class="w-full" v-model="name" /></div>
  <div><input type="text" class="w-full" v-model="desc" /></div>
  <div>
    <select v-model="type" class="w-full">
      <option value="response">Chat Response</option>
      <option value="obs">OBS Action</option>
    </select>
  </div>
  <div><input type="text" class="w-full" v-model="action" /></div>
  <button type="button" @click="store">
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
          type: '',
          action: '',
        };
      },
    },
    resetAfterStore: {
      type: Boolean,
      default: false,
    }
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
      this.$emit('store', {name: this.name, desc: this.desc, type: this.type, action: this.action});
    }
  }
};
</script>

<style></style>
