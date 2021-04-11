<template>
  <Nav />
  <router-view class="view" v-slot="{ Component }">
    <template v-if="Component">
      <suspense>
        <component :is="Component"></component>
        <template #fallback>
          <div>Loading...</div>
        </template>
      </suspense>
    </template>
  </router-view>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import Nav from "@/components/Nav.vue";

export default defineComponent({
  components: {
    Nav,
  },
});
</script>


<style lang="scss">
#app {
  font-family: "Open Sans", sans-serif;
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.view {
  display: flex;
  height: 100%;
  width: 100%;
  & > * {
    margin: auto;
  }
}
</style>
