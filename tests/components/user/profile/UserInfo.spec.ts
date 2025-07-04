import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import UserInfo from "../../../../src/components/user/profile/UserInfo.vue";
import { vuetify, i18n } from "../../../setup";

const baseProps = {
  isOwner: true,
  userId: "42",
  userData: {
    firstName: "John",
    lastName: "Doe",
    email: "john@doe.com",
    isVerified: true,
    createdAt: "2023-01-01T00:00:00.000Z",
    departmentId: 1,
    departmentName: "Node",
    positionId: 2,
    positionName: "Software Engineer",
  },
  departmentNames: [
    { id: 1, name: "Node" },
    { id: 2, name: "Python" },
  ],
  areDepartmentsLoading: false,
  isDepartmentsError: false,
  positionNames: [
    { id: 2, name: "Software Engineer" },
    { id: 3, name: "AQA Engineer" },
  ],
  arePositionsLoading: false,
  isPositionsError: false,
};

describe("UserInfo.vue", () => {
  it("renders and shows user info", () => {
    const wrapper = mount(UserInfo, {
      props: baseProps,
      global: { plugins: [vuetify, i18n] },
    });
    expect(wrapper.text()).toContain("John Doe");
    expect(wrapper.text()).toContain("john@doe.com");
    expect(wrapper.text()).toContain("Node");
    expect(wrapper.text()).toContain("Software Engineer");
  });

  it("disables fields for non-owner", () => {
    const wrapper = mount(UserInfo, {
      props: { ...baseProps, isOwner: false },
      global: { plugins: [vuetify, i18n] },
    });
    // All fields should be readonly
    const textFields = wrapper.findAllComponents({ name: "v-text-field" });
    textFields.forEach((field) => {
      expect(field.props("readonly")).toBe(true);
    });
    const selects = wrapper.findAllComponents({ name: "v-select" });
    selects.forEach((select) => {
      expect(select.props("readonly")).toBe(true);
    });
    // No submit button
    expect(wrapper.find(".user-info__form-submit-btn").exists()).toBe(false);
  });

  it("emits onUpdateUserData when submit is clicked and fields are changed", async () => {
    const wrapper = mount(UserInfo, {
      props: baseProps,
      global: { plugins: [vuetify, i18n] },
    });
    // Change first name
    const textFields = wrapper.findAllComponents({ name: "v-text-field" });
    await textFields[0].vm.$emit("update:modelValue", "Jane");
    // Click submit
    const submitBtn = wrapper.find(".user-info__form-submit-btn");
    expect(submitBtn.exists()).toBe(true);
    await submitBtn.trigger("click");
    const emitted = wrapper.emitted("onUpdateUserData");
    expect(emitted).toBeTruthy();
    if (emitted && emitted[0]) {
      const [userInputObj, profileInputObj] = emitted[0] as [any, any];
      expect(userInputObj.userId).toBe(42);
      expect(profileInputObj.first_name).toBe("Jane");
    }
  });
});
