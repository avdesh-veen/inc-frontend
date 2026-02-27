/**
 * Provider Detail View API Barrel Export
 */

export { 
  getProviderDetailServer, 
  getProviderActivityServer, 
  getProviderDocumentsServer 
} from './server';

export { 
  getProviderDetailClient, 
  getProviderActivityClient, 
  getProviderDocumentsClient 
} from './client';

export { 
  createProviderAction, 
  updateProviderAction, 
  deleteProviderAction 
} from './actions';
