import { DefineComponent, Plugin, App } from "@vue/runtime-core";

export const Directives: Plugin = {
  install: function (Vue: App, _options) {
    Vue.directive("visible", (el, binding) => {
      el.style.visibility = binding.value ? "visible" : "hidden";
    });
  },
};

export default Directives;
