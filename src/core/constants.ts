import path from 'path';

// In production this would resolve from the package install location
// For local development, templates live alongside src
export const TEMPLATE_DIR = path.resolve(__dirname, '../../templates');
