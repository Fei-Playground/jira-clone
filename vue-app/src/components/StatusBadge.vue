<script setup>
defineProps({
  status: { type: String, default: "open" },
});
</script>

<template>
  <span :class="['badge', `badge--${status}`]">{{ status }}</span>
</template>

<style scoped>
.badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 999px;
}
.badge--open { background: #dbeafe; color: #1d4ed8; }
.badge--done { background: #dcfce7; color: #15803d; }
.badge--blocked { background: #fee2e2; color: #b91c1c; }
</style>
