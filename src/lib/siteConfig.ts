/**
 * Site identity defaults.
 *
 * These are used as fallbacks when CMS settings don't exist yet.
 * For a different council deployment, change these values.
 * Once CMS settings are populated, these are only used as fallbacks.
 */
export const SITE_NAME = 'Umkhandlu';
export const SITE_DESCRIPTION =
  'Community digital platform for traditional councils, youth programs, and local governance.';

/**
 * Governance Node identity.
 *
 * Used by the Intelligence API /node endpoint.
 * Change these for each council deployment.
 */
export const NODE_ID = 'umkhandlu-khathide-001';
export const NODE_NAME = 'Umkhandlu — KwaGudlucingo Traditional Council';
export const NODE_PROVINCE = 'KwaZulu-Natal';
export const NODE_MUNICIPALITY = 'Newcastle';
export const NODE_DISTRICT = 'Amajuba';
export const NODE_LOCALITY = 'Osizweni / Mndozo';
// force redeploy 1777140588
