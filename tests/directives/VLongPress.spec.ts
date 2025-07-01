import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import longPress from "../../src/directives/VLongPress";

const mountWithDirective = (handler: (e: TouchEvent) => void) => {
  return mount({
    template: '<div v-long-press="onLongPress" />',
    directives: { longPress },
    methods: { onLongPress: handler },
  });
};

describe("VLongPress directive", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("calls handler after long press (800ms)", async () => {
    const handler = vi.fn();
    const wrapper = mountWithDirective(handler);
    const el = wrapper.element as HTMLElement;
    const touchEvent = new TouchEvent("touchstart");
    el.dispatchEvent(touchEvent);
    vi.advanceTimersByTime(800);
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(touchEvent);
  });

  it("does not call handler if touch ends before 800ms", async () => {
    const handler = vi.fn();
    const wrapper = mountWithDirective(handler);
    const el = wrapper.element as HTMLElement;
    const touchStart = new TouchEvent("touchstart");
    el.dispatchEvent(touchStart);
    vi.advanceTimersByTime(400);
    el.dispatchEvent(new TouchEvent("touchend"));
    vi.advanceTimersByTime(800);
    expect(handler).not.toHaveBeenCalled();
  });

  it("does not call handler if touchcancel before 800ms", async () => {
    const handler = vi.fn();
    const wrapper = mountWithDirective(handler);
    const el = wrapper.element as HTMLElement;
    const touchStart = new TouchEvent("touchstart");
    el.dispatchEvent(touchStart);
    vi.advanceTimersByTime(400);
    el.dispatchEvent(new TouchEvent("touchcancel"));
    vi.advanceTimersByTime(800);
    expect(handler).not.toHaveBeenCalled();
  });

  it("removes event listeners and custom props on unmount", async () => {
    const handler = vi.fn();
    const wrapper = mountWithDirective(handler);
    const el = wrapper.element as any;
    expect(el.__longPressStart).toBeTypeOf("function");
    expect(el.__longPressCancel).toBeTypeOf("function");
    wrapper.unmount();
    expect(el.__longPressStart).toBeUndefined();
    expect(el.__longPressCancel).toBeUndefined();
  });
});
