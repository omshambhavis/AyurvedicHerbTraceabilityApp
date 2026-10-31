// Demo mode - use sample data instead of real API calls
const DEMO_MODE = true;

// Demo data store
let demoStore = {
  herbs: [] as any[],
  users: [] as any[],
  batches: [] as any[],
  reviews: [] as any[],
  initialized: false
};

// Initialize demo data
const initializeDemoData = async () => {
  if (demoStore.initialized) return;
  
  try {
    const { sampleHerbs, sampleUsers, sampleBatches, sampleReviews } = await import('../data/sampleData');
    demoStore.herbs = [...sampleHerbs];
    demoStore.users = [...sampleUsers];
    demoStore.batches = [...sampleBatches];
    demoStore.reviews = [...sampleReviews];
    demoStore.initialized = true;
  } catch (error) {
    console.error('Failed to initialize demo data:', error);
  }
};

// API client with demo mode support
class ApiClient {
  private authToken: string = '';

  constructor() {
    // Initialize demo data
    initializeDemoData();
  }

  // Set authentication token for user-specific operations
  setAuthToken(token: string) {
    this.authToken = token;
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    if (DEMO_MODE) {
      return this.handleDemoRequest<T>(endpoint, options);
    }

    // Real API implementation would go here
    throw new Error('Real API not implemented');
  }

  private async handleDemoRequest<T>(endpoint: string, options: RequestInit): Promise<T> {
    // Ensure demo data is initialized
    await initializeDemoData();
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 300));

    const method = options.method || 'GET';
    
    // Handle different endpoints
    if (endpoint === '/herbs' && method === 'GET') {
      return { herbs: demoStore.herbs } as T;
    }
    
    if (endpoint === '/batches' && method === 'GET') {
      return { batches: demoStore.batches } as T;
    }
    
    if (endpoint === '/users' && method === 'GET') {
      return { users: demoStore.users } as T;
    }
    
    if (endpoint === '/profile' && method === 'GET') {
      // Return current user based on auth token
      const currentUser = demoStore.users.find(u => u.id === 'A001'); // Default to admin for demo
      return { user: currentUser } as T;
    }
    
    if (endpoint === '/analytics' && method === 'GET') {
      const analytics = {
        totalFarmers: demoStore.users.filter(u => u.role === 'farmer').length,
        totalConsumers: demoStore.users.filter(u => u.role === 'consumer').length,
        totalBatches: demoStore.batches.length,
        pendingApprovals: demoStore.batches.filter(b => b.approvalStatus === 'pending').length,
        totalReviews: demoStore.reviews.length,
        averageRating: demoStore.reviews.length > 0 
          ? (demoStore.reviews.reduce((sum, r) => sum + r.rating, 0) / demoStore.reviews.length).toFixed(1)
          : 0,
        batchStatusDistribution: demoStore.batches.reduce((acc, batch) => {
          acc[batch.status] = (acc[batch.status] || 0) + 1;
          return acc;
        }, {} as any),
        recentActivity: {
          newUsers: 2,
          newBatches: 1
        }
      };
      return { analytics } as T;
    }
    
    if (endpoint.startsWith('/batches/') && method === 'PUT') {
      const batchId = endpoint.split('/')[2];
      const updateData = JSON.parse(options.body as string);
      
      const batchIndex = demoStore.batches.findIndex(b => b.id === batchId);
      if (batchIndex !== -1) {
        demoStore.batches[batchIndex] = { ...demoStore.batches[batchIndex], ...updateData };
        return { message: 'Batch updated', batch: demoStore.batches[batchIndex] } as T;
      }
    }
    
    if (endpoint.startsWith('/users/') && endpoint.endsWith('/status') && method === 'PUT') {
      const userId = endpoint.split('/')[2];
      const { status } = JSON.parse(options.body as string);
      
      const userIndex = demoStore.users.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        demoStore.users[userIndex].status = status;
        return { message: 'User status updated', user: demoStore.users[userIndex] } as T;
      }
    }
    
    if (endpoint === '/batches' && method === 'POST') {
      const batchData = JSON.parse(options.body as string);
      const newBatch = {
        id: `AYU-${batchData.herbId.slice(-3)}-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`,
        ...batchData,
        status: 'cultivation',
        approvalStatus: 'pending',
        createdAt: new Date().toISOString(),
        currentLocation: batchData.farmLocation
      };
      demoStore.batches.push(newBatch);
      return { message: 'Batch created', batch: newBatch } as T;
    }

    // Default response
    return { message: 'Demo endpoint not implemented' } as T;
  }

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Authentication API
export const authAPI = {
  signup: async (userData: {
    email: string;
    password: string;
    name: string;
    role: 'farmer' | 'consumer' | 'admin';
    mobile: string;
    location: string;
    farmSize?: string;
    herbsGrown?: string[];
    aadhaarId?: string;
  }) => {
    return apiClient.post('/auth/signup', userData);
  },

  getProfile: async () => {
    return apiClient.get('/profile');
  },
};

// User management API (Admin only)
export const userAPI = {
  getUsers: async () => {
    return apiClient.get('/users');
  },

  updateUserStatus: async (userId: string, status: 'active' | 'pending' | 'banned') => {
    return apiClient.put(`/users/${userId}/status`, { status });
  },
};

// Herb management API
export const herbAPI = {
  getHerbs: async () => {
    return apiClient.get('/herbs');
  },

  createHerb: async (herbData: {
    name: string;
    scientificName: string;
    image: string;
    category: string;
    benefits: string[];
    description: string;
    price: number;
    unit: string;
  }) => {
    return apiClient.post('/herbs', herbData);
  },
};

// Batch management API
export const batchAPI = {
  getBatches: async () => {
    return apiClient.get('/batches');
  },

  createBatch: async (batchData: {
    herbId: string;
    quantity: number;
    unit: string;
    harvestDate: string;
    quality: 'premium' | 'organic' | 'standard';
    certifications: string[];
    price: number;
    expiryDate: string;
    processingMethod: string;
    farmLocation: string;
  }) => {
    return apiClient.post('/batches', batchData);
  },

  updateBatch: async (batchId: string, updateData: any) => {
    return apiClient.put(`/batches/${batchId}`, updateData);
  },

  getBatchDetails: async (batchId: string) => {
    return apiClient.get(`/batch/${batchId}`);
  },
};

// Review management API
export const reviewAPI = {
  getReviews: async (batchId: string) => {
    return apiClient.get(`/reviews/${batchId}`);
  },

  createReview: async (reviewData: {
    batchId: string;
    rating: number;
    comment: string;
  }) => {
    return apiClient.post('/reviews', reviewData);
  },
};

// Analytics API (Admin only)
export const analyticsAPI = {
  getAnalytics: async () => {
    return apiClient.get('/analytics');
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    return apiClient.get('/health');
  },
};