import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Create a new user (Sign-Up)
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Create the user
    const newUser = await User.create({
      username,
      email,
      password,
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
    // Find the user
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Compare passwords
    if (password !== user.password) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    res.status(200).json({ message: 'Login successful!', user });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Login failed. Try again.' });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

// Update a user by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Update the user's fields
    user.username = username || user.username;
    user.email = email || user.email;
    if (password) {
      user.password = password; // Directly assign the new password
    }

    await user.save();

    res.status(200).json({ message: 'User updated successfully!', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user.' });
  }
});

// Delete a user by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    await user.destroy();

    res.status(200).json({ message: 'User deleted successfully!' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user.' });
  }
});

export default router;
