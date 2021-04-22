<template>
  <teleport to="body">
    <div
      :class="['drawer', { 'drawer-open': preVisible }]"
      style="user-select: text"
    >
      <div class="drawer-wrapper">
        <div class="drawer-mask" @click="$emit('close')"></div>
        <div class="drawer-content">
          <div class="drawer-wrapper-body">
            <div class="drawer-header">
              <span class="drawer-header-title">Détails du fichier</span>
            </div>
            <div class="drawer-body">
              <span class="drawer-body-name-key">Nom:</span>
              <span class="drawer-body-name-value">{{ fileInfo.name }}</span>

              <span class="drawer-body-size-key">Taille:</span>
              <span class="drawer-body-size-value">
                {{ fileInfo.size }}
              </span>
              <span class="drawer-body-type-key">Type:</span>
              <span class="drawer-body-type-value">
                {{ fileInfo.name?.split(".").pop()?.toUpperCase() }}
              </span>
            </div>
            <div class="drawer-action">
              <button
                class="file-item-action-remove"
                v-if="mode == 'upload'"
                @click="removeFile"
              >
                Supprimer
              </button>
              <button class="file-item-action-download" v-else>
                Télécharger
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { UploadMutationTypes } from "@/store/modules/upload/mutation-types";

type FileInfo = {
  id: string;
  name: string;
  size: string;
};

export default defineComponent({
  components: {},
  emits: ["close"],
  setup() {
    return {};
  },
  data() {
    return {
      preVisible: this.visible,
      fileInfo: {} as FileInfo,
      body: document.querySelector("body"),
    };
  },
  computed: {},
  props: {
    fileID: {
      type: String,
      required: true,
    },
    mode: String,
    visible: {
      type: Boolean,
      default: false,
    },
    destroy: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    escapePress(event: KeyboardEvent) {
      if (event.code == "Escape") {
        this.$emit("close");
      }
    },
    removeFile() {
      if (this.mode == "upload") {
        this.$emit("close");
        setTimeout(
          () =>
            this.$store.commit(UploadMutationTypes.REMOVE_FILE, this.fileID),
          100
        );
      }
    },
    updatePreVisible() {
      this.preVisible = this.visible;
    },
    getFileInfo() {
      if (this.mode == "upload") {
        let fileItem = this.$store.state.upload.files.find(
          (item) => item.id == this.fileID
        );
        if (fileItem)
          this.fileInfo = {
            id: fileItem.id,
            name: fileItem.name,
            size: fileItem.size.formatToStringFileSize(),
          };
      } else {
        let fileItem = this.$store.state.download.files.find(
          (item) => item.id == this.fileID
        );
        if (fileItem)
          this.fileInfo = {
            id: fileItem.id,
            name: fileItem.name,
            size: fileItem.size.formatToStringFileSize(),
          };
      }
    },
  },
  watch: {
    fileID() {
      this.getFileInfo();
    },
    async visible(newVal: boolean) {
      if (newVal) {
        window.addEventListener("keyup", this.escapePress);
        this.body!.style.overflow = "hidden";
        this.body!.style.userSelect = "none";
      } else {
        window.removeEventListener("keyup", this.escapePress);
        this.body!.style.overflow = "";
        this.body!.style.userSelect = "";
      }
      this.updatePreVisible();
    },
  },
});
</script>

<style lang="scss">
.drawer {
  position: fixed;
  z-index: 1000;
  width: 100%;
  height: 0;
  bottom: 0;
  transition: height 0s linear 0.3s;
}
.drawer-wrapper {
  position: relative;
  height: 100%;
}

.drawer-open {
  height: 100%;
  transition: none;
  .drawer-mask {
    opacity: 0.5;
  }
  .drawer-content {
    transform: translateY(0);
  }
}

.drawer-mask {
  height: 100%;
  width: 100%;
  opacity: 0;
  background-color: #000;
  transition: opacity 0.2s linear;
}

.drawer-content {
  position: absolute;
  bottom: 0;
  width: 100%;
  transition: transform 0.2s linear;
  transform: translateY(100%);
}

.drawer-wrapper-body {
  height: 100%;
  width: 100%;
  position: relative;
  margin: auto;
  background-color: var(--color-main-background);
  border-top-left-radius: 2rem;
  border-top-right-radius: 2rem;
}

.drawer-header {
  padding: 16px 24px;
  border-bottom: 0.1rem solid var(--color-border);

  &-title {
    font-weight: bold;
    font-size: 20px;
  }
}
.drawer-body {
  position: relative;
  display: grid;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  grid-template-columns: minmax(65px, auto) 1fr;
  grid-auto-rows: minmax(30px, auto);
  padding: 15px 24px;

  & &-name {
    &-key {
      grid-column: 1;
      grid-row: 1;
    }
    &-value {
      grid-column: 2;
      grid-row: 1;
    }
  }

  & &-size {
    &-key {
      grid-column: 1;
      grid-row: 2;
    }
    &-value {
      grid-column: 2;
      grid-row: 2;
    }
  }
  & [class$="-key"] {
    color: var(--color-text-lighter);
    text-align: right;
    box-sizing: border-box;
    padding-right: 10px;
    font-weight: bold;
  }
  & [class$="-value"] {
    overflow: hidden;
    overflow-wrap: break-word;
    //position: relative;
  }
}
.drawer-action {
  padding: 16px 24px;
  & > * {
    width: 100%;
    padding: 10px 20px;
    text-align: center;
    border-radius: 20px;
    font-size: 16px;
    font-weight: bold;
    font-family: "Open Sans", sans-serif;
    cursor: pointer;
    outline: none;
    background-color: var(--color-main-background);
  }
  & .file-item-action-remove {
    color: #dc3545;
    border: 2.5px solid #dc3545;

    &:hover,
    &:focus {
      color: white;
      background-color: #dc3545;
    }
    &:focus {
      box-shadow: 0 0 7px #ba2c3a;
    }
  }
  & .file-item-action-download {
    color: var(--color-primary);
    border: 2.5px solid var(--color-primary);

    &:hover,
    &:focus {
      color: white;
      background-color: var(--color-primary);
    }
    &:focus {
      box-shadow: 0 0 7px #ba2c3a;
    }
  }
}
</style>