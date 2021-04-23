<template>
  <div class="filelist">
    <div class="filelist__header">
      <span class="header-title"> Fichier(s): </span>
      <span class="number-file">
        {{ $store.getters.UPLOAD__FilesLength }} / {{ maxFiles }} fichiers
      </span>
    </div>
    <div class="filelist__body">
      <div
        tabindex="0"
        ref="dropZone"
        class="drop-zone"
        @click="openBrowserFiles"
      >
        <span class="placeholder" v-if="filesIsEmpty">
          Deposer vos fichers ici
          <div>ou cliquez</div>
        </span>
        <span class="file-item" v-for="file in files" :key="file.id">
          <span class="item-name">
            <span class="nametext" @click="openDrawer($event, file.id)">
              {{ file.name }}
            </span>
          </span>
        </span>
      </div>
    </div>
    <div class="filelist__footer">
      <span :class="['files-size', { error: sizeAllFiles > maxSizeFiles }]">
        {{ sizeAllFiles.formatToStringFileSize() }} / 10 Go
      </span>
    </div>
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
      @change="onChageFakeInput"
      multiple
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

import DrawerFileItem from "@/components/common/DawerFileItem.vue";

import { UploadActionTypes } from "@/store/modules/upload/action-types";

export default defineComponent({
  setup() {
    const dropZone = ref<HTMLElement>();
    return {
      dropZone,
    };
  },
  components: {
    DrawerFileItem,
  },
  data() {
    return {
      showDrawer: false,
      selectFileID: "",
      maxSizeFiles: this.$store.state.upload.maxSizeFiles,
    };
  },
  computed: {
    files() {
      return this.$store.state.upload.files;
    },
    maxFiles(): number {
      return this.$store.state.upload.maxFiles;
    },
    sizeAllFiles(): number {
      return this.$store.getters.UPLOAD__GetSizeOfAllFiles;
    },
    filesIsEmpty() {
      return this.$store.state.upload.files.length == 0;
    },
  },
  watch: {
    sizeAllFiles(size: number) {
      console.log(size);
    },
  },
  methods: {
    openBrowserFiles(event: Event) {
      event.stopImmediatePropagation();

      if (this.files.length == this.maxFiles) return;
      (this.$refs.fakeInputFile as HTMLInputElement).click();
    },
    addFiles(files: Array<File> | FileList) {
      if (files.length + this.files.length <= this.maxFiles) {
        for (const file of files) {
          this.$store.dispatch(UploadActionTypes.ADD_FILE, file);
        }
      }
    },
    onChageFakeInput(event: { target: HTMLInputElement }) {
      const files = event.target.files;
      if (files) {
        this.addFiles(files);
      }
      event.target.value = "";
    },
    onDrop(event: DragEvent) {
      event.preventDefault();
      if (
        event.target instanceof HTMLElement &&
        this.dropZone instanceof HTMLElement
      ) {
        if (
          event.target == this.dropZone ||
          this.dropZone.contains(event.target)
        ) {
          if (event.dataTransfer) {
            if (event.dataTransfer.items) {
              const files: Array<File> = [];
              for (const item of event.dataTransfer.items) {
                if (item.kind === "file") {
                  const file = item.getAsFile();
                  if (file) files.push(file);
                }
              }
              this.addFiles(files);
            } else {
              this.addFiles(event.dataTransfer.files);
            }
          }
          this.dropZone.style.borderColor = "";
        }
      }
    },
    onDragOver(event: DragEvent) {
      event.preventDefault();
      if (
        event.target instanceof HTMLElement &&
        this.dropZone instanceof HTMLElement
      ) {
        if (
          event.target == this.dropZone ||
          this.dropZone.contains(event.target)
        ) {
          this.dropZone.style.borderColor = "var(--color-primary)";
        } else {
          this.dropZone.style.borderColor = "";
        }
      }
    },
    openDrawer(event: Event, fileID: string) {
      event.stopImmediatePropagation();
      if (this.selectFileID != fileID) this.selectFileID = fileID;
      this.showDrawer = true;
    },
    closeDrawer() {
      this.showDrawer = false;
    },
  },
  mounted() {
    document.addEventListener("dragover", this.onDragOver);
    document.addEventListener("drop", this.onDrop);
  },
  beforeMount() {
    this.showDrawer = false;
  },
  unmounted() {
    document.removeEventListener("dragover", this.onDragOver);
    document.removeEventListener("drop", this.onDrop);
  },
});
</script>

<style lang="scss" scoped>
@import "../../assets/styles/font-awesome/fontawesome.scss";
@import "../../assets/styles/font-awesome/solid.scss";

.filelist {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  margin-bottom: 0.5rem;
}
.filelist__header {
  display: flex;
  flex-direction: row;
  padding-bottom: 2rem;

  .header-title {
    font-size: 1.6rem;
  }

  .number-file {
    align-self: center;
    margin-left: auto;
    font-size: 1.4rem;
    opacity: 0.6;
  }
}
.filelist__body {
  position: relative;

  border-radius: 2rem;
  height: 100%;
}

.filelist__footer {
  margin-top: 1rem;
  text-align: right;
  .files-size {
    font-size: 1.5rem;
    opacity: 0.6;

    &.error {
      color: var(--color-error);
    }
  }
}

.drop-zone {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow-x: hidden;
  height: 100%;
  border-radius: 2rem;
  padding: 1.5rem 2rem;
  border: 2px solid var(--color-border);
  cursor: pointer;
  outline: none;

  .placeholder {
    width: 70%;
    text-align: center;
    margin: auto;
    color: var(--color-main-text);
    opacity: 0.7;
  }

  &:hover,
  &:focus {
    border-color: var(--color-primary);

    .placeholder {
      color: var(--color-primary-element-light);
      opacity: 1;
    }
  }
}

.file-item {
  margin: 0.2rem 0;
  .item-name {
    max-width: 100%;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-weight: 600;
    cursor: pointer;
    // color: var(--color-primary);
    &:hover {
      color: var(--color-primary-element-light);
    }
  }
}
</style>
