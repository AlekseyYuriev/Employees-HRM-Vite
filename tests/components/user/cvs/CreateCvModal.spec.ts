import { describe, it, expect, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import CreateCvModal from "../../../../src/components/user/cvs/CreateCvModal.vue";
import { vuetify, i18n } from "../../../setup";

const baseProps = {
  isOpen: true,
  userId: "42",
};

describe("CreateCvModal.vue", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders and shows dialog when open", async () => {
    const wrapper = mount(CreateCvModal, {
      props: baseProps,
      global: { plugins: [vuetify, i18n] },
      attachTo: document.body,
    });
    await nextTick();
    expect(document.body.innerHTML).toContain("create-cv-modal__card-wrapper");
  });

  it("emits closeModal when cancel button is clicked", async () => {
    const wrapper = mount(CreateCvModal, {
      props: baseProps,
      global: { plugins: [vuetify, i18n] },
      attachTo: document.body,
    });
    await nextTick();
    const cancelBtn = document.body.querySelector(
      ".create-cv-modal__btn-cancel"
    );
    expect(cancelBtn).toBeTruthy();
    (cancelBtn as HTMLElement).click();
    await nextTick();
    expect(wrapper.emitted("closeModal")).toBeTruthy();
  });

  it("emits onCreateUserCv and closeModal when confirm is clicked after filling required fields", async () => {
    const wrapper = mount(CreateCvModal, {
      props: baseProps,
      global: { plugins: [vuetify, i18n] },
      attachTo: document.body,
    });
    await nextTick();
    // Set required fields (cvName, cvDescription)
    const textFields = wrapper.findAllComponents({ name: "v-text-field" });
    await textFields[0].vm.$emit("update:modelValue", "My CV"); // cvName
    await textFields[1].vm.$emit("update:modelValue", "Bachelor"); // cvEducation (optional)
    // v-textarea for description
    const textArea = wrapper.findComponent({ name: "v-textarea" });
    await textArea.vm.$emit("update:modelValue", "Some description");
    await nextTick();
    const confirmBtn = document.body.querySelector(
      ".create-cv-modal__btn-confirm"
    );
    expect(confirmBtn).toBeTruthy();
    (confirmBtn as HTMLElement).click();
    await nextTick();
    expect(wrapper.emitted("onCreateUserCv")).toBeTruthy();
    expect(wrapper.emitted("closeModal")).toBeTruthy();
  });
});
