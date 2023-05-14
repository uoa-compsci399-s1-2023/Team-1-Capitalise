export type TContentBlock = {
    type: "gallery" | "poster" | "text" | "video" | "codeBlock" | "quote" | "image";
    subHeading?: string;
    value: string[];
    _id: string;
}