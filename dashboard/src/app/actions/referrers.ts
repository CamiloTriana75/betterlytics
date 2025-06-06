'use server';

import {
  getReferrerSourceAggregationDataForSite,
  getReferrerSummaryDataForSite,
  getReferrerTableDataForSite,
  getReferrerTrafficTrendBySourceDataForSite,
  getTopReferrerUrlsForSite,
  getTopChannelsForSite,
  getTopReferrerSourcesForSite,
} from '@/services/referrers';
import { GranularityRangeValues } from '@/utils/granularityRanges';
import { withDashboardAuthContext } from '@/auth/auth-actions';
import { AuthContext } from '@/entities/authContext';
import {
  TopReferrerUrl,
  TopChannel,
  TopReferrerSource,
  TrafficSourcesCombined,
  TrafficSourcesCombinedSchema,
} from '@/entities/referrers';
import { QueryFilter } from '@/entities/filter';

/**
 * Fetches the referrer distribution data for a site
 */
export const fetchReferrerSourceAggregationDataForSite = withDashboardAuthContext(
  async (ctx: AuthContext, startDate: Date, endDate: Date, queryFilters: QueryFilter[]) => {
    try {
      const data = await getReferrerSourceAggregationDataForSite(ctx.siteId, startDate, endDate, queryFilters);
      return { data };
    } catch (error) {
      console.error('Error fetching referrer distribution:', error);
      throw error;
    }
  },
);

/**
 * Fetches the referrer traffic trend data grouped by source type for a site with specified granularity
 */
export const fetchReferrerTrafficTrendBySourceDataForSite = withDashboardAuthContext(
  async (
    ctx: AuthContext,
    startDate: Date,
    endDate: Date,
    granularity: GranularityRangeValues,
    queryFilters: QueryFilter[],
  ) => {
    try {
      const data = await getReferrerTrafficTrendBySourceDataForSite(
        ctx.siteId,
        startDate,
        endDate,
        granularity,
        queryFilters,
      );
      return { data };
    } catch (error) {
      console.error('Error fetching referrer traffic trend by source:', error);
      throw error;
    }
  },
);

/**
 * Fetches the summary data for referrers including referral sessions, total sessions, top referrer source, and avg session duration
 */
export const fetchReferrerSummaryDataForSite = withDashboardAuthContext(
  async (ctx: AuthContext, startDate: Date, endDate: Date, queryFilters: QueryFilter[]) => {
    try {
      const data = await getReferrerSummaryDataForSite(ctx.siteId, startDate, endDate, queryFilters);
      return { data };
    } catch (error) {
      console.error('Error fetching referrer summary data:', error);
      throw error;
    }
  },
);

/**
 * Fetches detailed referrer data for table display
 */
export const fetchReferrerTableDataForSite = withDashboardAuthContext(
  async (ctx: AuthContext, startDate: Date, endDate: Date, queryFilters: QueryFilter[], limit: number = 100) => {
    try {
      const data = await getReferrerTableDataForSite(ctx.siteId, startDate, endDate, queryFilters, limit);
      return { data };
    } catch (error) {
      console.error('Error fetching referrer table data:', error);
      throw error;
    }
  },
);

/**
 * Fetches top referrer URLs
 */
export const fetchTopReferrerUrlsForSite = withDashboardAuthContext(
  async (
    ctx: AuthContext,
    startDate: Date,
    endDate: Date,
    queryFilters: QueryFilter[],
    limit: number = 10,
  ): Promise<TopReferrerUrl[]> => {
    try {
      const data = await getTopReferrerUrlsForSite(ctx.siteId, startDate, endDate, queryFilters, limit);
      return data;
    } catch (error) {
      console.error('Error fetching top referrer URLs:', error);
      throw error;
    }
  },
);

/**
 * Fetches top traffic channels
 */
export const fetchTopChannelsForSite = withDashboardAuthContext(
  async (
    ctx: AuthContext,
    startDate: Date,
    endDate: Date,
    queryFilters: QueryFilter[],
    limit: number = 10,
  ): Promise<TopChannel[]> => {
    try {
      const data = await getTopChannelsForSite(ctx.siteId, startDate, endDate, queryFilters, limit);
      return data;
    } catch (error) {
      console.error('Error fetching top channels:', error);
      throw error;
    }
  },
);

/**
 * Fetches top referrer sources
 */
export const fetchTopReferrerSourcesForSite = withDashboardAuthContext(
  async (
    ctx: AuthContext,
    startDate: Date,
    endDate: Date,
    queryFilters: QueryFilter[],
    limit: number = 10,
  ): Promise<TopReferrerSource[]> => {
    try {
      const data = await getTopReferrerSourcesForSite(ctx.siteId, startDate, endDate, queryFilters, limit);
      return data;
    } catch (error) {
      console.error('Error fetching top referrer sources:', error);
      throw error;
    }
  },
);

export const fetchTrafficSourcesCombinedAction = withDashboardAuthContext(
  async (
    ctx: AuthContext,
    startDate: Date,
    endDate: Date,
    queryFilters: QueryFilter[],
    limit: number = 10,
  ): Promise<TrafficSourcesCombined> => {
    try {
      const [topReferrerUrls, topReferrerSources, topChannels] = await Promise.all([
        getTopReferrerUrlsForSite(ctx.siteId, startDate, endDate, queryFilters, limit),
        getTopReferrerSourcesForSite(ctx.siteId, startDate, endDate, queryFilters, limit),
        getTopChannelsForSite(ctx.siteId, startDate, endDate, queryFilters, limit),
      ]);

      return TrafficSourcesCombinedSchema.parse({
        topReferrerUrls,
        topReferrerSources,
        topChannels,
      });
    } catch (error) {
      console.error('Error fetching combined traffic sources:', error);
      throw error;
    }
  },
);
