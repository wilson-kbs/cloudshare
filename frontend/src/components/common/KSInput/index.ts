import { defineComponent, h, VNode, reactive, ref, PropType } from "vue";

// Components
import Tooltip from "../Popup";

// Libraries
import ClipboardJS from "clipboard";

// Styles
import "./style";

// Types
type InputType = "text" | "password" | "copy" | "number" | "email";

export default defineComponent({
  emits: ["update:modelValue", "focus", "blur", "keyup:enter"],
  render() {
    return h(
      "div",
      {
        class: ["ks-input"],
      },
      [this.renderInput(), this.getButtonCTX()]
    );
  },
  setup() {
    const input = ref<HTMLInputElement>();
    const btnCopy = ref<HTMLElement>();
    return {
      input,
      btnCopy,
    };
  },
  data() {
    return {
      clipboardJS: null as ClipboardJS | null,
      isCopySupported: false,
    };
  },
  props: {
    type: {
      type: String as PropType<InputType>,
      default: "text",
    },
    value: {
      type: [String, Number] as PropType<string | number>,
    },
    modelValue: {
      type: [String, Number] as PropType<string | number>,
    },
    placeHolder: {
      type: [String, Number] as PropType<string | number>,
    },
    autoFocus: {
      type: Boolean,
      default: false,
    },
    error: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    renderInput() {
      return h("input", {
        ref: "input",
        type: this.getInputType(),
        class: [this.getInputClass(), { error: this.error }],
        placeholder: this.placeHolder ?? this.getInputDefaultPlaceHolder(),
        value: this.modelValue ?? this.value ?? "toto",
        readonly: this.type == "copy",
        "copy-supported": this.isCopySupported,
        oninput: (e: Event) =>
          this.$emit("update:modelValue", (e.target as HTMLInputElement).value),
        onfocus: this.onFocusInput,
        onblur: (e: Event) => this.$emit("blur", e),
        onkeyup: this.onKeyUp,
      });
    },
    // render boutton password toggle
    renderBtnPwdToggle() {
      const state = reactive({
        pwdVisible: false,
      });
      const togglePasswordView = () => {
        state.pwdVisible = !state.pwdVisible;
        if (this.input)
          if (state.pwdVisible) {
            this.input.type = "text";
          } else {
            this.input.type = "password";
          }
      };
      return h("span", {
        class: ["toggle-password-view"],
        onmousedown: (e: Event) => e.preventDefault(),
        onmouseup: (e: Event) => e.preventDefault(),
        onclick: togglePasswordView,
      });
    },
    // render boutton copy
    renderBtnCopy() {
      this.isCopySupported = ClipboardJS.isSupported();
      if (this.isCopySupported)
        return h(
          Tooltip,
          {
            trigger: "click",
            clickToShow: true,
            duration: 2000,
          },
          {
            content: () => "Copie!",
            default: () =>
              h("span", {
                ref: "btnCopy",
                class: ["clipboard-btn"],
                "data-clipboard-text": this.modelValue ?? this.value ?? "",
              }),
          }
        );
    },
    onFocusInput(e: Event) {
      this.$emit("focus", e);
      if (this.type == "copy" && this.input) this.input.select();
    },
    onKeyUp(e: KeyboardEvent) {
      if (e.key === "Enter" || e.keyCode === 13) {
        this.$emit("keyup:enter", e);
      }
    },
    getInputClass() {
      if (this.type == "password") return "ks-input-password";
      else if (this.type == "copy") return "ks-input-copy";
      else null;
    },
    getInputType() {
      if (this.type == "password") return "password";
      else if (this.type == "number") return "number";
      else if (this.type == "email") return "email";
      else "text";
    },
    getInputDefaultPlaceHolder() {
      if (this.type == "text") return "Champ de saisie";
      else if (this.type == "password") return "Mot de passe";
      else null;
    },
    getButtonCTX() {
      if (this.type == "password") return this.renderBtnPwdToggle();
      else if (this.type == "copy") return this.renderBtnCopy();
      else null;
    },
  },
  mounted() {
    if (this.type == "copy" && this.btnCopy && this.isCopySupported) {
      this.clipboardJS = new ClipboardJS(this.btnCopy);
    }

    if (this.autoFocus && this.input) {
      this.input.focus();
    }
  },
  beforeUnmount() {
    if (this.isCopySupported) this.clipboardJS?.destroy();
  },
});
