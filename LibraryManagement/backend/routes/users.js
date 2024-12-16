import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Create a new user (Sign-Up)
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  // Validation manuelle de la longueur du mot de passe
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must have at least 6 characters.' });
  }

  try {
    console.log('Creating user with:', { username, email });

    // Hashage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword, // Mot de passe déjà validé
      role: 'member',
    });

    console.log('User created successfully:', newUser);
    res.status(201).json({
      message: 'User created successfully!',
      user: { id: newUser.id, email: newUser.email },
    });
  } catch (error) {
    console.error('Error during user creation:', error.errors || error.message);
    res.status(500).json({ error: 'Failed to create user. Please try again.' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', { email, password });

  try {
      // Vérification si c'est un libraire
      if (email === 'librarian_admin@gmail.com' && password === 'librarian123') {
          console.log('Librarian login successful.');
          return res.status(200).json({
              token: 'some-jwt-token',
              role: 'librarian',
              message: 'Login successful as librarian!'
          });
      }

      // Recherche de l'utilisateur
      const user = await User.findOne({ where: { email } });
      console.log('User found:', user);

      if (!user) {
          console.log('User not found.');
          return res.status(404).json({ error: 'User not found.' });
      }

      // Vérification du mot de passe
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Password match:', isMatch);

      if (!isMatch) {
          console.log('Invalid credentials.');
          return res.status(401).json({ error: 'Invalid credentials.' });
      }

      // Génération du token JWT
      const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          'your_jwt_secret',
          { expiresIn: '1h' }
      );
      console.log('Token generated:', token);

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
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ msg: 'Authorization header missing or malformed' });
    }
  
    const token = authHeader.split(' ')[1];
  
    try {
      const decoded = jwt.verify(token, 'your_jwt_secret');
      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
      res.json({ username: user.username, role: user.role });
    } catch (err) {
      console.error('Token verification failed:', err);
      res.status(401).json({ msg: 'Invalid or expired token' });
    }
  });
  

export default router;