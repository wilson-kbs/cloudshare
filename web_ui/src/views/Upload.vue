<template>
  <div>
    <KSUpload />
    <section class="download-url">
      <span class="title-section-dowwnload-url">Lien vers le partage</span>
      <InputCopy :value="downloadURL" />
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, Suspense } from "vue";
import KSUpload from "@/components/upload/KSUpload.vue";
import InputCopy from "@/components/common/InputCopy.vue";

export default defineComponent({
  name: "Upload",
  components: {
    KSUpload,
    InputCopy,
  },
  data() {
    return {
      downloadURL: "",
    };
  },
  computed: {
    state(): "PENDING" | "SUCCESS" | "ERROR" | undefined {
      return this.$store.state.upload.status;
    },
  },
  watch: {
    state(newVal, _) {
      if (newVal == "SUCCESS") {
        this.downloadURL = `${window.location.origin}/files?u=${this.$store.state.upload.uploadID}`;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
</style>