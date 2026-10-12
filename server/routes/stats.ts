import { Router } from 'express';
import { db, dbStatus } from '../db.ts';

const router = Router();

// GET /api/stats - Dashboard analytics
router.get('/', async (req, res) => {
  try {
    const stats = await db.getStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/db-status - Database connection state & info
router.get('/status', (req, res) => {
  res.json({
    success: true,
    data: {
      isMongoConnected: dbStatus.isMongoConnected,
      storageType: dbStatus.storageType,
      hasMongoUriConfigured: Boolean(process.env.MONGODB_URI),
      connectedAt: dbStatus.connectedAt,
      lastError: dbStatus.lastError
    }
  });
});

export default router;
