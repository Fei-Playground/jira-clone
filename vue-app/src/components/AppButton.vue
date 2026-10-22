<script setup>
defineProps({
  variant: { type: String, default: "primary" },
  disabled: { type: Boolean, default: false },
});
</script>

<template>
  <button :class="['btn', `btn--${variant}`]" :disabled="disabled">
    <slot>Button</slot>
  </button>
</template>

<style scoped>
.btn {
  font: inherit;
  font-weight: 600;
  font-size: 14px;
  padding: 9px 16px;
  border-radius: var(--radius, 10px);
  border: 1px solid transparent;
  cursor: pointer;
}
.btn:disabled { opacity: 0.45; cursor: not-allowed; }
.btn--primary { background: var(--brand, #4950f6); color: #fff; }
.btn--ghost { background: transparent; color: var(--ink, #16161d); border-color: #e4e4e7; }
.btn--danger { background: #dc2626; color: #fff; }
</style>
