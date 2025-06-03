'use client';

import { use, useMemo } from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { analyzeFunnel } from '../analytics';
import { fetchFunnelDetailsAction } from '@/app/actions';

type FunnelStepsSectionProps = {
  funnelPromise: ReturnType<typeof fetchFunnelDetailsAction>;
};

export default function FunnelStepsSection({ funnelPromise }: FunnelStepsSectionProps) {
  const funnel = use(funnelPromise);
  const funnelData = useMemo(() => analyzeFunnel(funnel), [funnel]);

  return (
    <div className='text-sm font-semibold'>
      <div className='mb-3 flex items-center gap-3'>
        <h1 className='text-xl font-semibold'>{funnel.name}</h1>
        <Badge className='mt-1 h-[50%] rounded-full text-gray-800' variant='outline'>
          {funnelData.steps.length} steps
        </Badge>
      </div>
      {funnelData.steps.map((step, index) => (
        <div key={step.page}>
          <div className='flex items-end justify-between'>
            <div className='flex items-center gap-3'>
              <p className='flex size-6 items-center justify-center rounded-full bg-gray-200 text-xs font-medium'>
                {index + 1}
              </p>
              <p>{step.page}</p>
            </div>
            <p className='mt-3'>{step.visitors} users</p>
          </div>
          <div className='p-3 text-gray-600'>
            <Progress className='h-4' value={100 * step.visitorsRatio} color='#22C55E' />
            <div className='flex items-end justify-between'>
              <p>{step.visitors} users</p>
              <p className='text-right'>{Math.floor(100 * step.visitorsRatio)}%</p>
            </div>
            <Progress className='mt-2' value={100 * step.dropoffRatio} color='#F97315' />
            <div className='flex items-end justify-between'>
              <p>{step.dropoffCount} users dropped-off</p>
              <p className='text-right'>{Math.floor(100 * step.dropoffRatio)}%</p>
            </div>
          </div>
          <hr />
        </div>
      ))}
    </div>
  );
}
