import { FolderNameForImage } from "@/app/constants/app.constants";

const SERVER_URL_FOR_IMAGE = process.env.NEXT_PUBLIC_SERVER_URL_IMAGE as string;

// Получение url пути к картинке
export const getImageUrl = (image?: string | null) =>
    image ? `${SERVER_URL_FOR_IMAGE}/${FolderNameForImage}/${image}` : '';
