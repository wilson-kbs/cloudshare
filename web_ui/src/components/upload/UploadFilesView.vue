<template>
  <div ref="containerView" class="upload-files-view">
    <transition name="fade">
      <div class="upload-file-view-header" v-if="!$store.getters.uploadState">
        <Popup :placement="'bottom'">
          <template v-slot:content>Ceci est le Test1 !</template>
          <span class="header-title" @click="testIF = !testIF">
            Fichier(s):
          </span>
        </Popup>
        <Popup :duration="3000" v-model="testIF" trigger="none">
          <template v-slot:content>Ceci est le Test2 !</template>
          <span class="number-file" ref="toto" pont-at-center>
            {{ $store.getters.uplaodFilesLength }} /
            {{ maxNumFileUpload }} fichiers
          </span>
        </Popup>
      </div>
    </transition>
    <div ref="bodyView" class="upload-file-view-body">
      <UploadFileItem
        v-for="file in files"
        :key="file.localID"
        :fileInfo="file"
        @click="
          openDrawer(file.localID);
          $event.preventDefault();
        "
      />
    </div>
    <transition name="fade">
      <button
        class="add-files-wrapper"
        @click="openBrowserFiles"
        v-if="
          $store.getters.uplaodFilesLength < maxNumFileUpload &&
          !$store.getters.uploadState
        "
      >
        <span class="add-file-content"></span>
      </button>
    </transition>
    <DrawerFileItem
      :visible="showDrawer"
      :fileID="selectFileID"
      mode="upload"
      @close="closeDrawer"
    />
    <input
      type="file"
      class="fake-input-file"
      style="display: none"
      ref="fakeInputFile"
      @change="addFiles"
      multiple
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

import UploadFileItem from "./UploadFileItem.vue";
import DrawerFileItem from "@/components/common/DawerFileItem.vue";

import { UploadActionTypes } from "@/store/modules/upload/action-types";

import anime from "animejs";
import Popup from "@/components/common/Popup";
import { ProcessState } from "@/@types";

export default defineComponent({
  setup() {
    const containerView = ref<HTMLElement>();
    const bodyView = ref<HTMLElement>();
    return { bodyView, containerView };
  },
  components: {
    UploadFileItem,
    DrawerFileItem,
    Popup,
  },
  data() {
    return {
      showDrawer: false,
      maxNumFileUpload: 5,
      selectFileID: "",
      testIF: false,
    };
  },
  computed: {
    files() {
      return this.$store.state.upload.files;
    },
    uploadState() {
      return this.$store.getters.uploadState;
    },
  },
  watch: {
    uploadState(newVal?: ProcessState) {
      if (newVal == "PENDING") {
        if (
          this.containerView instanceof HTMLElement &&
          this.bodyView instanceof HTMLElement
        ) {
          const containerView = this.containerView.getBoundingClientRect();
          this.containerView.style.height = `${containerView.height}px`;
          const bodyPos = this.bodyView.getBoundingClientRect();
          const screen = {
            height: window.innerHeight,
            width: window.innerWidth,
          };
          const newPosY = (bodyPos.top * 100) / screen.height;
          const newPosX = (bodyPos.left * 100) / screen.width;

          this.bodyView.style.width = `${bodyPos.width}px`;
          this.bodyView.style.top = `${newPosY}%`;
          this.bodyView.style.left = `${newPosX}%`;
          anime({
            targets: this.bodyView,
            top: "50%",
            left: "50%",
            translateX: "-50%",
            translateY: "-50%",
            easing: "linear",
            duration: 500,
            delay: 200,
            complete: () => {
              this.$nextTick(() =>
                this.$store.dispatch(UploadActionTypes.START_UPLOAD)
              );
            },
          });
        }
      } else if (newVal == "SUCCESS") {
        setTimeout(() => this.$emit("complete"), 500);
      }
    },
  },
  methods: {
    openBrowserFiles(e: Event) {
      (this.$refs.fakeInputFile as HTMLInputElement).click();
      e.preventDefault();
    },
    addFiles(e: { target: HTMLInputElement }) {
      if (e.target.files) {
        if (
          e.target.files.length + this.files.length <=
          this.maxNumFileUpload
        ) {
          let files: File[] = [];
          for (const file of e.target.files) {
            files.push(file);
          }
          this.$store.dispatch(UploadActionTypes.ADD_FILES, files);
        }
      }
      e.target.value = "";
    },
    openDrawer(fileID: string) {
      if (this.selectFileID != fileID) this.selectFileID = fileID;
      this.showDrawer = true;
    },
    closeDrawer() {
      this.showDrawer = false;
    },
  },
});
</script>

<style lang="scss" scoped>
@import "../../assets/styles/font-awesome/fontawesome.scss";
@import "../../assets/styles/font-awesome/solid.scss";

.upload-files-view {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  margin-bottom: 20px;

  .header-title {
    font-size: 1.9rerm;
  }
}
.upload-file-view-header {
  display: flex;
  flex-direction: row;
  padding-bottom: 2rem;
  .number-file {
    align-self: center;
    margin-left: auto;
    font-size: 1.4rem;
    opacity: 0.6;
  }
}
.upload-file-view-body {
  position: fixed;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow-x: hidden;

  .upload-card:not(.pendind, .success) & {
    position: relative;
  }
}

.add-files-wrapper {
  position: relative;
  align-self: center;
  border: none;
  appearance: none;
  padding: 0;
  margin: 0;
  height: 24px;
  width: 24px;
  margin-top: 20px;
  margin: auto;
  align-self: center;
  text-align: center;
  border-radius: 20px;
  background-color: var(--color-primary);
  box-sizing: border-box;
  outline: 0;
  cursor: pointer;
  opacity: 0.8;
  transition: all 0.1s linear;

  &:hover,
  &:focus {
    opacity: 1;
  }

  &:focus {
    box-shadow: 0 0 5px var(--color-primary);
  }

  & .add-file-content {
    @extend %fa-icon;
    @extend .fas;

    position: absolute;

    align-self: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: var(--color-primary-text);

    &:after {
      // font-size: 14px;
      content: fa-content($fa-var-plus);
    }
  }
}
</style>
