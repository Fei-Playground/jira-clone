<script setup>
import StatusBadge from "./StatusBadge.vue";

defineProps({
  title: { type: String, default: "Untitled task" },
  assignee: { type: String, default: "Unassigned" },
  status: { type: String, default: "open" },
});
</script>

<template>
  <article class="card">
    <header class="card__head">
      <h3 class="card__title">{{ title }}</h3>
      <StatusBadge :status="status" />
    </header>
    <p class="card__meta">{{ assignee }}</p>
  </article>
</template>

<style scoped>
.card {
  border: 1px solid #e4e4e7;
  border-radius: var(--radius, 10px);
  padding: 14px 16px;
  min-width: 260px;
  background: var(--surface, #fff);
}
.card__head { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.card__title { margin: 0; font-size: 14px; font-weight: 600; }
.card__meta { margin: 8px 0 0; font-size: 12px; color: var(--muted, #6b7280); }
</style>
