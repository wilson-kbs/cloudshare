<template>
  <div>
    <transition name="fade-slow" mode="out-in">
      <KSUpload v-if="!complete" @complete="complete = true" />
      <section class="download-url" v-else>
        <span class="title-section-dowwnload-url">Lien vers le partage</span>
        <InputCopy :value="downloadURL" />
      </section>
    </transition>
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
      complete: false,
    };
  },
  computed: {},
  watch: {
    complete(value) {
      if (value)
        this.downloadURL = `${window.location.origin}/files?u=${this.$store.state.upload.uploadID}`;
    },
  },
});
</script>

<style lang="scss" scoped>
.fade-slow-enter-active,
.fade-slow-leave-active {
  transition: all 1s ease;
}

.fade-slow-enter-from,
.fade-slow-leave-to {
  opacity: 0;
}
</style>