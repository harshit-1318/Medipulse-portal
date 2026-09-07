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
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-9999 flex items-center justify-center p-4" onClick={() => setPreviewImg(null)}>
            <div className="relative max-w-5xl w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                <button className="absolute top-4 right-4 text-white hover:text-teal-400 bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all cursor-pointer" onClick={() => setPreviewImg(null)}><X size={24} /></button>
                {imageList.length > 1 && (
                    <>
                        <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-teal-400 bg-white/10 hover:bg-white/20 p-4 rounded-full transition-all cursor-pointer" onClick={handlePrev}><ChevronLeft size={32} /></button>
                        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-teal-400 bg-white/10 hover:bg-white/20 p-4 rounded-full transition-all cursor-pointer" onClick={handleNext}><ChevronRight size={32} /></button>
                    </>
                )}
                <img src={previewImg} alt="Preview" className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-white/10" />
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white text-[14px] font-medium tracking-wide">Image {currentIndex + 1} of {imageList.length}</div>
            </div>
        </div>
    );
}
