import { describe, it, expect, vi } from "vitest";
import fileToBase64 from "../../src/utils/fileToBase64";

describe("fileToBase64 util", () => {
  it("should convert a file to a base64 string", async () => {
    const mockFile = new File(["test content"], "test.txt", {
      type: "text/plain",
    });

    const base64Prefix = "data:text/plain;base64,";
    const expectedBase64 = base64Prefix + btoa("test content");

    const result = await fileToBase64(mockFile);
    expect(result).toBe(expectedBase64);
  });

  it("should reject if the FileReader fails", async () => {
    // Backup the original FileReader
    const OriginalFileReader = global.FileReader;

    // Mock the FileReader
    global.FileReader = vi.fn().mockImplementation(() => {
      let onerror: ((event: ProgressEvent<FileReader>) => void) | null = null;
      let onload: ((event: ProgressEvent<FileReader>) => void) | null = null;

      return {
        readAsDataURL: vi.fn(() => {
          setTimeout(() => {
            if (onerror) {
              // Simulate triggering the onerror event
              onerror(
                new ProgressEvent("error", {
                  target: null,
                } as any) as unknown as ProgressEvent<FileReader>
              );
            }
          }, 10);
        }),
        set onerror(callback: (event: ProgressEvent<FileReader>) => void) {
          onerror = callback;
        },
        get onerror() {
          return onerror || (() => {}); // Provide a default no-op function
        },
        set onload(callback: (event: ProgressEvent<FileReader>) => void) {
          onload = callback;
        },
        get onload() {
          return onload || (() => {}); // Provide a default no-op function
        },
      };
    }) as unknown as typeof FileReader;

    // Mock file
    const mockFile = new File(["test content"], "test.txt", {
      type: "text/plain",
    });

    const promise = fileToBase64(mockFile);

    // Expect the promise to reject
    await expect(promise).rejects.toThrow();

    // Restore the original FileReader
    global.FileReader = OriginalFileReader;
  });
});
