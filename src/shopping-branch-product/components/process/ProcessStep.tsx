import { motion } from 'framer-motion';
import { Check, Loader2, AlertTriangle } from 'lucide-react';

import { cn } from '@/lib/utils';

interface ProcessStepProps {
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  index: number;
  isCurrent: boolean;
  isLast?: boolean;
  errorTitle?: string;
  errors?: string[];
}

export function ProcessStep({
  title,
  description,
  status,
  index,
  isLast,
  errorTitle,
  errors,
  isCurrent,
}: ProcessStepProps) {
  return (
    <div className="flex items-start">
      <div className="relative flex flex-col items-center mr-4">
        <motion.div
          animate={{ scale: 1 }}
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center',
            status === 'completed'
              ? 'bg-green-500'
              : status === 'processing'
                ? 'bg-blue-500'
                : status === 'error'
                  ? 'bg-red-500'
                  : 'bg-gray-200'
          )}
          initial={{ scale: 0 }}
          transition={{ delay: index * 0.2 }}
        >
          {status === 'completed' && <Check className="w-5 h-5 text-white" />}
          {status === 'processing' && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2 className="w-5 h-5 text-white" />
            </motion.div>
          )}
          {status === 'error' && <AlertTriangle className="w-5 h-5 text-white" />}
          {status === 'pending' && <span className="w-2 h-2 bg-gray-400 rounded-full" />}
        </motion.div>
        {!isLast && (
          <motion.div
            animate={{ height: '100%' }}
            className={cn(
              'w-0.5 absolute top-8 h-full -translate-x-1/2 left-1/2',
              status === 'completed'
                ? 'bg-green-500'
                : status === 'processing'
                  ? 'bg-blue-500'
                  : status === 'error'
                    ? 'bg-red-500'
                    : 'bg-gray-200'
            )}
            initial={{ height: 0 }}
            transition={{ delay: index * 0.2 }}
          />
        )}
      </div>
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 mb-8"
        initial={{ opacity: 0, x: -20 }}
        transition={{ delay: index * 0.2 }}
      >
        <h3
          className={cn(
            'font-semibold',
            status === 'completed'
              ? 'text-green-500'
              : status === 'processing'
                ? 'text-blue-500'
                : status === 'error'
                  ? 'text-red-500'
                  : 'text-gray-500'
          )}
        >
          {title}
        </h3>
        <p className="text-sm text-gray-600">{description}</p>
        {status === 'error' && errorTitle && isCurrent && (
          <div className="mt-2">
            <h4 className="text-sm font-semibold text-red-500">{errorTitle}</h4>
            <ul className="list-disc ml-6 text-sm text-red-500">
              {errors?.map((err, idx) => <li key={idx}>{err}</li>)}
            </ul>
          </div>
        )}
      </motion.div>
    </div>
  );
}
