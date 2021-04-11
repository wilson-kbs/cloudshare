<template>
  <div>
    <Error :errorCode="404" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Error from "@/components/common/Error.vue";

export default defineComponent({
  components: {
    Error,
  },
});
</script>

<style scoped>
</style>