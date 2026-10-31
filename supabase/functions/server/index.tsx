import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Utility function to get user from access token
async function getUserFromToken(accessToken: string | undefined) {
  if (!accessToken) return null;
  try {
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) return null;
    return user;
  } catch (error) {
    console.log('Error verifying user token:', error);
    return null;
  }
}

// Health check endpoint
app.get("/make-server-8283d390/health", (c) => {
  return c.json({ status: "ok" });
});

// Authentication Routes
app.post("/make-server-8283d390/auth/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name, role, mobile, location, farmSize, herbsGrown, aadhaarId } = body;

    if (!email || !password || !name || !role || !mobile || !location) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name, 
        role, 
        mobile, 
        location,
        ...(role === 'farmer' && { farmSize, herbsGrown, aadhaarId })
      },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (authError) {
      console.log('Auth signup error:', authError);
      return c.json({ error: authError.message }, 400);
    }

    // Store additional user data in KV store
    const userData = {
      id: authData.user.id,
      name,
      role,
      mobile,
      email,
      location,
      registrationDate: new Date().toISOString().split('T')[0],
      status: role === 'farmer' ? 'pending' : 'active', // Farmers need approval
      ...(role === 'farmer' && { aadhaarId, farmSize, herbsGrown })
    };

    await kv.set(`user:${authData.user.id}`, userData);

    return c.json({ 
      message: "User created successfully", 
      user: userData,
      needsApproval: role === 'farmer'
    });

  } catch (error) {
    console.log('Signup error:', error);
    return c.json({ error: "Internal server error during signup" }, 500);
  }
});

// User management routes
app.get("/make-server-8283d390/users", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getUserFromToken(accessToken);
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get user data to check role
    const userData = await kv.get(`user:${user.id}`);
    if (!userData || userData.role !== 'admin') {
      return c.json({ error: "Admin access required" }, 403);
    }

    // Get all users
    const users = await kv.getByPrefix('user:');
    return c.json({ users });

  } catch (error) {
    console.log('Error fetching users:', error);
    return c.json({ error: "Internal server error while fetching users" }, 500);
  }
});

app.put("/make-server-8283d390/users/:id/status", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getUserFromToken(accessToken);
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Check admin role
    const adminData = await kv.get(`user:${user.id}`);
    if (!adminData || adminData.role !== 'admin') {
      return c.json({ error: "Admin access required" }, 403);
    }

    const userId = c.req.param('id');
    const { status } = await c.req.json();

    if (!['active', 'pending', 'banned'].includes(status)) {
      return c.json({ error: "Invalid status" }, 400);
    }

    // Update user status
    const userData = await kv.get(`user:${userId}`);
    if (!userData) {
      return c.json({ error: "User not found" }, 404);
    }

    userData.status = status;
    await kv.set(`user:${userId}`, userData);

    return c.json({ message: "User status updated", user: userData });

  } catch (error) {
    console.log('Error updating user status:', error);
    return c.json({ error: "Internal server error while updating user status" }, 500);
  }
});

// Herb management routes
app.get("/make-server-8283d390/herbs", async (c) => {
  try {
    const herbs = await kv.getByPrefix('herb:');
    return c.json({ herbs });
  } catch (error) {
    console.log('Error fetching herbs:', error);
    return c.json({ error: "Internal server error while fetching herbs" }, 500);
  }
});

app.post("/make-server-8283d390/herbs", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getUserFromToken(accessToken);
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);
    if (!userData || userData.role !== 'admin') {
      return c.json({ error: "Admin access required" }, 403);
    }

    const herbData = await c.req.json();
    const herbId = `H${Date.now()}`;
    
    const herb = {
      id: herbId,
      ...herbData,
      createdAt: new Date().toISOString()
    };

    await kv.set(`herb:${herbId}`, herb);
    return c.json({ message: "Herb created", herb });

  } catch (error) {
    console.log('Error creating herb:', error);
    return c.json({ error: "Internal server error while creating herb" }, 500);
  }
});

// Batch management routes
app.get("/make-server-8283d390/batches", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getUserFromToken(accessToken);
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);
    if (!userData) {
      return c.json({ error: "User data not found" }, 404);
    }

    let batches;
    if (userData.role === 'farmer') {
      // Farmers can only see their own batches
      batches = await kv.getByPrefix('batch:');
      batches = batches.filter(batch => batch.farmerId === user.id);
    } else {
      // Admins and consumers can see all batches
      batches = await kv.getByPrefix('batch:');
    }

    return c.json({ batches });

  } catch (error) {
    console.log('Error fetching batches:', error);
    return c.json({ error: "Internal server error while fetching batches" }, 500);
  }
});

app.post("/make-server-8283d390/batches", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getUserFromToken(accessToken);
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);
    if (!userData || userData.role !== 'farmer' || userData.status !== 'active') {
      return c.json({ error: "Active farmer access required" }, 403);
    }

    const batchData = await c.req.json();
    const batchId = `AYU-${batchData.herbId}-${Date.now()}`;
    
    const batch = {
      id: batchId,
      farmerId: user.id,
      status: 'cultivation',
      approvalStatus: 'pending',
      createdAt: new Date().toISOString(),
      currentLocation: userData.location,
      ...batchData
    };

    await kv.set(`batch:${batchId}`, batch);
    return c.json({ message: "Batch created", batch });

  } catch (error) {
    console.log('Error creating batch:', error);
    return c.json({ error: "Internal server error while creating batch" }, 500);
  }
});

app.put("/make-server-8283d390/batches/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getUserFromToken(accessToken);
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const batchId = c.req.param('id');
    const updateData = await c.req.json();

    const batch = await kv.get(`batch:${batchId}`);
    if (!batch) {
      return c.json({ error: "Batch not found" }, 404);
    }

    const userData = await kv.get(`user:${user.id}`);
    
    // Check permissions
    if (userData.role === 'farmer' && batch.farmerId !== user.id) {
      return c.json({ error: "Can only update your own batches" }, 403);
    }
    
    if (userData.role === 'admin') {
      // Admin can update approval status
      Object.assign(batch, updateData);
    } else if (userData.role === 'farmer') {
      // Farmers can update most fields except approval status
      const { approvalStatus, ...farmerUpdates } = updateData;
      Object.assign(batch, farmerUpdates);
    } else {
      return c.json({ error: "Insufficient permissions" }, 403);
    }

    batch.updatedAt = new Date().toISOString();
    await kv.set(`batch:${batchId}`, batch);

    return c.json({ message: "Batch updated", batch });

  } catch (error) {
    console.log('Error updating batch:', error);
    return c.json({ error: "Internal server error while updating batch" }, 500);
  }
});

// Review management routes
app.get("/make-server-8283d390/reviews/:batchId", async (c) => {
  try {
    const batchId = c.req.param('batchId');
    const reviews = await kv.getByPrefix('review:');
    const batchReviews = reviews.filter(review => review.batchId === batchId);
    
    return c.json({ reviews: batchReviews });

  } catch (error) {
    console.log('Error fetching reviews:', error);
    return c.json({ error: "Internal server error while fetching reviews" }, 500);
  }
});

app.post("/make-server-8283d390/reviews", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getUserFromToken(accessToken);
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);
    if (!userData || userData.role !== 'consumer') {
      return c.json({ error: "Consumer access required" }, 403);
    }

    const reviewData = await c.req.json();
    const reviewId = `R${Date.now()}`;
    
    const review = {
      id: reviewId,
      consumerId: user.id,
      consumerName: userData.name,
      date: new Date().toISOString().split('T')[0],
      helpful: 0,
      ...reviewData
    };

    await kv.set(`review:${reviewId}`, review);
    return c.json({ message: "Review created", review });

  } catch (error) {
    console.log('Error creating review:', error);
    return c.json({ error: "Internal server error while creating review" }, 500);
  }
});

// Dashboard analytics
app.get("/make-server-8283d390/analytics", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getUserFromToken(accessToken);
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);
    if (!userData || userData.role !== 'admin') {
      return c.json({ error: "Admin access required" }, 403);
    }

    // Get all data for analytics
    const [users, batches, reviews] = await Promise.all([
      kv.getByPrefix('user:'),
      kv.getByPrefix('batch:'),
      kv.getByPrefix('review:')
    ]);

    const analytics = {
      totalFarmers: users.filter(u => u.role === 'farmer').length,
      totalConsumers: users.filter(u => u.role === 'consumer').length,
      totalBatches: batches.length,
      pendingApprovals: batches.filter(b => b.approvalStatus === 'pending').length,
      totalReviews: reviews.length,
      averageRating: reviews.length > 0 
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0,
      batchStatusDistribution: batches.reduce((acc, batch) => {
        acc[batch.status] = (acc[batch.status] || 0) + 1;
        return acc;
      }, {}),
      recentActivity: {
        newUsers: users.filter(u => {
          const regDate = new Date(u.registrationDate);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return regDate > weekAgo;
        }).length,
        newBatches: batches.filter(b => {
          const createDate = new Date(b.createdAt || b.harvestDate);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return createDate > weekAgo;
        }).length
      }
    };

    return c.json({ analytics });

  } catch (error) {
    console.log('Error fetching analytics:', error);
    return c.json({ error: "Internal server error while fetching analytics" }, 500);
  }
});

// QR code batch lookup
app.get("/make-server-8283d390/batch/:id", async (c) => {
  try {
    const batchId = c.req.param('id');
    const batch = await kv.get(`batch:${batchId}`);
    
    if (!batch) {
      return c.json({ error: "Batch not found" }, 404);
    }

    // Get herb details
    const herb = await kv.get(`herb:${batch.herbId}`);
    
    // Get farmer details
    const farmer = await kv.get(`user:${batch.farmerId}`);
    
    // Get reviews for this batch
    const allReviews = await kv.getByPrefix('review:');
    const batchReviews = allReviews.filter(review => review.batchId === batchId);

    return c.json({ 
      batch, 
      herb, 
      farmer: farmer ? {
        id: farmer.id,
        name: farmer.name,
        location: farmer.location,
        farmSize: farmer.farmSize
      } : null,
      reviews: batchReviews
    });

  } catch (error) {
    console.log('Error fetching batch details:', error);
    return c.json({ error: "Internal server error while fetching batch details" }, 500);
  }
});

// User profile route
app.get("/make-server-8283d390/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getUserFromToken(accessToken);
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);
    if (!userData) {
      return c.json({ error: "User profile not found" }, 404);
    }

    // Remove sensitive information
    const { aadhaarId, ...safeUserData } = userData;
    
    return c.json({ user: safeUserData });

  } catch (error) {
    console.log('Error fetching profile:', error);
    return c.json({ error: "Internal server error while fetching profile" }, 500);
  }
});

// Admin data seeding endpoints
app.post("/make-server-8283d390/admin/seed-herb", async (c) => {
  try {
    const herbData = await c.req.json();
    await kv.set(`herb:${herbData.id}`, herbData);
    return c.json({ message: "Herb seeded", herb: herbData });
  } catch (error) {
    console.log('Error seeding herb:', error);
    return c.json({ error: "Internal server error while seeding herb" }, 500);
  }
});

app.post("/make-server-8283d390/admin/seed-all", async (c) => {
  try {
    const { herbs, users, batches, reviews } = await c.req.json();

    // Seed herbs
    if (herbs) {
      for (const herb of herbs) {
        await kv.set(`herb:${herb.id}`, herb);
      }
    }

    // Seed users (skip auth users as they need proper signup)
    if (users) {
      for (const user of users) {
        await kv.set(`user:${user.id}`, user);
      }
    }

    // Seed batches
    if (batches) {
      for (const batch of batches) {
        await kv.set(`batch:${batch.id}`, batch);
      }
    }

    // Seed reviews
    if (reviews) {
      for (const review of reviews) {
        await kv.set(`review:${review.id}`, review);
      }
    }

    return c.json({ message: "All sample data seeded successfully" });

  } catch (error) {
    console.log('Error seeding all data:', error);
    return c.json({ error: "Internal server error while seeding data" }, 500);
  }
});

Deno.serve(app.fetch);