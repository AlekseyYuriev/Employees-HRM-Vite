import { describe, it, expect, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import RemoveProjectModal from "../../../../src/components/cv/projects/RemoveProjectModal.vue";
import { vuetify, i18n } from "../../../setup";

const baseProps = {
  isOpen: true,
  cvId: "1",
  projectId: "2",
  projectName: "Project B",
};

describe("RemoveProjectModal.vue", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders and shows dialog when open", async () => {
    const wrapper = mount(RemoveProjectModal, {
      props: baseProps,
      global: { plugins: [vuetify, i18n] },
      attachTo: document.body,
    });
    await nextTick();
    expect(document.body.innerHTML).toContain(
      "remove-project-modal__card-wrapper"
    );
    expect(document.body.innerHTML).toContain(baseProps.projectName);
  });

  it("emits closeModal when cancel button is clicked", async () => {
    const wrapper = mount(RemoveProjectModal, {
      props: baseProps,
      global: { plugins: [vuetify, i18n] },
      attachTo: document.body,
    });
    await nextTick();
    const cancelBtn = document.body.querySelector(
      ".remove-project-modal__btn-cancel"
    );
    expect(cancelBtn).toBeTruthy();
    (cancelBtn as HTMLElement).click();
    await nextTick();
    expect(wrapper.emitted("closeModal")).toBeTruthy();
  });

  it("emits onRemoveCvProject and closeModal when confirm is clicked", async () => {
    const wrapper = mount(RemoveProjectModal, {
      props: baseProps,
      global: { plugins: [vuetify, i18n] },
      attachTo: document.body,
    });
    await nextTick();
    const confirmBtn = document.body.querySelector(
      ".remove-project-modal__btn-confirm"
    );
    expect(confirmBtn).toBeTruthy();
    (confirmBtn as HTMLElement).click();
    await nextTick();
    expect(wrapper.emitted("onRemoveCvProject")).toBeTruthy();
    expect(wrapper.emitted("closeModal")).toBeTruthy();
  });
});
