import { APIRequestContext } from '@playwright/test';

/**
 * Reset and seed the database for testing
 */
export async function resetDatabase(requestContext: APIRequestContext, action: 'reset' | 'seed' | 'seed-edge-cases' = 'seed') {
  const response = await requestContext.post('/api/test/db', {
    data: { action }
  });
  
  // Note: During Milestone 1 setup, the endpoint might not exist yet,
  // so we log but don't strictly crash the setup, allowing developers to implement
  // this endpoint in subsequent milestones.
  if (!response.ok()) {
    console.warn(`[DB Seed Warning]: /api/test/db returned status ${response.status()}. Make sure to implement seed endpoint in Milestone 2.`);
  }
}
