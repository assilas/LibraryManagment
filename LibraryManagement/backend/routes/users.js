import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Récupérer tous les utilisateurs
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur du serveur');
    }
});

// Créer un nouvel utilisateur
router.post('/', async (req, res) => {
    const { nom, prenom, email, password } = req.body;

    try {
        const newUser = await User.create({ nom, prenom, email, password });
        res.status(201).json({ success: true, user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur du serveur');
    }
});

export default router;
