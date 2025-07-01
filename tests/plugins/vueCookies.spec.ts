import { describe, it, expect, vi, beforeEach } from "vitest";

// Minimal mock for Vue app
const createMockApp = () => ({
  config: { globalProperties: {} },
});

describe("vueCookies plugin", () => {
  let mockApp: any;
  let mockVueCookies: any;

  beforeEach(() => {
    mockApp = createMockApp();
    mockVueCookies = {
      foo: "bar",
      get: vi.fn(),
      set: vi.fn(),
      remove: vi.fn(),
    };
    vi.resetModules();
    vi.doMock("vue-cookies", () => ({
      __esModule: true,
      default: { VueCookies: mockVueCookies },
    }));
  });

  it("installs and sets $cookies on globalProperties", async () => {
    const plugin = (await import("../../src/plugins/vueCookies")).default;
    plugin.install(mockApp);
    expect(mockApp.config.globalProperties.$cookies).toBe(mockVueCookies);
  });

  it("does not overwrite unrelated globalProperties", async () => {
    mockApp.config.globalProperties.someOther = 123;
    const plugin = (await import("../../src/plugins/vueCookies")).default;
    plugin.install(mockApp);
    expect(mockApp.config.globalProperties.someOther).toBe(123);
    expect(mockApp.config.globalProperties.$cookies).toBe(mockVueCookies);
  });

  it("does not call any VueCookies methods during install", async () => {
    const plugin = (await import("../../src/plugins/vueCookies")).default;
    plugin.install(mockApp);
    expect(mockVueCookies.get).not.toHaveBeenCalled();
    expect(mockVueCookies.set).not.toHaveBeenCalled();
    expect(mockVueCookies.remove).not.toHaveBeenCalled();
  });

  it("can be installed multiple times without error", async () => {
    const plugin = (await import("../../src/plugins/vueCookies")).default;
    expect(() => {
      plugin.install(mockApp);
      plugin.install(mockApp);
    }).not.toThrow();
    expect(mockApp.config.globalProperties.$cookies).toBe(mockVueCookies);
  });
});
