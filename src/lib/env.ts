/**
 * Environment Variables Validator
 * Checks that all required environment variables are set at startup.
 */

const requiredServerEnv = [
  'DATABASE_URL',
];

const requiredClientEnv = [
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
];

export function validateEnv() {
  const missingServer = requiredServerEnv.filter(
    (key) => !process.env[key]
  );
  
  const missingClient = requiredClientEnv.filter(
    (key) => !process.env[key]
  );

  const errors: string[] = [];

  if (missingServer.length > 0 && typeof window === 'undefined') {
    errors.push(
      `Missing server environment variables: ${missingServer.join(', ')}`
    );
  }

  if (missingClient.length > 0) {
    errors.push(
      `Missing client environment variables: ${missingClient.join(', ')}`
    );
  }

  if (errors.length > 0) {
    const errorMsg = `[Env Validation Error] Please check your .env.local file.\n` + errors.join('\n');
    console.error(errorMsg);
    
    // In production build or server startup, we might want to throw an error
    if (process.env.NODE_ENV === 'production') {
      throw new Error(errorMsg);
    }
  }
}

// Automatically validate on import (server startup)
if (typeof window === 'undefined') {
  validateEnv();
}
