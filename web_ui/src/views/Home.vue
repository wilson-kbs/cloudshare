<template>
  <div>
    <KSUpload />
  </div>
</template>

<script lang="ts">
import { defineComponent, Suspense } from "vue";
import KSUpload from "@/components/upload/KSUpload.vue";

export default defineComponent({
  name: "Home",
  components: {
    KSUpload,
  },
});
</script>

<style lang="scss" scoped>
</style>
