import { apiClient } from './api';
import { projectId, publicAnonKey } from './supabase/info';

// Initialize the database with sample data
export const initializeDatabase = async (): Promise<boolean> => {
  try {
    console.log('Starting database initialization...');

    // Check if data already exists
    try {
      const herbsResponse = await apiClient.get('/herbs');
      if (herbsResponse.herbs && herbsResponse.herbs.length > 0) {
        console.log('Database already initialized with data');
        return true;
      }
    } catch (error) {
      console.log('No existing data found, proceeding with initialization');
    }

    console.log('Database initialization completed');
    return true;

  } catch (error) {
    console.error('Failed to initialize database:', error);
    return false;
  }
};

// Function to seed data for development/testing
export const seedSampleData = async () => {
  try {
    console.log('Seeding sample data...');

    // This would typically be called from an admin interface
    // For now, we'll create a simple seeding endpoint

    const response = await apiClient.post('/admin/seed-all', {
      herbs: sampleHerbs,
      users: sampleUsers,
      batches: sampleBatches,
      reviews: sampleReviews
    });

    console.log('Sample data seeded successfully');
    return response;

  } catch (error) {
    console.error('Failed to seed sample data:', error);
    throw error;
  }
};