import { m, AnimatePresence, LazyMotion, domAnimation } from 'framer-motion';
import { QueryProvider } from '@/components/common/QueryProvider';
import { SendSurveyModalContent, type SendSurveyModalContentProps } from './SendSurveyModalContent';

export default function SendSurveyModal(props: SendSurveyModalContentProps) {
    return (
        <LazyMotion features={domAnimation}>
            <AnimatePresence>
                <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={props.onClose}
                >
                    <m.div
                        initial={{ opacity: 0, scale: 0.96, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 8 }}
                        transition={{ duration: 0.18 }}
                        onClick={e => e.stopPropagation()}
                        className="w-full max-w-md"
                    >
                        <QueryProvider>
                            <SendSurveyModalContent {...props} />
                        </QueryProvider>
                    </m.div>
                </m.div>
            </AnimatePresence>
        </LazyMotion>
    );
}
