<template>
  <div
    tabindex="0"
    ref="dropZone"
    class="drop-zone"
    @click="openBrowserFiles"
    @keyup.enter="openBrowserFiles"
    @keyup.space="openBrowserFiles"
    @blur="onBlurDropZone"
  >
    <span class="placeholder" v-if="files.length == 0">
      Deposer vos fichers ici
      <div>ou cliquez</div>
    </span>
    <div class="filelist">
      <span
        class="file-item"
        v-for="(file, i) in files"
        :key="file.id"
        :ref="
          (el) => {
            filesItem[i] = el;
          }
        "
        :data-id="file.id"
      >
        <span class="item-name">
          <span class="nametext" @click="openDrawer($event, file.id)">
            {{ file.name }}
          </span>
        </span>
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
    const filesItem = ref<HTMLElement[]>([]);
    return {
      dropZone,
      filesItem,
    };
  },
  components: {
    DrawerFileItem,
  },
  data() {
    return {
      showDrawer: false,
      selectFileID: "",
      filesRef: [] as Array<HTMLElement>,
    };
  },
  computed: {
    files() {
      return this.$store.state.upload.files;
    },
  },
  methods: {
    openBrowserFiles(event: Event) {
      event.stopImmediatePropagation();
      (this.$refs.fakeInputFile as HTMLInputElement).click();
    },
    addFiles(files: Array<File> | FileList) {
      for (const file of files) {
        this.$store.dispatch(UploadActionTypes.ADD_FILE, file);
      }
    },
    addFile(file: File) {
      this.$store.dispatch(UploadActionTypes.ADD_FILE, file);
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
            let scanFiles = (item: any) => {
              if (item.isDirectory) {
                item.createReader().readEntries((entries: any) => {
                  entries.forEach(scanFiles);
                });
              } else {
                item.file(this.addFile);
              }
            };

            for (const item of event.dataTransfer.items) {
              const data = item.webkitGetAsEntry();
              scanFiles(data);
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
    onBlurDropZone() {
      if (!this.showDrawer) this.removeAllHighLight();
    },
    addHightLight(fileID: string) {
      this.filesItem.forEach((item) => {
        if (item.getAttribute("data-id") == fileID) {
          item.classList.add("highlight");
        }
      });
    },
    removeAllHighLight() {
      this.filesItem.forEach((item) => {
        if (item.classList.contains("highlight")) {
          item.classList.remove("highlight");
        }
      });
    },
    openDrawer(event: Event, fileID: string) {
      event.stopImmediatePropagation();
      this.removeAllHighLight();
      if (this.selectFileID != fileID) this.selectFileID = fileID;
      this.showDrawer = true;
      this.addHightLight(fileID);
    },
    closeDrawer() {
      this.showDrawer = false;
      this.dropZone?.focus();
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
.drop-zone {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;
  max-height: 200px;
  border-radius: 2rem;
  padding: 1rem 0;
  border: 2px solid var(--color-border);
  cursor: pointer;
  outline: none;

  .filelist {
    display: flex;
    flex-direction: column;
    padding: 0 2rem;
    overflow-x: hidden;
    overflow-y: visible;

    &::-webkit-scrollbar {
      width: 5px; /* width of the entire scrollbar */
    }

    &::-webkit-scrollbar-track {
      background: transparent; /* color of the tracking area */
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgb(112, 112, 112);
      border-radius: 50px;
    }
  }

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

    .filelist {
      &::-webkit-scrollbar-thumb {
        background-color: var(--color-primary);
      }
    }

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
.highlight {
  color: var(--color-primary-element-light);
}
</style>
