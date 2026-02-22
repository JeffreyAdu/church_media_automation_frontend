'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedListProps {
  className?: string;
  children: React.ReactNode;
  delay?: number;
}

/**
 * AnimatedList — wraps a list of keyed children so that each new item
 * springs in from above when it enters the DOM.
 *
 * Usage:
 *   <AnimatedList>
 *     {jobs.map(job => <JobCard key={job.id} job={job} />)}
 *   </AnimatedList>
 */
export function AnimatedList({ className, children, delay = 0 }: AnimatedListProps) {
  const items = Array.isArray(children) ? children : [children];

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <AnimatePresence initial={false}>
        {items.map((child, i) => {
          if (!child) return null;
          const key = (child as React.ReactElement<{ key?: React.Key }>).key ?? i;
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
              transition={{
                type: 'spring',
                stiffness: 350,
                damping: 40,
                delay: i === 0 ? delay / 1000 : 0,
              }}
            >
              {child}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
