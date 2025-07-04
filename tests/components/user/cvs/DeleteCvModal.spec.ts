import { describe, it, expect, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import DeleteCvModal from "../../../../src/components/user/cvs/DeleteCvModal.vue";
import { vuetify, i18n } from "../../../setup";

const baseProps = {
  isOpen: true,
  cvId: "1",
  cvName: "My CV",
};

describe("DeleteCvModal.vue", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders and shows dialog when open", async () => {
    const wrapper = mount(DeleteCvModal, {
      props: baseProps,
      global: { plugins: [vuetify, i18n] },
      attachTo: document.body,
    });
    await nextTick();
    expect(document.body.innerHTML).toContain("delete-cv-modal__card-wrapper");
    expect(document.body.innerHTML).toContain(baseProps.cvName);
  });

  it("emits closeModal when cancel button is clicked", async () => {
    const wrapper = mount(DeleteCvModal, {
      props: baseProps,
      global: { plugins: [vuetify, i18n] },
      attachTo: document.body,
    });
    await nextTick();
    const cancelBtn = document.body.querySelector(
      ".delete-cv-modal__btn-cancel"
    );
    expect(cancelBtn).toBeTruthy();
    (cancelBtn as HTMLElement).click();
    await nextTick();
    expect(wrapper.emitted("closeModal")).toBeTruthy();
  });

  it("emits onDeleteUserCv and closeModal when confirm is clicked", async () => {
    const wrapper = mount(DeleteCvModal, {
      props: baseProps,
      global: { plugins: [vuetify, i18n] },
      attachTo: document.body,
    });
    await nextTick();
    const confirmBtn = document.body.querySelector(
      ".delete-cv-modal__btn-confirm"
    );
    expect(confirmBtn).toBeTruthy();
    (confirmBtn as HTMLElement).click();
    await nextTick();
    expect(wrapper.emitted("onDeleteUserCv")).toBeTruthy();
    expect(wrapper.emitted("closeModal")).toBeTruthy();
  });
});
