<template>
  <div class="ks-download">
    <div class="ks-download__header">
      <span class="title">Fichiers</span>
      <button
        class="download-action"
        title="Télécharger tout"
        @click="downloadAllFiles"
      ></button>
    </div>
    <div class="ks-download__body">
      <KSFilesTable />
    </div>
  </div>
</template>

<script lang="ts">
import { DownloadActionTypes } from "@/store/modules/download/action-types";
import { defineComponent } from "vue";

import KSFilesTable from "./KSFilesTable.vue";

export default defineComponent({
  components: {
    KSFilesTable,
  },
  methods: {
    downloadAllFiles() {
      this.$store.dispatch(DownloadActionTypes.GET_FILES);
    },
  },
});
</script>

<style lang="scss" scoped>
@import "../../assets/styles/font-awesome/fontawesome.scss";
@import "../../assets/styles/font-awesome/solid.scss";
@import "../../assets/styles/font-awesome/regular.scss";

.ks-download {
  margin: auto;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-width: 1200px;
}

.ks-download__header {
  position: relative;
  padding: 1rem 1.5rem;
  border-bottom: 0.2rem solid var(--color-border);

  box-shadow: 1px 0 5px var(--color-box-shadow);

  [dark]:root & {
    box-shadow: none;
  }

  & > .title {
    white-space: nowrap;
    font-size: 1.8rem;
    font-weight: 600;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}

.ks-download__body {
  align-self: center;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}

.footer-view {
  height: 5rem;
  border-top: 0.1rem solid black;
}

.download-action {
  @extend %fa-icon;

  position: absolute;
  height: 3rem;
  width: 3rem;
  color: var(--color-text-lighter);
  background-color: inherit;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);

  border: 0.1rem solid transparent;
  border-radius: 0.5rem;
  outline: none;
  cursor: pointer;

  &::after {
    @extend .fas;
    font-size: 1.7rem;
    content: fa-content($fa-var-download);
  }

  &:hover,
  &:focus {
    box-shadow: 0 0 7px var(--color-box-shadow);
  }
  &:active {
    box-shadow: inset 0 0 7px #a9a9a9;
    &::after {
      font-size: 15px;
    }
  }

  [dark]:root & {
    box-shadow: none;

    &:hover,
    &:focus {
      border-color: var(--color-border);
    }
    &:active {
      box-shadow: inset 0 0 4px var(--color-box-shadow);
    }
  }
}

@media screen and (min-width: 1200px) {
  .ks-download__header {
    border-right: 0.1rem solid var(--color-border);
    border-left: 0.1rem solid var(--color-border);
  }
  .ks-download__body {
    border-left: 1px solid var(--color-border);
    border-right: 1px solid var(--color-border);
  }
}
</style>
