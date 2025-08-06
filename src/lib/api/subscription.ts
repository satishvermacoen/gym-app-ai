// src/lib/api/subscription.ts

import { get, post } from '@/utils/api-helpers';

export const getSubscriptionPlans = () => get('/subscription/subscription-list');
export const createSubscriptionPlan = (planData: any) => post('/subscription/add-subscription', planData);
export const subscribeToPlan = (planId: string) => post('/subscription/subscribe-to-plan', { planId });