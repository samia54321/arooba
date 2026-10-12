import { Router } from 'express';
import { db } from '../db.ts';

const router = Router();

// GET /api/orders - Get orders (with optional customer userId query or all for admin)
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    const orders = await db.getOrders(userId ? String(userId) : undefined);
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/orders/:id - Get single order details & tracking status
router.get('/:id', async (req, res) => {
  try {
    const order = await db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/orders - Place a new order
router.post('/', async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      orderType,
      address,
      items,
      subtotal,
      tax,
      deliveryFee,
      tip,
      total,
      paymentMethod,
      userId
    } = req.body;

    if (!customerName || !customerPhone || !items || !items.length) {
      return res.status(400).json({ success: false, error: 'Customer name, phone number, and items are required' });
    }

    const newOrder = await db.createOrder({
      customerName,
      customerEmail: customerEmail || 'guest@example.com',
      customerPhone,
      orderType: orderType || 'delivery',
      address,
      items,
      subtotal: Number(subtotal),
      tax: Number(tax),
      deliveryFee: Number(deliveryFee || 0),
      tip: Number(tip || 0),
      total: Number(total),
      paymentMethod: paymentMethod || 'card',
      status: 'pending',
      userId
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! The oven is firing up.',
      data: newOrder
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/orders/:id/status - Update order status (Admin)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'preparing', 'baking', 'out_for_delivery', 'delivered', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, error: `Invalid status. Must be one of: ${allowed.join(', ')}` });
    }

    const updated = await db.updateOrderStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.json({ success: true, message: `Order status updated to ${status}`, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
