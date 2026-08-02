import { instance } from "@/app/api/api.interceptor";

export const FileService = {
  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);

    return instance<{ filename: string; url: string }>({
      url: 'files',
      method: 'POST',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
}
