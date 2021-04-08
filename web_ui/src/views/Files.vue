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

import { ProcessState } from "@/@types";

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
      store.commit(DownloadMutationTypes.DOWNLOAD__UPLOAD_ID, route.query.u);

    // Get File ID if register on url params
    let fileID: string | undefined;
    if (typeof route.query.f == "string") fileID = route.query.f;

    function fetchMetadata() {
      store.dispatch(DownloadActionTypes.FETCH_UPLOAD, fileID);
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
      return this.$store.state.download.statueSharing.statueCode ?? 0;
    },
    fetcherState(): ProcessState | undefined {
      return this.$store.state.download.statueSharing.state;
    },
    authRequired(): boolean {
      return this.$store.state.download.statueSharing.auth.required;
    },
  },
  watch: {
    fetcherState() {
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
      if (this.fetcherState == "SUCCESS") {
        this.showLoader = false;
        this.success = true;
      } else if (this.fetcherState == "PENDING") {
        this.showLoader = true;
      } else if (this.fetcherState == "ERROR" && this.authRequired) {
        this.showLoader = false;
        this.showAuth = true;
      } else if (this.fetcherState == "ERROR") {
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
