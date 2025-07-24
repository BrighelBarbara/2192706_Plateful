const express = require('express');
const router = express.Router();
const db = require('../db');

// 📥 Aggiungi un partecipante a un evento
router.post('/', async (req, res) => {
  const { event_id, user_id, status } = req.body;

  if (!event_id || !user_id) {
    return res.status(400).json({ message: 'Missing event_id or user_id' });
  }

  try {
    const result = await db.query(
      `INSERT INTO event_participants (event_id, user_id, status)
       VALUES ($1, $2, $3)
       ON CONFLICT (event_id, user_id) DO UPDATE SET status = $3
       RETURNING *`,
      [event_id, user_id, status || 'pending']
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error adding participant:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 📤 Ottieni tutti i partecipanti di un evento
router.get('/:eventId', async (req, res) => {
  const { eventId } = req.params;

  try {
    const result = await db.query(
      `SELECT u.id, u.first_name, u.last_name, ep.status, ep.joined_at
       FROM event_participants ep
       JOIN users u ON ep.user_id = u.id
       WHERE ep.event_id = $1`,
      [eventId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching participants:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 🔄 Cambia lo stato di partecipazione (es. accettato/rifiutato)
router.put('/', async (req, res) => {
  const { event_id, user_id, status } = req.body;

  if (!event_id || !user_id || !['pending', 'accepted', 'refused'].includes(status)) {
    return res.status(400).json({ message: 'Missing or invalid fields' });
  }

  try {
    const result = await db.query(
      `UPDATE event_participants
       SET status = $3
       WHERE event_id = $1 AND user_id = $2
       RETURNING *`,
      [event_id, user_id, status]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Participant not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error updating participant status:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ❌ Rimuovi un partecipante
router.delete('/', async (req, res) => {
  const { event_id, user_id } = req.body;

  if (!event_id || !user_id) {
    return res.status(400).json({ message: 'Missing event_id or user_id' });
  }

  try {
    await db.query(
      `DELETE FROM event_participants WHERE event_id = $1 AND user_id = $2`,
      [event_id, user_id]
    );

    res.json({ message: 'Participant removed' });
  } catch (err) {
    console.error('❌ Error deleting participant:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
