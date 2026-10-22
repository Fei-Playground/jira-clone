<script setup>
import AppButton from "./components/AppButton.vue";
import EmptyState from "./components/EmptyState.vue";
import TaskCard from "./components/TaskCard.vue";
</script>

<template>
  <main class="page">
    <h1>Board</h1>
    <div class="row">
      <TaskCard title="Ship the design system" assignee="Utkarsh" status="open" />
      <TaskCard title="Wire the serve route" assignee="Utkarsh" status="done" />
    </div>
    <div class="row">
      <AppButton variant="primary">New task</AppButton>
      <AppButton variant="ghost">Filter</AppButton>
    </div>
    <EmptyState message="No archived tasks." />
  </main>
</template>

<style scoped>
.page { max-width: 760px; margin: 0 auto; padding: 32px 20px; }
h1 { font-size: 20px; }
.row { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 20px; }
</style>
