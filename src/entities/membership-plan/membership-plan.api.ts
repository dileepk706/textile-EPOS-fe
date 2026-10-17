import { queryOptions } from '@tanstack/react-query';
import { getMembershipPlans, getMembershipPlanById } from 'shared/api/api.services';
import { MembershipPlanQueryDto } from 'shared/api/api.dto';
import { MembershipPlanTemplate } from './membership-plan.contracts';

export const getMembershipPlansQueryOptions = (params?: MembershipPlanQueryDto) =>
  queryOptions({
    queryKey: ['membership-plans', params],
    queryFn: async ({ signal }): Promise<MembershipPlanTemplate[]> => {
      const response = await getMembershipPlans(params, { signal });
      const rawData = response.data?.data;

      if (Array.isArray(rawData)) {
        return rawData;
      }

      if (rawData && typeof rawData === 'object' && Array.isArray((rawData as any).plans)) {
        return (rawData as any).plans;
      }

      return [];
    },
  });

export const getMembershipPlanByIdQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['membership-plans', id],
    queryFn: async ({ signal }): Promise<MembershipPlanTemplate> => {
      const response = await getMembershipPlanById(id, { signal });
      return response.data.data;
    },
  });
