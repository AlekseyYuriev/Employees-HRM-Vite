import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { vuetify } from "../../setup";
import AppSpinner from "../../../src/components/UI/AppSpinner.vue";

describe("AppSpinner.vue", () => {
  it("renders v-progress-circular with correct props", () => {
    const wrapper = mount(AppSpinner, {
      global: {
        plugins: [vuetify],
      },
    });

    const wrapperDiv = wrapper.find("div.v-progress-circular");
    expect(wrapperDiv.exists()).toBe(true);

    // Check inline styles for width and height
    expect(wrapperDiv.attributes("style")).toContain("width: 100px");
    expect(wrapperDiv.attributes("style")).toContain("height: 100px");

    // Check SVG presence (no need to check width/height attributes)
    const progressSvg = wrapper.find("svg");
    expect(progressSvg.exists()).toBe(true);

    // Check circles
    const underlayCircle = progressSvg.find(
      "circle.v-progress-circular__underlay"
    );
    const overlayCircle = progressSvg.find(
      "circle.v-progress-circular__overlay"
    );

    expect(underlayCircle.exists()).toBe(true);
    expect(overlayCircle.exists()).toBe(true);
  });
});
