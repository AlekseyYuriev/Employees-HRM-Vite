import { describe, it, expect, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import AvatarDeleteModal from "../../../../src/components/user/profile/AvatarDeleteModal.vue";
import { vuetify, i18n } from "../../../setup";

const baseProps = {
  isOpen: true,
};

describe("AvatarDeleteModal.vue", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders and shows dialog when open", async () => {
    const wrapper = mount(AvatarDeleteModal, {
      props: baseProps,
      global: { plugins: [vuetify, i18n] },
      attachTo: document.body,
    });
    await nextTick();
    expect(document.body.innerHTML).toContain(
      "delete-avatar-modal__card-wrapper"
    );
  });

  it("emits closeModal when cancel button is clicked", async () => {
    const wrapper = mount(AvatarDeleteModal, {
      props: baseProps,
      global: { plugins: [vuetify, i18n] },
      attachTo: document.body,
    });
    await nextTick();
    const cancelBtn = document.body.querySelector(
      ".delete-avatar-modal__btn-cancel"
    );
    expect(cancelBtn).toBeTruthy();
    (cancelBtn as HTMLElement).click();
    await nextTick();
    expect(wrapper.emitted("closeModal")).toBeTruthy();
  });

  it("emits closeModal when cross button is clicked", async () => {
    const wrapper = mount(AvatarDeleteModal, {
      props: baseProps,
      global: { plugins: [vuetify, i18n] },
      attachTo: document.body,
    });
    await nextTick();
    const crossBtn = document.body.querySelector(
      ".delete-avatar-modal__cross-btn"
    );
    expect(crossBtn).toBeTruthy();
    (crossBtn as HTMLElement).click();
    await nextTick();
    expect(wrapper.emitted("closeModal")).toBeTruthy();
  });

  it("emits confirmDeleteUserAvatar when confirm button is clicked", async () => {
    const wrapper = mount(AvatarDeleteModal, {
      props: baseProps,
      global: { plugins: [vuetify, i18n] },
      attachTo: document.body,
    });
    await nextTick();
    const confirmBtn = document.body.querySelector(
      ".delete-avatar-modal__btn-confirm"
    );
    expect(confirmBtn).toBeTruthy();
    (confirmBtn as HTMLElement).click();
    await nextTick();
    expect(wrapper.emitted("confirmDeleteUserAvatar")).toBeTruthy();
  });
});
