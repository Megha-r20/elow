/**
 * Deprecated: Automatic container boot admin provisioning has been removed for security.
 * Admin account credentials must be provisioned explicitly using the setup script:
 *   ADMIN_EMAIL=admin@elow.com ADMIN_PASSWORD='...' npm run setup-admin
 */
export const ensureAdminUser = async () => {
  // No-op for runtime security
  return;
};
