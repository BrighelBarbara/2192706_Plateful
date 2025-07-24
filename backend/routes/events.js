const express = require('express');
const router = express.Router();
const db = require('../db');

// 🟢 Crea un nuovo evento con categorie
router.post('/', async (req, res) => {
  const {
    title,
    description,
    event_date,
    event_time,
    location,
    max_participants,
    voting_deadline,
    created_by,
    categories,
    participants
  } = req.body;

  if (!title || !event_date || !created_by || !Array.isArray(categories)) {
    return res.status(400).json({ message: 'Missing required fields or categories' });
  } 

  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // 1. Crea evento
    const eventRes = await client.query(
      `INSERT INTO events
        (title, description, event_date, event_time, location, max_participants, voting_deadline, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [title, description, event_date, event_time, location, max_participants, voting_deadline, created_by]
    );

    const eventId = eventRes.rows[0].id;

    // 2. Inserisci categorie selezionate
    for (const categoryId of categories) {
      await client.query(
        `INSERT INTO event_categories (event_id, category_id)
         VALUES ($1, $2)`,
        [eventId, categoryId]
      );
    }

    // 3. Inserisci i partecipanti (se presenti)
    if (Array.isArray(participants) && participants.length > 0) {
      for (const userId of participants) {
        await client.query(
          `INSERT INTO event_participants (event_id, user_id, status)
           VALUES ($1, $2, 'accepted')`,
          [eventId, userId]
        );
      }
    }

    await client.query('COMMIT');
    res.status(201).json(eventRes.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating event with categories:', err);
    res.status(500).json({ message: 'Server error 1' });
  } finally {
    client.release();
  }
});

// 🟢 Ottieni tutti gli eventi
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT events.*, users.first_name AS creator_name
       FROM events
       JOIN users ON events.created_by = users.id
       ORDER BY event_date ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ message: 'Server error 2' });
  }
});

// 🔍 Ottieni un evento specifico per ID + categorie associate
router.get('/:id', async (req, res) => {
  const eventId = parseInt(req.params.id);

  try {
    // 1. Recupera i dati evento
    const result = await db.query('SELECT * FROM events WHERE id = $1', [eventId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const event = result.rows[0];

    // 2. Recupera le categorie selezionate
    const catRes = await db.query(`
      SELECT dc.id, dc.name
      FROM event_categories ec
      JOIN dish_categories dc ON dc.id = ec.category_id
      WHERE ec.event_id = $1
      ORDER BY dc.id
    `, [eventId]);

    event.categories = catRes.rows;
    
// 3. Partecipanti dell'evento
const partRes = await db.query(`
  SELECT u.id, u.first_name, u.last_name, u.email
  FROM event_participants ep
  JOIN users u ON ep.user_id = u.id
  WHERE ep.event_id = $1
`, [eventId]);

console.log('Partecipanti con JOIN:', partRes.rows);
event.participants = partRes.rows;
    
    res.json(event);
  } catch (err) {
    console.error('Error fetching event by ID:', err);
    res.status(500).json({ message: 'Server error 3' });
  }
});

// 🟢 Ottieni partecipanti di un evento
router.get('/:id/participants', async (req, res) => {
  const eventId = parseInt(req.params.id);

  try {
    const result = await db.query(`
      SELECT u.id, u.first_name, u.last_name, ep.status
      FROM event_participants ep
      JOIN users u ON ep.user_id = u.id
      WHERE ep.event_id = $1
    `, [eventId]);

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching participants:', err);
    res.status(500).json({ message: 'Server error 4' });
  }
});

module.exports = router;