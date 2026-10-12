import { Router } from 'express';
import { db } from '../db.ts';

const router = Router();

// GET /api/pizzas - List pizzas with filters
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const pizzas = await db.getPizzas({
      category: category ? String(category) : undefined,
      search: search ? String(search) : undefined
    });
    res.json({ success: true, count: pizzas.length, data: pizzas });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/pizzas/:id - Single pizza details
router.get('/:id', async (req, res) => {
  try {
    const pizza = await db.getPizzaById(req.params.id);
    if (!pizza) {
      return res.status(404).json({ success: false, error: 'Pizza not found' });
    }
    res.json({ success: true, data: pizza });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/pizzas - Create pizza (Admin)
router.post('/', async (req, res) => {
  try {
    const { name, description, price, category, image, ingredients, isVegetarian, isSpicy, isPopular, inStock, sizes, crusts } = req.body;
    
    if (!name || !price || !category) {
      return res.status(400).json({ success: false, error: 'Name, price, and category are required' });
    }

    const newPizza = await db.createPizza({
      name,
      description: description || 'Handcrafted wood-fired artisan pizza.',
      price: Number(price),
      category: category || 'Specialty',
      image: image || '/src/assets/images/hero_artisanal_pizza_1791819121869.jpg',
      ingredients: Array.isArray(ingredients) ? ingredients : (ingredients ? ingredients.split(',').map((s: string) => s.trim()) : ['San Marzano Tomatoes', 'Mozzarella']),
      isVegetarian: Boolean(isVegetarian),
      isSpicy: Boolean(isSpicy),
      isPopular: Boolean(isPopular),
      inStock: inStock !== undefined ? Boolean(inStock) : true,
      sizes: sizes || { personal: Number(price) * 0.85, classic: Number(price), grande: Number(price) * 1.3 },
      crusts: crusts || ['Traditional Neapolitan', 'Crispy Thin', 'Garlic Butter Stuffed']
    });

    res.status(201).json({ success: true, message: 'Pizza added to menu', data: newPizza });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/pizzas/:id - Update pizza (Admin)
router.put('/:id', async (req, res) => {
  try {
    const updated = await db.updatePizza(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Pizza not found' });
    }
    res.json({ success: true, message: 'Pizza updated', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/pizzas/:id - Delete pizza (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const success = await db.deletePizza(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Pizza not found' });
    }
    res.json({ success: true, message: 'Pizza removed from menu' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
