import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import { vuetify, i18n } from "../setup";
import longPress from "../../src/directives/VLongPress";
import SkillsCategory from "../../src/components/SkillsCategory.vue";
import { Mastery } from "../../src/types/enums";

// Define PointerEvent if not available (for jsdom)
class TestPointerEvent extends MouseEvent {
  pointerType: string;
  constructor(type: string, props: any = {}) {
    super(type, props);
    this.pointerType = props.pointerType || "mouse";
  }
}
(global as any).PointerEvent = TestPointerEvent;

const defaultProps = {
  category: "Programming technologies",
  categorySkills: [
    {
      name: "Vue.js",
      mastery: Mastery.Expert,
      skillIndex: 0,
      isDeleting: false,
    },
    {
      name: "React",
      mastery: Mastery.Advanced,
      skillIndex: 1,
      isDeleting: true,
    },
  ],
};

describe("SkillsCategory.vue", () => {
  const mountComponent = () =>
    mount(SkillsCategory, {
      props: defaultProps,
      global: {
        plugins: [vuetify, i18n],
        directives: {
          "long-press": longPress,
        },
      },
    });

  it("renders translated category title", () => {
    const wrapper = mountComponent();
    expect(wrapper.find("h3").text()).toBe("Programming technologies");
  });

  it("renders all skill cards", () => {
    const wrapper = mountComponent();
    const cards = wrapper.findAll(".skills-wrapper__skill-card");
    expect(cards).toHaveLength(defaultProps.categorySkills.length);
  });

  it("displays correct skill names", () => {
    const wrapper = mountComponent();
    const skillLabels = wrapper.findAll(".skills-wrapper__skill-label");
    expect(skillLabels[0].text()).toBe("Vue.js");
    expect(skillLabels[1].text()).toBe("React");
  });

  it("emits openEditModal on card click", async () => {
    const wrapper = mountComponent();
    const cards = wrapper.findAll(".skills-wrapper__skill-card");
    await cards[0].trigger("click");

    expect(wrapper.emitted("openEditModal")).toBeTruthy();
    expect(wrapper.emitted("openEditModal")![0]).toEqual([
      {
        name: "Vue.js",
        category: "Programming technologies",
        mastery: Mastery.Expert,
      },
      "Vue.js",
      0,
    ]);
  });

  it("emits setCardForDeletion on right-click (mouse)", async () => {
    const wrapper = mountComponent();
    const secondCard = wrapper.findAll(".skills-wrapper__skill-card")[1];

    const event = new PointerEvent("contextmenu", {
      bubbles: true,
      pointerType: "mouse",
    });
    secondCard.element.dispatchEvent(event);
    await secondCard.trigger("contextmenu");

    expect(wrapper.emitted("setCardForDeletion")![0]).toEqual([
      "React",
      1,
      false,
    ]);
  });

  it("emits setCardForDeletion on right-click (touch)", async () => {
    const wrapper = mountComponent();
    const secondCard = wrapper.findAll(".skills-wrapper__skill-card")[1];

    const event = new PointerEvent("contextmenu", {
      bubbles: true,
      pointerType: "touch",
    });
    secondCard.element.dispatchEvent(event);
    await secondCard.trigger("contextmenu");

    const calls = wrapper.emitted("setCardForDeletion")!;
    expect(calls[calls.length - 1]).toEqual(["React", 1, false]);
  });

  it("applies deleting class when skill is marked for deletion", () => {
    const wrapper = mountComponent();
    const cards = wrapper.findAll(".skills-wrapper__skill-card");

    expect(cards[0].classes()).not.toContain(
      "skills-wrapper__skill-card_is-deleting"
    );
    expect(cards[1].classes()).toContain(
      "skills-wrapper__skill-card_is-deleting"
    );
  });

  it("emits setCardForDeletion on long press directive manually", () => {
    const wrapper = mountComponent();
    const vm = wrapper.vm as any;

    // Simulate v-long-press triggering manually
    vm.handleSetCardForDeletion("React", 1, false);

    const calls = wrapper.emitted("setCardForDeletion")!;
    expect(calls[calls.length - 1]).toEqual(["React", 1, false]);
  });
});
