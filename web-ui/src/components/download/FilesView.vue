<template>
  <table id="filestable">
    <thead>
      <tr>
        <th
          v-for="(item, index) in headerCol"
          :key="index"
          :class="[`header-${item.col}`, 'sort']"
          @click="sortFileBy(item.col)"
        >
          <span class="">{{ item.value }}</span>
          <span
            :class="[
              'sort-indicator',
              {
                'icon-triangle-n':
                  sortByValue == item.col && sortDirection == 'up',
              },
              { hidden: sortByValue != item.col },
            ]"
          ></span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        :ref="templateRefsName + file.id"
        v-for="file in files"
        :key="file.id"
        @click="openDrawer(file.id)"
      >
        <td class="filename">
          <button class="name" :title="file.name">
            <span class="nametext">
              <span class="innernametext">
                {{ file.name }}
              </span>
            </span>
          </button>
        </td>
        <td class="filesize">
          <span class="size">
            {{ formatFileSize(file.size) }}
          </span>
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr class="summary">
        <td class="filename">{{ files.length }} fichiers</td>
        <td class="filesize">{{ formatFileSize(totalSizeFiles) }}</td>
      </tr>
    </tfoot>
  </table>
  <DrawerFileItem
    :visible="showDrawer"
    :fileID="selectFileID"
    @close="closeDrawer"
  />
</template>

<script lang="ts">
import { useStore } from "@/store";
import { defineComponent, ref } from "vue";
import { formatFileSize } from "../common/utils";

import FileItem from "./FileItem.vue";
import DrawerFileItem from "@/components/common/DawerFileItem.vue";
import { MetaFile } from "@/@types";

export default defineComponent({
  components: {
    DrawerFileItem,
  },
  setup() {
    return {};
  },
  data() {
    const sortV = "name";
    const sortD = "up";
    const coloms = [
      { value: "Nom", col: "name" as "name" | "size" },
      { value: "Taille", col: "size" as "name" | "size" },
    ];

    const files: Array<MetaFile> = this.$store.state.download.files.sortMetaFiles(
      sortV,
      sortD
    );
    return {
      selectFileID: "",
      showDrawer: false,
      templateRefsName: "fileItem_",
      sortByValue: sortV as "name" | "size",
      sortDirection: sortD as "up" | "down",
      files,
      headerCol: coloms,
    };
  },
  computed: {
    totalSizeFiles(): number {
      const allSizeFiles = this.files.map((item: MetaFile) => item.size);
      return allSizeFiles.reduce(
        (prevSize: number, nextSize: number) => prevSize + nextSize
      );
    },
  },
  methods: {
    formatFileSize,
    openDrawer(fileID: string) {
      this.selectFileID = fileID;
      this.setHighlightFocusItem(fileID);
      this.showDrawer = true;
    },
    closeDrawer() {
      this.showDrawer = false;
      this.removeHighlightFocusItem(this.selectFileID);
    },
    setHighlightFocusItem(fileID: string) {
      (this.$refs[this.templateRefsName + fileID] as HTMLElement).classList.add(
        "highlighted"
      );
    },
    removeHighlightFocusItem(fileID: string) {
      (this.$refs[
        this.templateRefsName + fileID
      ] as HTMLElement).classList.remove("highlighted");
    },
    sortFileBy(sort: "name" | "size") {
      if (this.sortByValue == sort) {
        this.sortDirection == "up"
          ? (this.sortDirection = "down")
          : (this.sortDirection = "up");
      } else {
        this.sortByValue = sort;
        this.sortDirection = "up";
      }
      this.files = this.$store.state.download.files.sortMetaFiles(
        this.sortByValue,
        this.sortDirection
      );
    },
  },
});
</script>

<style lang="scss" src="./FilesView.scss" scoped></style>
