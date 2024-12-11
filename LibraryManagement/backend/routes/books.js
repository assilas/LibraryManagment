import express from 'express';
import Book from '../models/Book.js';

const router = express.Router();

// Récupérer tous les livres
router.get('/', async (req, res) => {
    try {
        const books = await Book.findAll();
        res.json(books);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur du serveur');
    }
});

// Ajouter un nouveau livre
router.post('/', async (req, res) => {
    const { title, author, genre, publishedYear } = req.body;

    try {
        const newBook = await Book.create({ title, author, genre, publishedYear });
        res.status(201).json({ success: true, book: newBook });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur du serveur');
    }
});

export default router;
