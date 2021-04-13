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

<style lang="scss" scoped>
@import "../../assets/styles/font-awesome/fontawesome.scss";
@import "../../assets/styles/font-awesome/solid.scss";
@import "../../assets/styles/font-awesome/regular.scss";

// thead,
// tbody,
// tfoot {
//   position: relative;
//   min-width: 100%;
// }
/* thead,
tbody,
tfoot {
  display: block;
  width: 100%;
} */

table tbody tr td,
table thead tr th {
  // width: 100%;
  border-bottom: 1px solid var(--color-border);
}
tbody button {
  appearance: none;
  border: none;
  background-color: transparent;
  font-size: initial;
  outline: none;
  cursor: pointer;
  color: var(--color-main-text);
}
// tr {
//   min-width: 100%;
// }

table thead th {
  text-align: left;
  font-weight: inherit;
  color: var(--color-text-maxcontrast);
}

#filestable tbody tr {
  &:hover {
    background-color: var(--color-background-hover);
  }
  &.highlighted {
    background-color: var(--color-primary-light);
  }
}

#filestable thead tr,
#filestable tbody tr {
  cursor: pointer;
}

.header-name,
.header-size,
.filename,
.filesize {
  padding: 5px 10px;
}

.header-name,
.filename {
  padding-left: 20px;
}

.header-size,
.filesize {
  padding-right: 20px;
}

.icon-triangle-s {
  background-image: var(--icon-triangle-s);
}

.sort {
  .sort-indicator {
    width: 16px;
    height: 16px;
    margin-left: 5px;
    display: inline-block;
    vertical-align: text-bottom;
    opacity: 0.3;
    background-image: var(--icon-triangle-s);
    &.hidden {
      visibility: hidden;
    }
  }

  .icon-triangle-n {
    background-image: var(--icon-triangle-n) !important;
  }

  &:hover {
    .sort-indicator {
      visibility: visible;
    }
  }
}

.filename {
  position: relative;
  width: 100%;
  max-width: 0;
}
.filesize {
  text-align: right;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.name {
  position: relative;
  display: flex;
  max-width: 100%;
  min-width: 0;
  width: 100%;
  height: 30px;
  line-height: 30px;

  .nametext {
    text-align: left;
    width: 0;
    flex-grow: 1;
    display: flex;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    height: 100%;
    // width: 100%;
    z-index: 10;
    padding: 0 20px 0 0;
    box-sizing: border-box;
  }

  .innernametext {
    width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
.size {
  font-weight: 600;
}

.summary {
  opacity: 0.3;
}

@media screen and (max-width: 550px) {
  .header-size,
  .filesize {
    display: none;
  }
}
</style>
