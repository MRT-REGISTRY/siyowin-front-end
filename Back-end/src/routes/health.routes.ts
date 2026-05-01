import { Router } from 'express';
import { isSupabaseConfigured } from '../config/supabase.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'siyowin-backend',
    supabaseConfigured: isSupabaseConfigured,
    timestamp: new Date().toISOString(),
  });
});

export default router;
