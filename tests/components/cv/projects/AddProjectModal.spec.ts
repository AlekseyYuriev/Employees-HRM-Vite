import { describe, it, expect, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import AddProjectModal from "../../../../src/components/cv/projects/AddProjectModal.vue";
import { vuetify, i18n } from "../../../setup";

const baseProps = {
  isOpen: true,
  cvId: "1",
  cvProjects: [],
  allProjects: [
    {
      id: 1,
      name: "Project A",
      startDate: "2020-01-01",
      endDate: "2020-12-31",
    },
    {
      id: 2,
      name: "Project B",
      startDate: "2021-01-01",
      endDate: "2021-12-31",
    },
  ],
  areAllProjectsLoading: false,
  isAllProjectsError: false,
};

describe("AddProjectModal.vue", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders and shows dialog when open", async () => {
    const wrapper = mount(AddProjectModal, {
      props: baseProps,
      global: { plugins: [vuetify, i18n] },
      attachTo: document.body,
    });
    await nextTick();
    expect(document.body.innerHTML).toContain(
      "add-project-modal__card-wrapper"
    );
  });

  it("emits closeModal when cancel button is clicked", async () => {
    const wrapper = mount(AddProjectModal, {
      props: baseProps,
      global: { plugins: [vuetify, i18n] },
      attachTo: document.body,
    });
    await nextTick();
    const cancelBtn = document.body.querySelector(
      ".add-project-modal__btn-cancel"
    );
    expect(cancelBtn).toBeTruthy();
    (cancelBtn as HTMLElement).click();
    await nextTick();
    expect(wrapper.emitted("closeModal")).toBeTruthy();
  });

  it("emits onCreateCvProject and closeModal when confirm is clicked after selecting project", async () => {
    const wrapper = mount(AddProjectModal, {
      props: baseProps,
      global: { plugins: [vuetify, i18n] },
      attachTo: document.body,
    });
    await nextTick();
    const select = wrapper.findComponent({ name: "v-select" });
    await select.vm.$emit("update:modelValue", baseProps.allProjects[0]);
    await nextTick();
    const confirmBtn = document.body.querySelector(
      ".add-project-modal__btn-confirm"
    );
    expect(confirmBtn).toBeTruthy();
    (confirmBtn as HTMLElement).click();
    await nextTick();
    expect(wrapper.emitted("onCreateCvProject")).toBeTruthy();
    expect(wrapper.emitted("closeModal")).toBeTruthy();
  });
});
