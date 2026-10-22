<script setup>
defineProps({
  message: { type: String, default: "Nothing here yet." },
});
</script>

<template>
  <div class="empty">
    <p>{{ message }}</p>
    <slot />
  </div>
</template>

<style scoped>
.empty {
  border: 1px dashed #d4d4d8;
  border-radius: var(--radius, 10px);
  padding: 28px;
  text-align: center;
  color: var(--muted, #6b7280);
  font-size: 13px;
}
</style>
