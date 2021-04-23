<template>
  <div>
    <Loader v-if="showLoaderView" />
    <div v-else-if="showDownloadView" class="files-page">
      <KSDownload />
    </div>
    <Auth v-else-if="showAuthView" @success="authSucccess" />
    <Error v-else-if="showErrorView" :errorCode="fetchStatueCode" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useStore } from "@/store";
import { useRoute } from "vue-router";

import { DownloadActionTypes } from "@/store/modules/download/action-types";
import { DownloadMutationTypes } from "@/store/modules/download/mutation-types";

import KSDownload from "@/components/download/KSDownload.vue";
import Loader from "@/components/common/Loader.vue";
import Error from "@/components/common/Error.vue";
import Auth from "@/components/AuthView.vue";

import { ProcessState } from "@/_utils";

export default defineComponent({
  name: "Files",
  components: {
    KSDownload,
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

    // Get if sharing required auth
    store.dispatch(DownloadActionTypes.AUTH_IS_REQUIRED);

    // Get File ID if register on url params
    let fileID: string | undefined;
    if (typeof route.query.f == "string") fileID = route.query.f;

    // Get Mode of Request
    let mode: string | undefined;
    if (typeof route.query.mode == "string") {
      mode = route.query.mode;
      store.commit(
        DownloadMutationTypes.DIRECT_DOWNLOAD_MODE,
        mode == "download"
      );
    }
    const isModeDownloadDirect = mode == "download";

    const fetchMetadata = () => {
      store.dispatch(DownloadActionTypes.FETCH_METADADTA, fileID);
    };

    const fetchMetaOrDownload = () => {
      if (!isModeDownloadDirect) fetchMetadata();
      else store.dispatch(DownloadActionTypes.GET_FILES, [fileID]);
    };

    return {
      isModeDownloadDirect,
      fetchMetaOrDownload,
    };
  },
  data() {
    return {
      showAuthView: false,
      showErrorView: false,
      showLoaderView: false,
      showDownloadView: false,
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
    authState(): ProcessState {
      return this.$store.state.download.auth.state;
    },
  },
  watch: {
    "fetchState.value"() {
      this.updateLocalState();
    },
  },
  methods: {
    authSucccess() {
      if (this.isModeDownloadDirect) this.setNoView();
      this.fetchMetaOrDownload();
    },
    updateLocalState() {
      if (this.fetchState.isRunning) this.setLoaderView();
      else if (
        this.authRequired &&
        (this.authState.isCreated || this.fetchState.isError)
      )
        this.setAuthView();
      else if (this.fetchState.isError) this.setErrorView();
      else if (this.fetchState.isReady) this.fetchMetaOrDownload();
      else if (this.fetchState.isFinish && !this.isModeDownloadDirect)
        this.setDownloadView();
      else if (this.fetchState.isFinish && this.isModeDownloadDirect)
        this.setNoView();
      else this.setNoView();
    },
    setNoView() {
      this.showAuthView = false;
      this.showErrorView = false;
      this.showLoaderView = false;
      this.showDownloadView = false;
    },
    setLoaderView() {
      this.setNoView();
      this.showLoaderView = true;
    },
    setAuthView() {
      this.setNoView();
      this.showAuthView = true;
    },
    setDownloadView() {
      this.setNoView();
      this.showDownloadView = true;
    },
    setErrorView() {
      this.setNoView();
      this.showErrorView = true;
    },
  },
  mounted() {
    this.updateLocalState();
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
