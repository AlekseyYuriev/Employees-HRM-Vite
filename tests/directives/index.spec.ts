import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import directives from "../../src/directives";

const longPress = directives["long-press"];

describe("directives index", () => {
  it("exports long-press directive", () => {
    expect(longPress).toBeTypeOf("object");
    expect(typeof longPress.beforeMount).toBe("function");
    expect(typeof longPress.unmounted).toBe("function");
  });

  describe("long-press directive integration", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    const global = { directives: { "long-press": longPress } };

    it("calls handler after long press (800ms)", async () => {
      const handler = vi.fn();
      const wrapper = mount(
        {
          template: '<div v-long-press="onLongPress" />',
          methods: { onLongPress: handler },
        },
        { global }
      );
      await wrapper.vm.$nextTick();
      const el = wrapper.element as HTMLElement;
      const touchEvent = new TouchEvent("touchstart");
      el.dispatchEvent(touchEvent);
      await wrapper.vm.$nextTick();
      vi.advanceTimersByTime(800);
      await wrapper.vm.$nextTick();
      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(touchEvent);
    });

    it("does not call handler if touch ends before 800ms", async () => {
      const handler = vi.fn();
      const wrapper = mount(
        {
          template: '<div v-long-press="onLongPress" />',
          methods: { onLongPress: handler },
        },
        { global }
      );
      await wrapper.vm.$nextTick();
      const el = wrapper.element as HTMLElement;
      const touchStart = new TouchEvent("touchstart");
      el.dispatchEvent(touchStart);
      await wrapper.vm.$nextTick();
      vi.advanceTimersByTime(400);
      el.dispatchEvent(new TouchEvent("touchend"));
      await wrapper.vm.$nextTick();
      vi.advanceTimersByTime(800);
      await wrapper.vm.$nextTick();
      expect(handler).not.toHaveBeenCalled();
    });

    it("does not call handler if touchcancel before 800ms", async () => {
      const handler = vi.fn();
      const wrapper = mount(
        {
          template: '<div v-long-press="onLongPress" />',
          methods: { onLongPress: handler },
        },
        { global }
      );
      await wrapper.vm.$nextTick();
      const el = wrapper.element as HTMLElement;
      const touchStart = new TouchEvent("touchstart");
      el.dispatchEvent(touchStart);
      await wrapper.vm.$nextTick();
      vi.advanceTimersByTime(400);
      el.dispatchEvent(new TouchEvent("touchcancel"));
      await wrapper.vm.$nextTick();
      vi.advanceTimersByTime(800);
      await wrapper.vm.$nextTick();
      expect(handler).not.toHaveBeenCalled();
    });

    it("removes event listeners and custom props on unmount", async () => {
      const handler = vi.fn();
      const wrapper = mount(
        {
          template: '<div v-long-press="onLongPress" />',
          methods: { onLongPress: handler },
        },
        { global }
      );
      await wrapper.vm.$nextTick();
      const el = wrapper.element as any;
      // The directive should have set these props
      expect(typeof el.__longPressStart).toBe("function");
      expect(typeof el.__longPressCancel).toBe("function");
      wrapper.unmount();
      expect(el.__longPressStart).toBeUndefined();
      expect(el.__longPressCancel).toBeUndefined();
    });
  });
});
