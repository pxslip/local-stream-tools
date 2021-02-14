<template>
  <button :type="action" :class="$attrs.class" @click="$emit('click')">
    <slot></slot>
  </button>
</template>

<script>
export default {
  emits: ['click'],
  props: {
    action: String,
  },
};
</script>

<style lang="postcss">
.save {
  @apply border-green-900 bg-green-800 border rounded p-2 hover:bg-green-200 hover:text-gray-900;
}

.delete {
  @apply border-red-900 bg-red-800 border rounded p-2 hover:bg-red-200 hover:text-gray-900;
}

.cancel {
  @apply border-yellow-300 bg-yellow-300 border rounded p-2 hover:bg-yellow-500 text-gray-900;
}
</style>
