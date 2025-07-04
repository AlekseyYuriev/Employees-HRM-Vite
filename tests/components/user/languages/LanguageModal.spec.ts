import { describe, it, expect, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import LanguageModal from "../../../../src/components/user/languages/LanguageModal.vue";
import { vuetify, i18n } from "../../../setup";

const baseProps = {
  isOpen: true,
  oLanguageForModal: null,
  userId: "42",
  userLanguages: [],
  allLanguages: [{ name: "English" }, { name: "German" }],
  areAllLangsLoading: false,
  isAllLangsError: false,
};

describe("LanguageModal.vue", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders and shows dialog when open", async () => {
    const wrapper = mount(LanguageModal, {
      props: baseProps,
      global: { plugins: [vuetify, i18n] },
      attachTo: document.body,
    });
    await nextTick();
    expect(document.body.innerHTML).toContain("language-modal__card-wrapper");
  });

  it("emits closeModal when cancel button is clicked", async () => {
    const wrapper = mount(LanguageModal, {
      props: baseProps,
      global: { plugins: [vuetify, i18n] },
      attachTo: document.body,
    });
    await nextTick();
    const cancelBtn = document.body.querySelector(
      ".language-modal__btn-cancel"
    );
    expect(cancelBtn).toBeTruthy();
    (cancelBtn as HTMLElement).click();
    await nextTick();
    expect(wrapper.emitted("closeModal")).toBeTruthy();
  });

  it("emits onCreateUserLanguage and closeModal when confirm is clicked after selecting language and proficiency", async () => {
    const wrapper = mount(LanguageModal, {
      props: baseProps,
      global: { plugins: [vuetify, i18n] },
      attachTo: document.body,
    });
    await nextTick();
    // Set language and proficiency directly
    const selects = wrapper.findAllComponents({ name: "v-select" });
    // First select is language, second is proficiency
    await selects[0].vm.$emit(
      "update:modelValue",
      baseProps.allLanguages[0].name
    );
    await selects[1].vm.$emit("update:modelValue", "A2");
    await nextTick();
    const confirmBtn = document.body.querySelector(
      ".language-modal__btn-confirm"
    );
    expect(confirmBtn).toBeTruthy();
    (confirmBtn as HTMLElement).click();
    await nextTick();
    expect(wrapper.emitted("onCreateUserLanguage")).toBeTruthy();
    expect(wrapper.emitted("closeModal")).toBeTruthy();
  });
});
