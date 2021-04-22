<template >
  <transition name="popup-view">
    <div
      v-if="prevVisible"
      v-show="popupVisible"
      :class="['popup', 'popup-placement-' + placement]"
      :style="{ ...popupStyle }"
    >
      <!-- @mouseenter="onMouseenter"
      @mouseleave="onMouseleave" -->
      <div class="popup-wrapper">
        <div class="popup-arrow"></div>
        <div class="popup-content">
          <div v-if="title" class="popup__head">{{ title }}</div>
          <div class="popup__body">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, nextTick, reactive } from "vue";
import { Placement, Trigger } from "./type";
import { requestTimeout, removeRequestTimeout } from "./_utils";

interface Align {
  x: "left" | "right" | "center";
  y: "top" | "bottom" | "center";
}

export default defineComponent({
  emits: ["close"],
  setup() {
    return {};
  },
  data() {
    const popupStyle = reactive({
      top: null as string | null,
      left: null as string | null,
      transformOrigin: null as string | null,
    });
    const align: Align = {
      x: "center",
      y: "center",
    };
    return {
      prevVisible: this.visible ?? false,
      popupVisible: this.visible ?? false,
      hasPopupMouseDown: false,
      delayTimer: 0 as number, // Use for SetTimeout
      delayToHide: 200,
      mouseDownTimeout: 0,
      positionIsUpdate: false,
      elDOMRect: null as DOMRect | null,
      popupStyle,
      align,
      currentTrigger: null as Trigger | null,
    };
  },
  props: {
    visible: Boolean,
    title: String,
    trigger: {
      type: String as () => Trigger | Array<Trigger>,
    },
    placement: {
      type: String as () => Placement,
      default: "top",
    },
    duration: {
      type: Number,
    },
    delay: {
      type: Number,
      default: 200,
      required: false,
    },
    clickToShow: {
      type: Boolean,
      default: false,
    },
    getTiggerElement: Function,
  },
  watch: {
    visible(value: boolean) {
      this.setPopupVisible(value);
    },
    popupVisible(value) {
      if (value && !this.prevVisible) this.prevVisible = true;
      if (this.triggerIs("hover")) {
        if (value) window.addEventListener("mouseover", this.onDocumentOver);
        else window.removeEventListener("mouseover", this.onDocumentOver);
      }
      if (this.triggerIs("click")) {
        if (value) window.addEventListener("click", this.onDocumentClick, true);
        else window.removeEventListener("click", this.onDocumentClick, true);
      }
      if (!value) this.$emit("close");
    },
    triggerDOMRect() {
      this.positionIsUpdate = false;
    },
  },
  methods: {
    triggerIs(name: Trigger) {
      return this.trigger == name || this.trigger?.includes(name);
    },

    onMouseenter() {
      if (this.triggerIs("hover") && !this.currentTrigger) {
        this.currentTrigger = "hover";
        this.delaySetPopupVisible(true, this.delay);
      }
    },

    onMouseleave() {
      if (this.triggerIs("hover") && this.currentTrigger == "hover") {
        this.clearDelayTimer();
        this.delaySetPopupVisible(false, 50);
      }
    },

    onClick() {
      if (!this.currentTrigger) {
        this.currentTrigger = "click";
        this.setPopupVisible(true);
      } else {
        if (this.popupVisible && !this.clickToShow) {
          this.setPopupVisible(false);
        }
      }
    },

    setPopupVisible(visible: boolean) {
      this.clearDelayTimer();
      if (!visible && this.hasPopupMouseDown) return;
      this.popupVisible = visible;

      if (visible) nextTick(() => this.updateCal());
      else this.currentTrigger = null;

      // If duration is set
      if (this.duration && this.duration != 0) {
        this.delaySetPopupVisible(false, this.duration);
      }
    },

    delaySetPopupVisible(visible: boolean, delay: number) {
      if (delay != 0) {
        this.clearDelayTimer();

        this.delayTimer = requestTimeout(() => {
          this.setPopupVisible(visible);
          this.clearDelayTimer();
        }, delay);
      } else this.setPopupVisible(visible);
    },

    clearDelayTimer() {
      removeRequestTimeout(this.delayTimer);
    },

    onDocumentClick(event: Event) {
      if (this.popupVisible) {
        if (this.IfPopupHasMouseDown(event)) {
          this.hasPopupMouseDown = true;
        } else {
          this.hasPopupMouseDown = false;
          if (event.target != this.getTiggerElement!())
            this.setPopupVisible(false);
        }
      }
    },

    onDocumentOver(event: Event) {
      if (
        this.IfPopupHasMouseDown(event) ||
        event.target == this.getTiggerElement!()
      ) {
        this.hasPopupMouseDown = true;
      } else {
        this.hasPopupMouseDown = false;
        this.delaySetPopupVisible(false, this.delayToHide);
      }
    },

    IfPopupHasMouseDown(event: Event) {
      const contain = this.isContain(
        this.$el as HTMLElement,
        event.target as HTMLElement
      );
      return contain;
    },

    isContain(parent: HTMLElement, childen: HTMLElement) {
      return parent.contains(childen);
    },
    updateCal() {
      if (!this.positionIsUpdate) {
        const el = this.$el;
        if (el instanceof HTMLElement) {
          if (this.getTiggerElement) {
            const triggerElement = this.getTiggerElement();
            const triggerDOMRect = (triggerElement as HTMLElement).getBoundingClientRect();
            this.setNewPopupPosition(triggerDOMRect, el, this.align);
            this.positionIsUpdate = true;
          }
        }
      }
    },

    setNewPopupPosition(triggerRect: DOMRect, el: HTMLElement, align: Align) {
      const Position = {
        top: "0",
        left: "0",
      };

      // Vertical Position
      if (align.y == "top") {
        Position.top = `${triggerRect.y - el.offsetHeight}px`;
      } else if (align.y == "bottom") {
        Position.top = `${triggerRect.y + triggerRect.height}px`;
      } else {
        if (triggerRect.height > el.offsetHeight) {
          Position.top = `${
            triggerRect.y - (el.offsetHeight / 2 - triggerRect.height / 2)
          }px`;
        } else {
          Position.top = `${
            triggerRect.y + (triggerRect.height - el.offsetHeight) / 2
          }px`;
        }
      }

      // Horizontal Postition
      if (align.x == "left") {
        Position.left = `${triggerRect.x - el.offsetWidth}px`;
      } else if (align.x == "right") {
        Position.left = `${triggerRect.x + triggerRect.width}px`;
      } else {
        if (triggerRect.width > el.offsetWidth) {
          Position.left = `${
            triggerRect.x - (el.offsetWidth / 2 - triggerRect.width / 2)
          }px`;
        } else {
          Position.left = `${
            triggerRect.x + (triggerRect.width - el.offsetWidth) / 2
          }px`;
        }
      }
      this.popupStyle.top = Position.top;
      this.popupStyle.left = Position.left;
    },

    getAlign(placement: Placement): Align {
      const pls = placement.toLowerCase();
      const align: Align = {
        y: "center",
        x: "center",
      };

      if (pls.includes("top")) align.y = "top";
      if (pls.includes("bottom")) align.y = "bottom";
      if (pls.includes("left")) align.x = "left";
      if (pls.includes("right")) align.x = "right";

      return align;
    },

    getTranformOrigin(align: Align): string {
      // Transform Origin
      let transformOrigin = {
        top: "50%",
        left: "50%",
      };

      // Vertical Align
      if (align.y == "top") transformOrigin.top = "80%";
      else if (align.y == "bottom") transformOrigin.top = "20%";

      // Horizontal Align
      if (align.x == "left") transformOrigin.left = "80%";
      else if (align.x == "right") transformOrigin.left = "20%";

      return `${transformOrigin.left} ${transformOrigin.top}`;
    },
  },
  beforeMount() {
    this.align = this.getAlign(this.placement);
    this.popupStyle.transformOrigin = this.getTranformOrigin(this.align);
  },
  mounted() {
    this.updateCal();
  },
});
</script>

<style lang="scss">
.popup-view-enter-active,
.popup-view-leave-active {
  transition: transform 0.15s ease-out 0s;
}

.popup-view-enter-from,
.popup-view-leave-to {
  transform: scale(0);
}
.popup {
  position: absolute;
  z-index: 1000;
}

.popup-content {
  color: black;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.247);
}
.popup-arrow {
  position: absolute;
  height: 0.8rem;
  width: 0.8rem;
  border-style: solid;
  border-width: 0.4rem;
  //background-color: white;
}
.popup__body {
  padding: 0.5rem 1rem;
  font-size: 1.4rem;
}
.popup-placement-top {
  padding-bottom: 1rem;
  .popup-arrow {
    border-color: transparent #fff #fff transparent;
    box-shadow: 3px 3px 7px rgb(0, 0, 0, 7%);
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    bottom: 6px;
  }
}
.popup-placement-bottom {
  padding-top: 1rem;
  .popup-arrow {
    border-color: #fff transparent transparent #fff;
    box-shadow: -3px -3px 7px rgb(0, 0, 0, 7%);
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    top: 6px;
  }
}
</style>