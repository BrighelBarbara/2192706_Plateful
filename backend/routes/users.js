// per signup  

const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

// POST /api/users - Registrazione
router.post('/', async (req, res) => {
  const { username, email, password, dietaryRestrictions } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // controlla se l'email è già registrata
    const userExists = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    // hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // inserisci l'utente
    const result = await db.query(
      `INSERT INTO users (email, password_hash, first_name, last_name)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [email, hashedPassword, username, '']
    );

    const userId = result.rows[0].id;

    // gestisci allergie solo se presenti
    if (Array.isArray(dietaryRestrictions) && dietaryRestrictions.length > 0) {
      for (const restriction of dietaryRestrictions) {
        // trova o crea l’allergia
        const allergyRes = await db.query(
          'INSERT INTO allergies (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id',
          [restriction]
        );
        const allergyId = allergyRes.rows[0].id;

        await db.query(
          'INSERT INTO user_allergies (user_id, allergy_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [userId, allergyId]
        );
      }
    }

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error in registration:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
