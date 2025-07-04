import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import AvatarUpload from "../../../../src/components/user/profile/AvatarUpload.vue";
import { createPiniaTestingPlugin, vuetify, i18n } from "../../../setup";

vi.mock("@/utils/fileToBase64", () => ({
  __esModule: true,
  default: vi.fn(() => Promise.resolve("base64string")),
}));

const setErrorToast = vi.fn();
vi.mock("@/composables/useToast", () => ({
  __esModule: true,
  default: () => ({ setErrorToast }),
}));

const baseProps = {
  isOwner: true,
  userId: "42",
  avatar: null,
  userInitials: "JD",
};

describe("AvatarUpload.vue", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    setErrorToast.mockClear();
  });

  it("renders and shows initials if no avatar", () => {
    const wrapper = mount(AvatarUpload, {
      props: baseProps,
      global: { plugins: [createPiniaTestingPlugin, vuetify, i18n] },
    });
    expect(wrapper.text()).toContain("JD");
  });

  it("renders and shows avatar if present", () => {
    const wrapper = mount(AvatarUpload, {
      props: { ...baseProps, avatar: "avatar.png" },
      global: { plugins: [createPiniaTestingPlugin, vuetify, i18n] },
    });
    expect(wrapper.find("img[alt='User avatar']").exists()).toBe(true);
  });

  it("shows upload UI for owner and emits onUpdateUserAvatar when upload is confirmed", async () => {
    const wrapper = mount(AvatarUpload, {
      props: baseProps,
      global: { plugins: [createPiniaTestingPlugin, vuetify, i18n] },
    });
    // Simulate file selection
    const file = new File([new Uint8Array(1024)], "avatar.png", {
      type: "image/png",
    });
    // Call prepareAvatar directly
    await (wrapper.vm as any).prepareAvatar(file);
    // Confirm upload
    await (wrapper.vm as any).confirmAvatarUpload();
    const emitted = wrapper.emitted("onUpdateUserAvatar");
    expect(emitted).toBeTruthy();
    if (emitted && emitted[0]) {
      const payload = emitted[0][0] as any;
      expect(payload.userId).toBe(42);
      expect(payload.base64).toBe("base64string");
      expect(payload.size).toBe(1024);
      expect(payload.type).toBe("image/png");
    }
  });

  it("emits onDeleteUserAvatar when delete is confirmed", async () => {
    const wrapper = mount(AvatarUpload, {
      props: { ...baseProps, avatar: "avatar.png" },
      global: { plugins: [createPiniaTestingPlugin, vuetify, i18n] },
    });
    // Open delete modal
    await (wrapper.vm as any).handleOpenDeleteModal();
    // Confirm delete
    await (wrapper.vm as any).submitUserAvatarDeletion();
    const emitted = wrapper.emitted("onDeleteUserAvatar");
    expect(emitted).toBeTruthy();
    if (emitted && emitted[0]) {
      expect(emitted[0][0]).toBe("42");
    }
  });

  it("shows error toast for invalid file type", async () => {
    const wrapper = mount(AvatarUpload, {
      props: baseProps,
      global: { plugins: [createPiniaTestingPlugin, vuetify, i18n] },
    });
    const file = new File([new Uint8Array(10)], "avatar.txt", {
      type: "text/plain",
    });
    await (wrapper.vm as any).prepareAvatar(file);
    expect(setErrorToast).toHaveBeenCalledWith(
      expect.stringContaining("The file you've attached has unacceptable type")
    );
  });

  it("shows error toast for file too large", async () => {
    const wrapper = mount(AvatarUpload, {
      props: baseProps,
      global: { plugins: [createPiniaTestingPlugin, vuetify, i18n] },
    });
    const file = new File([new Uint8Array(600000)], "avatar.png", {
      type: "image/png",
    });
    await (wrapper.vm as any).prepareAvatar(file);
    expect(setErrorToast).toHaveBeenCalledWith(
      expect.stringContaining(
        "The file you've attached has too large size (> 0.5 MB)"
      )
    );
  });

  it("handles avatarChange event", async () => {
    const wrapper = mount(AvatarUpload, {
      props: baseProps,
      global: { plugins: [createPiniaTestingPlugin, vuetify, i18n] },
    });
    const file = new File([new Uint8Array(10)], "avatar.png", {
      type: "image/png",
    });
    const input = document.createElement("input");
    Object.defineProperty(input, "files", {
      value: [file],
      writable: false,
    });
    const event = { target: input } as unknown as Event;
    await (wrapper.vm as any).avatarChange(event);
    expect((wrapper.vm as any).avatarFile).toBe(file);
    expect((wrapper.vm as any).isAvatarFileReady).toBe(true);
  });

  it("handles avatarDragOver and avatarDragLeave", async () => {
    const wrapper = mount(AvatarUpload, {
      props: baseProps,
      global: { plugins: [createPiniaTestingPlugin, vuetify, i18n] },
      attachTo: document.body,
    });
    const label = document.createElement("div");
    label.className = "avatar-upload__prepare-avatar-wrapper";
    document.body.appendChild(label);
    const dragOverEvent = { target: label } as unknown as DragEvent;
    (wrapper.vm as any).avatarDragOver(dragOverEvent);
    expect(label.classList.contains("dark-red-filter-bg")).toBe(true);
    (wrapper.vm as any).avatarDragLeave(dragOverEvent);
    expect(label.classList.contains("dark-red-filter-bg")).toBe(false);
  });

  it("handles avatarDrop event", async () => {
    const wrapper = mount(AvatarUpload, {
      props: baseProps,
      global: { plugins: [createPiniaTestingPlugin, vuetify, i18n] },
    });
    const file = new File([new Uint8Array(10)], "avatar.png", {
      type: "image/png",
    });
    const label = document.createElement("div");
    label.className = "avatar-upload__prepare-avatar-wrapper";
    document.body.appendChild(label);
    const dragEvent = {
      target: label,
      dataTransfer: { files: [file] },
    } as unknown as DragEvent;
    (wrapper.vm as any).avatarDrop(dragEvent);
    expect((wrapper.vm as any).avatarFile).toBe(file);
    expect((wrapper.vm as any).isAvatarFileReady).toBe(true);
  });

  it("handleCloseDeleteModal sets isDeleteModalOpen to false", async () => {
    const wrapper = mount(AvatarUpload, {
      props: baseProps,
      global: { plugins: [createPiniaTestingPlugin, vuetify, i18n] },
    });
    (wrapper.vm as any).isDeleteModalOpen = true;
    (wrapper.vm as any).handleCloseDeleteModal();
    expect((wrapper.vm as any).isDeleteModalOpen).toBe(false);
  });
});
