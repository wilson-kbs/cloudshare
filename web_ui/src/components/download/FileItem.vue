<template>
  <button class="file-item">
    <span class="item-name">{{ file.name }}</span>
    <span class="item-icon"></span>
  </button>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import type { MetaFile } from "@/@types";

export default defineComponent({
  components: {},
  setup(props) {
    return {};
  },
  props: {
    file: {
      type: Object as PropType<MetaFile>,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
@import "../../assets/styles/font-awesome/fontawesome.scss";
@import "../../assets/styles/font-awesome/solid.scss";
@import "../../assets/styles/font-awesome/regular.scss";
.file-item {
  // appearance: nano;
  border: none;

  & {
    position: relative;
    display: flex;
    width: 100%;
    background-color: white;
  }
}
.item-name {
  position: relative;
  display: inline-block;
  max-width: 100%;
  padding: 5px;
  padding-left: 40px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  box-sizing: border-box;
}
.item-icon {
  @extend %fa-icon;

  position: absolute;
  left: 15px;
  top: 50%;
  font-size: 16px;
  transform: translateY(-50%);

  &:after {
    @extend .far;
    content: fa-content($fa-var-file);
  }
}
</style>