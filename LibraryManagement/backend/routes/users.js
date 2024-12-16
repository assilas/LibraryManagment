import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Create a new user (Sign-Up)
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        role: 'member', // Définit le rôle par défaut à "member"
      });
  
      res.status(201).json({ message: 'User created successfully!', user: newUser });
    } catch (error) {
      console.error('Error during user creation:', error);
      res.status(500).json({ error: 'Failed to create user. Try again.' });
    }
  });
  
  

// Login user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Vérification si c'est un libraire
        if (email === 'librarian_admin@gmail.com' && password === 'librarian123') {
            return res.status(200).json({
                token: 'some-jwt-token',
                role: 'librarian',
                message: 'Login successful as librarian!'
            });
        }

        // Recherche d'un utilisateur dans la base de données
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Vérification du mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        // Si ce n'est pas un libraire, on continue avec l'utilisateur normal
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role }, // Inclure le rôle dans le token
            'your_jwt_secret',
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful!',
            token,
            user: { username: user.username, role: user.role }, // Inclure le rôle dans la réponse
        });
    } catch (error) {
        console.error('Error during login:', error);
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