const express = require('express');
const router = express.Router();
const db = require('../db');


// 🟣 Crea una nuova proposta di piatto
router.post('/', async (req, res) => {
  const {
    event_id,
    user_id,
    category_name,
    title,
    description,
    ingredients,
    image_url
  } = req.body;
  
  // 🔍 Risolviamo l'ID della categoria dal nome
  if (
    !event_id ||
    !user_id ||
    !category_name ||
    !title ||
    !Array.isArray(ingredients) ||
    ingredients.length === 0
  ) {
    return res.status(400).json({ message: 'Missing or invalid fields' });
  }
  
  try {
    const categoryRes = await db.query(
      'SELECT id FROM dish_categories WHERE LOWER(name) = LOWER($1)',
      [category_name]
    );
  
    if (categoryRes.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid category name' });
    }
  
    const category_id = categoryRes.rows[0].id;
  
    const result = await db.query(
      `INSERT INTO dish_proposals
        (event_id, user_id, category_id, title, description, ingredients, recipe, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, '', $7)
       RETURNING *`,
      [event_id, user_id, category_id, title, description || '', ingredients.join(', '), image_url || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error creating dish proposal:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// 🔽 Ottieni tutte le proposte di una categoria per un evento (usando il nome della categoria)
router.get('/:eventId/categories/:categoryName/proposals', async (req, res) => {
  const { eventId, categoryName } = req.params;

  try {
    // 🔍 Trova ID della categoria
    const categoryResult = await db.query(
      'SELECT id FROM dish_categories WHERE LOWER(name) = LOWER($1)',
      [categoryName]
    );

    if (categoryResult.rows.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const categoryId = categoryResult.rows[0].id;

    // 🔽 Recupera le proposte
    const result = await db.query(
      `
      SELECT 
        dp.id,
        dp.title,
        dp.description,
        dp.ingredients,
        dp.recipe,
        dp.image_url,
        dp.serving_size,
        dp.difficulty_level,
        dp.created_at,
        u.first_name || ' ' || u.last_name AS author_name,
        COUNT(DISTINCT dv.id) AS votes,
        COUNT(DISTINCT dar.id) > 0 AS has_allergen
      FROM dish_proposals dp
      LEFT JOIN users u ON dp.user_id = u.id
      LEFT JOIN dish_votes dv ON dv.dish_proposal_id = dp.id
      LEFT JOIN dish_allergy_reports dar ON dar.dish_proposal_id = dp.id
      WHERE dp.event_id = $1 AND dp.category_id = $2
      GROUP BY dp.id, u.first_name, u.last_name
      ORDER BY votes DESC, dp.created_at ASC;
      `,
      [eventId, categoryId]
    );

    res.json(
  result.rows.map(row => ({
    ...row,
    ingredients: typeof row.ingredients === 'string'
      ? row.ingredients.split(',').map(i => i.trim())
      : []
  }))
);
  } catch (err) {
    console.error('❌ Errore nel recupero delle proposte:', err);
    res.status(500).json({ message: 'Errore del server' });
  }
});


// 📍 Ottieni i dettagli di una singola proposta
router.get('/:proposalId', async (req, res) => {
  const { proposalId } = req.params;

  try {
    // 🔹 Recupera la proposta
    const proposalResult = await db.query(
      `SELECT dp.*, u.first_name || ' ' || u.last_name AS author_name, dc.name AS category_name
       FROM dish_proposals dp
       JOIN users u ON dp.user_id = u.id
       LEFT JOIN dish_categories dc ON dp.category_id = dc.id
       WHERE dp.id = $1`,
      [proposalId]
    );

    if (proposalResult.rows.length === 0) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    const proposal = proposalResult.rows[0];
    const ingredients = proposal.ingredients?.split(',').map(i => i.trim()) || [];

    // 🔹 Partecipanti con allergie
    const participantsResult = await db.query(`
      SELECT u.id, u.first_name, u.last_name, a.name AS allergy
      FROM event_participants ep
      JOIN users u ON ep.user_id = u.id
      LEFT JOIN user_allergies ua ON ua.user_id = u.id
      LEFT JOIN allergies a ON a.id = ua.allergy_id
      WHERE ep.event_id = $1
    `, [proposal.event_id]);

    const participantMap = {};

    participantsResult.rows.forEach(p => {
      if (!participantMap[p.id]) {
        participantMap[p.id] = {
          id: p.id,
          name: p.first_name,
          surname: p.last_name,
          restrictions: []
        };
      }

      if (p.allergy) {
        participantMap[p.id].restrictions.push({
          type: 'allergy',
          ingredient: p.allergy
        });
      }
    });

    const participants = Object.values(participantMap);

    return res.json({
      id: proposal.id,
      title: proposal.title,
      description: proposal.description,
      image: proposal.image_url,
      ingredients,
      author: proposal.author_name,
      category: proposal.category_name,
      mostVoted: false, // puoi aggiornare se vuoi fare la logica
      hasAllergen: false, // opzionale
      participants
    });
  } catch (err) {
    console.error('❌ Error fetching proposal:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;