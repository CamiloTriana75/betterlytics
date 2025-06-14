'use client';

import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, TrendingUp } from 'lucide-react';
import { formatNumber } from '@/utils/formatters';
import type { getUserBillingData } from '@/actions/billing';

interface CurrentPlanCardProps extends Awaited<ReturnType<typeof getUserBillingData>> {}

export function CurrentPlanCard({ subscription, usage, usagePercentage, daysUntilReset }: CurrentPlanCardProps) {
  return (
    <div className='bg-card space-y-4 rounded-lg border p-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-semibold'>Current Plan</h3>
          <p className='text-muted-foreground text-sm'>Your current subscription details</p>
        </div>
        <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'} className='capitalize'>
          {subscription.status}
        </Badge>
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div className='space-y-3'>
          <div>
            <div className='text-muted-foreground text-sm'>Plan</div>
            <div className='font-semibold capitalize'>{subscription.tier}</div>
          </div>
          <div>
            <div className='text-muted-foreground text-sm'>Monthly Price</div>
            <div className='font-semibold'>
              {subscription.pricePerMonth === 0 ? 'Free' : `$${subscription.pricePerMonth}`}
            </div>
          </div>
          <div className='text-muted-foreground flex items-center gap-2 text-sm'>
            <Calendar size={14} />
            <span>Resets in {daysUntilReset} days</span>
          </div>
        </div>

        <div className='space-y-3'>
          <div className='flex items-center gap-2'>
            <TrendingUp size={16} className='text-muted-foreground' />
            <span className='text-sm font-medium'>Event Usage</span>
          </div>

          <div className='space-y-2'>
            <div className='flex items-center justify-between text-sm'>
              <span className='text-muted-foreground'>
                {formatNumber(usage.current)} of {formatNumber(usage.limit)} events
              </span>
              <span className={`font-medium ${usage.isOverLimit ? 'text-red-500' : 'text-foreground'}`}>
                {usagePercentage.toFixed(1)}%
              </span>
            </div>

            <Progress value={Math.min(usagePercentage, 100)} className='h-2' />
          </div>
        </div>
      </div>
    </div>
  );
}
