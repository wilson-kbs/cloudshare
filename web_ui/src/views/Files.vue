<template>
  <div>
    <Loader v-if="showLoader" />
    <div v-else-if="success" class="files-page">
      <DownloadCard />
    </div>
    <Auth v-else-if="showAuth" @success="authSuccess" />
    <Error v-else :errorCode="fetchStatueCode" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useStore } from "@/store";
import { useRoute } from "vue-router";

import { DownloadActionTypes } from "@/store/modules/download/action-types";
import { DownloadMutationTypes } from "@/store/modules/download/mutation-types";

import DownloadCard from "@/components/download/DownloadCard.vue";
import Loader from "@/components/common/Loader.vue";
import Error from "@/components/common/Error.vue";
import Auth from "@/components/AuthView.vue";

import { ProcessState } from "@/_utils";

export default defineComponent({
  name: "Files",
  components: {
    DownloadCard,
    Loader,
    Error,
    Auth,
  },
  setup() {
    const store = useStore();
    const route = useRoute();

    // Get upload ID on url params
    if (typeof route.query.u == "string")
      store.commit(DownloadMutationTypes.UPLOAD_ID, route.query.u);

    // Get File ID if register on url params
    let fileID: string | undefined;
    if (typeof route.query.f == "string") fileID = route.query.f;

    function fetchMetadata() {
      store.dispatch(DownloadActionTypes.FETCH_METADADTA, fileID);
    }

    fetchMetadata();

    return { fetchMetadata };
  },
  data() {
    return {
      showLoader: true,
      showAuth: false,
      success: false,
    };
  },
  computed: {
    fetchStatueCode(): number {
      return this.$store.state.download.fetch.code;
    },
    fetchState(): ProcessState {
      return this.$store.state.download.fetch.state;
    },
    authRequired(): boolean {
      return this.$store.state.download.auth.required;
    },
  },
  watch: {
    "fetchState.value"() {
      this.updateView();
    },
  },
  methods: {
    authSuccess() {
      this.showAuth = false;
      this.showLoader = true;
      this.fetchMetadata();
    },
    updateView() {
      if (this.fetchState.isFinish) {
        this.showLoader = false;
        this.success = true;
      } else if (this.fetchState.isRunning) {
        this.showLoader = true;
      } else if (this.fetchState.isError && this.authRequired) {
        this.showLoader = false;
        this.showAuth = true;
      } else if (this.fetchState.isError) {
        this.showLoader = false;
        this.showAuth = false;
        this.success = false;
      } else {
        this.showLoader = true;
      }
    },
  },
  mounted() {
    this.updateView();
  },
});
</script>

<style lang="scss" scoped>
.files-page {
  height: 100%;
  width: 100%;
  border-top: 0.2rem solid var(--color-border);
}
</style>
