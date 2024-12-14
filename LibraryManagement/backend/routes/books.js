import express from 'express';
import Book from '../models/Book.js';

const router = express.Router();

// Récupérer tous les livres
router.get('/', async (req, res) => {
    try {
        const books = await Book.findAll();
        const booksData = books.map(book => book.toJSON());  // Sérialiser les données
        res.json(booksData);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur du serveur');
    }
});

// Fonction pour convertir un titre formaté en URL vers une forme lisible (ex: "le-grand-livre" => "Le Grand Livre")
const denormalizeTitle = (title) => {
    return title
      .split('-')       // Remplace les tirets par des espaces
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))  // Met la première lettre en majuscule
      .join(' ');       // Rejoint les mots avec des espaces
  };
  
  // Récupérer un livre par son titre formaté
  router.get('/:title', async (req, res) => {
    const { title } = req.params;
  
    try {
      const formattedTitle = denormalizeTitle(title);  // Convertit le titre formaté en version normale
      const book = await Book.findOne({ where: { title: formattedTitle } });
  
      if (!book) {
        return res.status(404).send('Livre non trouvé');
      }
  
      res.json(book);
    } catch (error) {
      console.error(error);
      res.status(500).send('Erreur du serveur');
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
            summary,  // Ajout du résumé
            cover      // Ajout de la couverture
        });
        res.status(201).json({ success: true, book: newBook });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur du serveur');
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
        book.summary = summary || book.summary; // Mise à jour du résumé
        book.cover = cover || book.cover;       // Mise à jour de la couverture

        await book.save();

        res.json({ success: true, book });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur du serveur');
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
        console.error(error);
        res.status(500).send('Erreur du serveur');
    }
});

export default router;
