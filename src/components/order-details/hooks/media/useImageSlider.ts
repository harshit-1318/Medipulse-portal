import { useState } from "react";

export function useImageSlider() {
    const [imageList, setImageList] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [previewImg, setPreviewImg] = useState<string | undefined>();

    const handleView = (url?: string | null) => {
        if (!url) return alert("No media found!");
        setImageList([url]);
        setCurrentIndex(0);
        setPreviewImg(url);
    };

    const handleViewPrescriptionList = (urls?: string[]) => {
        if (!urls?.length) return alert("No Prescriptions Found!");
        setImageList(urls);
        setCurrentIndex(0);
        setPreviewImg(urls[0]);
    };

    return {
        imageList,
        currentIndex,
        setCurrentIndex,
        previewImg,
        setPreviewImg,
        handleView,
        handleViewPrescriptionList,
    };
}
