<template>
  <div>
    <UploadCard />
  </div>
</template>

<script lang="ts">
import { defineComponent, Suspense } from "vue";
import UploadCard from "@/components/upload/UploadCard.vue";

export default defineComponent({
  name: "Home",
  components: {
    UploadCard,
  },
});
</script>

<style lang="scss" scoped>
</style>
