import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ImagePreviewModalProps {
    previewImg: string;
    imageList: string[];
    currentIndex: number;
    setCurrentIndex: (idx: number) => void;
    setPreviewImg: (img: string | null) => void;
}

export function ImagePreviewModal({
    previewImg,
    imageList,
    currentIndex,
    setCurrentIndex,
    setPreviewImg,
}: ImagePreviewModalProps) {
    const handleNext = () => {
        const nextIdx = (currentIndex + 1) % imageList.length;
        setCurrentIndex(nextIdx);
        setPreviewImg(imageList[nextIdx]);
    };

    const handlePrev = () => {
        const prevIdx = (currentIndex - 1 + imageList.length) % imageList.length;
        setCurrentIndex(prevIdx);
        setPreviewImg(imageList[prevIdx]);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-99999 p-4" onClick={() => setPreviewImg(null)}>
            <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
                <button className="absolute -top-12 right-0 text-white hover:text-gray-300 p-2 text-xl font-bold flex items-center gap-1 cursor-pointer" onClick={() => setPreviewImg(null)}>
                    <X size={24} /> Close
                </button>
                <div className="relative overflow-hidden rounded-xl border border-white/20 shadow-2xl bg-black/40 flex items-center justify-center min-h-[300px]">
                    <img src={previewImg} alt="Preview" className="max-h-[80vh] w-auto object-contain rounded-lg" />
                    {imageList.length > 1 && (
                        <>
                            <button className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full backdrop-blur-xs transition-all cursor-pointer" onClick={handlePrev}>
                                <ChevronLeft size={24} />
                            </button>
                            <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full backdrop-blur-xs transition-all cursor-pointer" onClick={handleNext}>
                                <ChevronRight size={24} />
                            </button>
                        </>
                    )}
                </div>
                {imageList.length > 1 && (
                    <div className="mt-4 text-white/80 font-medium text-sm bg-black/40 px-4 py-1.5 rounded-full border border-white/10">
                        {currentIndex + 1} of {imageList.length}
                    </div>
                )}
            </div>
        </div>
    );
}
