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
    const { title, author, genre, publishedYear, summary, cover, isAvailable } = req.body; // <-- Ajout de isAvailable

    try {
        const book = await Book.findByPk(id);

        if (!book) {
            return res.status(404).send('Livre non trouvé');
        }

        // Mise à jour des informations du livre, y compris isAvailable
        book.title = title || book.title;
        book.author = author || book.author;
        book.genre = genre || book.genre;
        book.publishedYear = publishedYear || book.publishedYear;
        book.summary = summary || book.summary;
        book.cover = cover || book.cover;

        if (isAvailable !== undefined) {
            book.isAvailable = isAvailable; // Mise à jour de isAvailable si fourni
        }

        await book.save();
        res.json({ success: true, message: 'Book updated successfully.', book });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du livre :", error);
        res.status(500).send("Erreur du serveur");
    }
});



router.put('/borrow/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const book = await Book.findByPk(id);

        if (!book) {
            return res.status(404).json({ error: 'Book not found.' });
        }

        if (!book.isAvailable) {
            return res.status(400).json({ error: 'Book is already borrowed.' });
        }

        // Mettre à jour la disponibilité du livre
        book.isAvailable = false;
        await book.save();

        res.json({ success: true, message: 'Book borrowed successfully.', book });
    } catch (error) {
        console.error('Error borrowing book:', error.message);
        res.status(500).json({ error: 'Server error while borrowing the book.' });
    }
});

router.put('/return/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const book = await Book.findByPk(id);

        if (!book) {
            return res.status(404).json({ error: 'Book not found.' });
        }

        if (book.isAvailable) {
            return res.status(400).json({ error: 'Book is already available.' });
        }

        // Mettre à jour la disponibilité du livre
        book.isAvailable = true;
        await book.save();

        res.json({ success: true, message: 'Book returned successfully.', book });
    } catch (error) {
        console.error('Error returning book:', error.message);
        res.status(500).json({ error: 'Server error while returning the book.' });
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
