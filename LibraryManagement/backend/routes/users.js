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
    const { username, email, password, firstName, lastName, phoneNumber, address } = req.body;

    try {
        const newUser = await User.create({ username, email, password, firstName, lastName, phoneNumber, address });
        res.status(201).json({ success: true, user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur du serveur');
    }
});

// Mettre à jour un utilisateur
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { username, email, password, firstName, lastName, phoneNumber, address } = req.body;

    try {
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).send('Utilisateur non trouvé');
        }

        // Mise à jour des informations de l'utilisateur
        user.username = username || user.username;
        user.email = email || user.email;
        user.password = password || user.password;
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.address = address || user.address;

        await user.save();

        res.json({ success: true, user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur du serveur');
    }
});

// Supprimer un utilisateur
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).send('Utilisateur non trouvé');
        }

        await user.destroy();

        res.json({ success: true, message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur du serveur');
    }
});

export default router;
