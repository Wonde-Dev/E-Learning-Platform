import { useState } from "react";
import toast from "react-hot-toast";
import { uploadsApi } from "@/services/uploads.service";

/**
 * type: "thumbnail" | "video" | "avatar" | "document"
 */
export function useUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const run = async (type, file) => {
    if (!uploadsApi[type]) throw new Error(`Unknown upload type: ${type}`);
    setIsUploading(true);
    setProgress(0);
    try {
      const timer = setInterval(
        () => setProgress((p) => Math.min(92, p + 6)),
        150
      );
      const res = await uploadsApi[type](file);
      clearInterval(timer);
      setProgress(100);
      toast.success("Upload complete");
      return res;
    } catch (e) {
      toast.error(e.message || "Upload failed");
      throw e;
    } finally {
      setIsUploading(false);
    }
  };

  return { run, isUploading, progress };
}
