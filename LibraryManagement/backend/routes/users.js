import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Create a new user (Sign-Up)
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must have at least 6 characters.' });
  }

  try {
    console.log('Creating user with:', { username, email });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: 'member',
    });

    res.status(201).json({
      message: 'User created successfully!',
      user: { id: newUser.id, email: newUser.email },
    });
  } catch (error) {
    console.error('Error during user creation:', error.message);
    res.status(500).json({ error: 'Failed to create user. Please try again.' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérification pour le libraire
    if (email === 'librarian_admin@gmail.com' && password === 'librarian123') {
      console.log('Librarian login successful.');

      const token = jwt.sign(
        { email, role: 'librarian' },
        'your_jwt_secret', 
        { expiresIn: '1h' }
      );

      return res.status(200).json({
        message: 'Login successful as librarian!',
        token,
        user: { username: 'Librarian Admin', role: 'librarian' },
      });
    }

    // Recherche de l'utilisateur en base de données
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      'your_jwt_secret',
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful!',
      token,
      user: { username: user.username, role: user.role },
    });
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ error: 'Login failed. Try again.' });
  }
});

// Get user profile
router.get('/profile', async (req, res) => {
  const authHeader = req.headers.authorization;

  console.log('Authorization Header Received:', authHeader);

  try {
    // Vérifie si c'est un libraire avec le token spécial
    if (authHeader === 'librarian_token') {
      console.log('Librarian token detected. Returning librarian profile.');
      return res.status(200).json({
        username: 'Librarian Admin',
        role: 'librarian',
      });
    }

    // Vérifie les utilisateurs normaux avec token JWT
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Authorization header invalid or missing.');
      return res.status(401).json({ msg: 'Authorization header missing or malformed' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Decoded Token:', token);

    const decoded = jwt.verify(token, 'your_jwt_secret');
    const user = await User.findByPk(decoded.id);

    if (!user) {
      console.log('User not found in database.');
      return res.status(404).json({ msg: 'User not found' });
    }

    res.status(200).json({
      username: user.username,
      role: user.role,
    });
  } catch (err) {
    console.error('Error during token verification:', err.message);
    res.status(401).json({ msg: 'Invalid or expired token' });
  }
});

export default router;
