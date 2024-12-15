import express from 'express';
import { Op } from 'sequelize'; // Pour les filtres avancés
import Book from '../models/Book.js';

const router = express.Router();

// Récupérer tous les livres (avec filtres optionnels par auteur ou genre)
router.get('/', async (req, res) => {
    const { author, genre } = req.query; // Paramètres de requête pour le filtrage

    try {
        let whereClause = {}; // Initialisation de la clause WHERE pour les filtres

        if (author) {
            whereClause.author = { [Op.iLike]: `%${author}%` }; // Insensible à la casse
        }

        if (genre) {
            whereClause.genre = { [Op.iLike]: `%${genre}%` }; // Insensible à la casse
        }

        // Récupère les livres avec les filtres
        const books = await Book.findAll({ where: whereClause });
        res.json(books.map((book) => book.toJSON())); // Sérialisation et renvoi des livres
    } catch (error) {
        console.error("Erreur lors de la récupération des livres :", error);
        res.status(500).send("Erreur du serveur");
    }
});

// Récupérer un livre par son titre formaté (par exemple, "le-grand-livre")
const denormalizeTitle = (title) => {
    return title
        .split('-') // Remplace les tirets par des espaces
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Met la première lettre en majuscule
        .join(' '); // Rejoint les mots avec des espaces
};

router.get('/:title', async (req, res) => {
    const { title } = req.params;

    try {
        const formattedTitle = denormalizeTitle(title); // Convertit le titre formaté
        const book = await Book.findOne({ where: { title: formattedTitle } });

        if (!book) {
            return res.status(404).send('Livre non trouvé');
        }

        res.json(book.toJSON());
    } catch (error) {
        console.error("Erreur lors de la récupération du livre :", error);
        res.status(500).send("Erreur du serveur");
    }
});


// Ajouter un nouveau livre
router.post('/', async (req, res) => {
    const { title, author, genre, publishedYear, summary, cover } = req.body;

    try {
        const newBook = await Book.create({
            title,
            author,
            genre,
            publishedYear,
            summary,
            cover,
        });
        res.status(201).json({ success: true, book: newBook });
    } catch (error) {
        console.error("Erreur lors de l'ajout du livre :", error);
        res.status(500).send("Erreur du serveur");
    }
});

// Mettre à jour un livre
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, author, genre, publishedYear, summary, cover } = req.body;

    try {
        const book = await Book.findByPk(id);

        if (!book) {
            return res.status(404).send('Livre non trouvé');
        }

        // Mise à jour des informations du livre
        book.title = title || book.title;
        book.author = author || book.author;
        book.genre = genre || book.genre;
        book.publishedYear = publishedYear || book.publishedYear;
        book.summary = summary || book.summary;
        book.cover = cover || book.cover;

        await book.save();
        res.json({ success: true, book });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du livre :", error);
        res.status(500).send("Erreur du serveur");
    }
});

// Supprimer un livre
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const book = await Book.findByPk(id);

        if (!book) {
            return res.status(404).send('Livre non trouvé');
        }

        await book.destroy();
        res.json({ success: true, message: 'Livre supprimé avec succès' });
    } catch (error) {
        console.error("Erreur lors de la suppression du livre :", error);
        res.status(500).send("Erreur du serveur");
    }
});

export default router;
