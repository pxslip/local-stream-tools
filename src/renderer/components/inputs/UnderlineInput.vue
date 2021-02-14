<template>
  <label :class="$attrs.class">
    <slot></slot>
    <input :type="type" class="underline" :value="value" @input="$emit('update:value', $event.target.value)" />
  </label>
</template>

<script>
export default {
  props: {
    value: [String, Number],
    type: String,
  },
  emits: ['update:value'],
};
</script>

<style lang="postcss">
input.underline {
  @apply bg-transparent block border-0 border-b-2 border-gray-400 focus:border-gray-200 focus:ring-0 w-full;
}
</style>
