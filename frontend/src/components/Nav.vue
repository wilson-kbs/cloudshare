<template>
  <div id="nav">
    <span class="title-site">
      Kabaliserv
      <span class="service">Cloud Share</span>
    </span>
    <!-- <span class="toggle-theme">
      <input type="checkbox" id="theme" v-model="darkTheme" />
      <label for="theme">DARK</label>
    </span> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    const HTML: HTMLHtmlElement | null = document.querySelector("html");
    return {
      HTML,
    };
  },
  // data() {
  //   return {
  //     theme: localStorage.getItem("theme"),
  //   };
  // },
  // computed: {
  //   darkTheme: {
  //     get(): boolean {
  //       return this.theme != "light" ?? false;
  //     },
  //     set(value: boolean) {
  //       if (value) {
  //         this.theme = "dark";
  //       } else {
  //         this.theme = "light";
  //       }
  //       this.toggleTheme();
  //     },
  //   },
  // },
  // methods: {
  //   toggleTheme() {
  //     if (this.darkTheme) {
  //       localStorage.setItem("theme", "dark");
  //       this.HTML?.setAttribute("dark", "");
  //     } else {
  //       localStorage.setItem("theme", "light");
  //       this.HTML?.removeAttribute("dark");
  //     }
  //   },
  // },
  // mounted() {
  //   this.toggleTheme();
  // },
});
</script>

<style lang="scss" scoped>
#nav {
  position: relative;
  width: 100%;
  padding: 20px 30px;
  box-sizing: border-box;
  //box-shadow: 0 0px 5px 0 var(--color-box-shadow);

  .title-site {
    position: relative;
    //height: 0px;
    display: inline-block;
    font-size: 20px;
    font-weight: bold;
    .service {
      font-weight: 600;
      position: absolute;
      bottom: -10px;
      right: -30px;
      font-size: 12px;
    }
  }
}
.toggle-theme {
  position: absolute;
  right: 10px;
  & * {
    cursor: pointer;
  }
}
</style>
