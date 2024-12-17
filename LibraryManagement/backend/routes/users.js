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
        { email, role: 'librarian' }, // Crée un token JWT avec le rôle "librarian"
        'your_jwt_secret',
        { expiresIn: '1h' }
      );
    
      return res.status(200).json({
        message: 'Login successful as librarian!',
        token, // Envoie le token JWT
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
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header missing or malformed' });
  }  

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');

    if (decoded.role === 'librarian') {
      return res.status(200).json({
        username: 'Librarian Admin',
        email: 'librarian_admin@gmail.com',
        role: 'librarian',
      });
    }

    const user = await User.findByPk(decoded.id, {
      attributes: ['username', 'email', 'address', 'phoneNumber', 'borrowedBooks'],
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error fetching profile:', err.message);
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
});

router.get("/members", async (req, res) => {
    try {
      const members = await User.findAll({
        attributes: ["id", "username", "email", "address", "phoneNumber", "borrowedBooks"],
      });
  
      res.status(200).json(members);
    } catch (error) {
      console.error("Error fetching members:", error.message);
      res.status(500).json({ error: "Failed to load members." });
    }
  });
  
  
  router.get("/email/:id", async (req, res) => {
    const userId = req.params.id;
  
    try {
      const user = await User.findByPk(userId, {
        attributes: ["email"], // Récupère uniquement l'email
      });
  
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
  
      res.status(200).json({ email: user.email });
    } catch (error) {
      console.error("Error fetching user email:", error);
      res.status(500).json({ error: "Failed to fetch user email." });
    }
  });
  
  router.put("/update/:id", async (req, res) => {
    const { id } = req.params;
    const { username, email, address, phoneNumber } = req.body;
  
    try {
      console.log("Incoming request body:", req.body); // Affiche les données reçues
      console.log("Updating user with ID:", id);
  
      const user = await User.findByPk(id);
      if (!user) return res.status(404).json({ error: "User not found." });
  
      // Mise à jour des informations utilisateur
      user.username = username || user.username;
      user.email = email || user.email;
      user.address = address || user.address;
      user.phoneNumber = phoneNumber || user.phoneNumber;
  
      console.log("Updated user object before save:", user);
      await user.save();
  
      res.status(200).json({ message: "User updated successfully.", user });
    } catch (error) {
      console.error("Error updating user:", error); // Log complet de l'erreur
      res.status(500).json({ error: "Failed to update user information.", details: error.message });
    }
  });
  
  
  
  // Mettre à jour le nombre de livres empruntés
router.put('/update-borrowedBooks/:id', async (req, res) => {
  const { id } = req.params; // Récupère l'ID de l'utilisateur dans les paramètres de la requête
  const { borrowedBooks } = req.body; // Récupère la nouvelle valeur depuis le body

  try {
      // Rechercher l'utilisateur dans la base de données
      const user = await User.findByPk(id);

      if (!user) {
          return res.status(404).json({ error: "User not found." });
      }

      // Mettre à jour le champ borrowedBooks
      user.borrowedBooks = borrowedBooks;
      await user.save();

      res.status(200).json({ message: "Borrowed books updated successfully.", user });
  } catch (error) {
      console.error("Error updating borrowedBooks:", error);
      res.status(500).json({ error: "Failed to update borrowedBooks." });
  }
});

  router.put("/finalize-borrow", async (req, res) => {
    const { borrowedCount } = req.body; // Nombre de livres empruntés
    const token = req.headers.authorization?.split(" ")[1];
  
    if (!token) {
      console.error("Token missing");
      return res.status(401).json({ error: "Unauthorized access. Token missing." });
    }
  
    try {
      const decoded = jwt.verify(token, "your_jwt_secret");
      console.log("Decoded token:", decoded);
  
      const user = await User.findByPk(decoded.id);
      if (!user) {
        console.error("User not found with ID:", decoded.id);
        return res.status(404).json({ error: "User not found." });
      }
  
      console.log("Current borrowedBooks:", user.borrowedBooks);
      console.log("Books to borrow:", borrowedCount);
  
      // Mise à jour du nombre de livres empruntés
      user.borrowedBooks += borrowedCount;
      await user.save();
  
      console.log("Updated borrowedBooks:", user.borrowedBooks);
      res.status(200).json({
        message: `Borrowed ${borrowedCount} books successfully.`,
        borrowedBooks: user.borrowedBooks,
      });
    } catch (error) {
      console.error("Error during finalize borrow:", error.message);
      res.status(500).json({ error: "Failed to finalize borrow." });
    }
  });
  router.delete("/delete/:id", async (req, res) => {
    const { id } = req.params; // Récupération de l'ID de l'utilisateur à supprimer
  
    try {
      console.log(`Attempting to delete user with ID: ${id}`);
      const user = await User.findByPk(id); // Recherche de l'utilisateur dans la base de données
  
      if (!user) {
        return res.status(404).json({ error: "User not found." }); // Si l'utilisateur n'existe pas
      }
  
      await user.destroy(); // Suppression de l'utilisateur
      console.log(`User with ID: ${id} successfully deleted.`);
      res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
      console.error("Error deleting user:", error.message);
      res.status(500).json({ error: "Failed to delete user." });
    }
  });
  
  
  
export default router;