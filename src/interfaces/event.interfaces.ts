export type ImageFile = {
    id: string;
    file: string;
    preview: string;
    isCover: boolean;
    focusPoint: {
        x: number;
        y: number;
    };
};