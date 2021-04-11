<template>
  <button
    :class="[
      'upload-file-item-wrapper',
      { success: fileInfo.finish },
      { pending: fileInfo.pending },
      { error: fileInfo.error },
    ]"
  >
    <div
      v-if="fileInfo.pending"
      class="upload-progress"
      :style="{ width: progress.toFixed() + '%' }"
    ></div>
    <span class="upload-file-item-content" @click="openDrawer">
      <span class="file-name" :title="fileInfo.name">
        {{ fileInfo.name }}
      </span>
      <span class="file-icon">
        <span v-if="fileInfo.pending" class="progress-status">{{
          progress.toFixed()
        }}</span>
      </span>
    </span>
    <DrawerFileItem
      v-if="showDrawer"
      :fileID="fileInfo.localID"
      mode="upload"
      @close="closeDawer"
    />
  </button>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import DrawerFileItem from "@/components/common/DawerFileItem.vue";

import { UploadFileItem } from "@/@types";

export default defineComponent({
  components: {
    DrawerFileItem,
  },
  setup() {
    return {};
  },
  props: {
    fileInfo: {
      type: Object as PropType<UploadFileItem>,
      required: true,
    },
  },
  data() {
    return {
      showDrawer: false,
    };
  },
  computed: {
    progress(): number {
      return this.fileInfo.progress;
    },
  },
  methods: {
    openDrawer() {
      this.showDrawer = true;
    },
    closeDawer() {
      this.showDrawer = false;
    },
  },
});
</script>

<style lang="scss" scoped>
@import "../../assets/styles/font-awesome/fontawesome.scss";
@import "../../assets/styles/font-awesome/solid.scss";
@import "../../assets/styles/font-awesome/regular.scss";

.upload-file-item-wrapper {
  appearance: none;
  background-color: white;
  outline: none;
  border: none;
  text-align: inherit;

  position: relative;
  display: flex;
  width: 100%;
  overflow: hidden;

  border-radius: 10px;
  cursor: initial;
  color: rgba(0, 0, 0, 0.72);

  &:not(.success, .pending, .error) {
    &:focus,
    .upload-file-item-content:hover {
      & > * {
        color: #1967d2;
      }
    }
  }
  &.success > * {
    color: #00c500;
  }
  &.error > * {
    color: #dc3434;
  }
}

.upload-file-item-content {
  display: flex;
  max-width: 100%;
  cursor: pointer;
}

.file-name {
  position: relative;
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  padding: 5px 15px;
  padding-left: 40px;
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.file-icon {
  @extend %fa-icon;

  position: absolute;
  left: 15px;
  top: 50%;
  font-size: 16px;
  transform: translateY(-50%);

  .upload-file-item-wrapper:not(.success, .pending, .error) &:after {
    @extend .far;
    content: fa-content($fa-var-file);
  }
  .upload-file-item-wrapper.success:not(.pending, .error) &:after {
    @extend .fas;
    content: fa-content($fa-var-check);
  }
}

.upload-progress {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background-color: rgba(67, 147, 250, 0.5);
  transition: width 0.3s linear;
}

.progress-status {
  font-size: 14px;
  font-weight: 600;
}
</style>