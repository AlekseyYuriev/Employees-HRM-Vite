import { describe, it, expect, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import SkillModal from "../../../../src/components/user/skills/SkillModal.vue";
import { vuetify, i18n } from "../../../setup";

const baseProps = {
  isOpen: true,
  oSkillForModal: null,
  userId: "42",
  userSkills: [],
  allSkills: [
    {
      name: "TypeScript",
      category: "Programming languages",
      mastery: "Novice",
    },
    { name: "Vue", category: "Programming technologies", mastery: "Novice" },
  ],
  areAllSkillsLoading: false,
  isAllSkillsError: false,
};

describe("SkillModal.vue", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders and shows dialog when open", async () => {
    const wrapper = mount(SkillModal, {
      props: baseProps,
      global: { plugins: [vuetify, i18n] },
      attachTo: document.body,
    });
    await nextTick();
    expect(document.body.innerHTML).toContain("skill-modal__card-wrapper");
  });

  it("emits closeModal when cancel button is clicked", async () => {
    const wrapper = mount(SkillModal, {
      props: baseProps,
      global: { plugins: [vuetify, i18n] },
      attachTo: document.body,
    });
    await nextTick();
    const cancelBtn = document.body.querySelector(".skill-modal__btn-cancel");
    expect(cancelBtn).toBeTruthy();
    (cancelBtn as HTMLElement).click();
    await nextTick();
    expect(wrapper.emitted("closeModal")).toBeTruthy();
  });

  it("emits onCreateUserSkill and closeModal when confirm is clicked after selecting skill and mastery", async () => {
    const wrapper = mount(SkillModal, {
      props: baseProps,
      global: { plugins: [vuetify, i18n] },
      attachTo: document.body,
    });
    await nextTick();
    // Set skill and mastery directly
    const selects = wrapper.findAllComponents({ name: "v-select" });
    // First select is skill, third is mastery
    await selects[0].vm.$emit("update:modelValue", baseProps.allSkills[0].name);
    await selects[2].vm.$emit("update:modelValue", "Novice");
    await nextTick();
    const confirmBtn = document.body.querySelector(".skill-modal__btn-confirm");
    expect(confirmBtn).toBeTruthy();
    (confirmBtn as HTMLElement).click();
    await nextTick();
    expect(wrapper.emitted("onCreateUserSkill")).toBeTruthy();
    expect(wrapper.emitted("closeModal")).toBeTruthy();
  });
});
