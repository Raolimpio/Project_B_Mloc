import { motion } from 'framer-motion';
import { ReactNode, Suspense } from 'react';
import { PageLoading } from './page-loading';

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex-1 flex flex-col"
    >
      <Suspense fallback={
        <div className="flex-1 flex flex-col">
          <PageLoading />
        </div>
      }>
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </Suspense>
    </motion.div>
  );
}
