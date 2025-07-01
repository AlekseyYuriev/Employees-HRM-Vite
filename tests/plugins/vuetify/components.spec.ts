import { describe, it, expect, vi } from "vitest";

vi.mock("vuetify/components", () => {
  const dummy = () => {};
  return {
    VBtn: dummy,
    VImg: dummy,
    VIcon: dummy,
    VTextField: dummy,
    VTextarea: dummy,
    VSelect: dummy,
    VDataTable: dummy,
    VBreadcrumbs: dummy,
    VBreadcrumbsItem: dummy,
    VMenu: dummy,
    VList: dummy,
    VListItem: dummy,
    VListItemTitle: dummy,
    VTabs: dummy,
    VTab: dummy,
    VToolbar: dummy,
    VAppBarNavIcon: dummy,
    VSpacer: dummy,
    VSkeletonLoader: dummy,
    VAvatar: dummy,
    VDivider: dummy,
    VCardText: dummy,
    VCard: dummy,
    VCardItem: dummy,
    VCardActions: dummy,
    VNavigationDrawer: dummy,
    VLayout: dummy,
    VProgressLinear: dummy,
    VProgressCircular: dummy,
    VDialog: dummy,
  };
});

import vuetifyComponents from "../../../src/plugins/vuetify/components";

const expectedComponents = [
  "VBtn",
  "VImg",
  "VIcon",
  "VTextField",
  "VTextarea",
  "VSelect",
  "VDataTable",
  "VBreadcrumbs",
  "VBreadcrumbsItem",
  "VMenu",
  "VList",
  "VListItem",
  "VListItemTitle",
  "VTabs",
  "VTab",
  "VToolbar",
  "VAppBarNavIcon",
  "VSpacer",
  "VSkeletonLoader",
  "VAvatar",
  "VDivider",
  "VCardText",
  "VCard",
  "VCardItem",
  "VCardActions",
  "VNavigationDrawer",
  "VLayout",
  "VProgressLinear",
  "VProgressCircular",
  "VDialog",
];

describe("vuetifyComponents plugin", () => {
  it("exports all expected Vuetify components", () => {
    expect(Object.keys(vuetifyComponents).sort()).toEqual(
      expectedComponents.sort()
    );
  });

  it("each exported value is a function (Vue component)", () => {
    for (const key of expectedComponents) {
      expect(typeof vuetifyComponents[key]).toBe("function");
    }
  });
});
