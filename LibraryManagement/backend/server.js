import express from 'express';
import sequelize from './config/database.js'; // Assurez-vous que ce chemin est correct
import booksRoutes from './routes/books.js';
import usersRoutes from './routes/users.js';
import cors from 'cors';
import User from './models/User.js';

const app = express(); // Déclare app avant de l'utiliser

app.use(cors({
    origin: "http://localhost:5173", // URL de ton frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));
    // Permet les requêtes provenant de n'importe quelle origine

const PORT = 3001;
const HOST = 'http://localhost'; // Vous pouvez remplacer localhost par une IP si nécessaire

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Synchronisation de la base de données
(async () => {
    try {
      await sequelize.authenticate();
      console.log('Database connected.');
      await sequelize.sync({ force: false });
      console.log('Models synchronized.');
    } catch (error) {
      console.error('Database connection failed:', error);
    }
  })();

// Routes
app.use('/books', booksRoutes);
app.use('/users', usersRoutes);

// Exemple de route
app.get('/', (req, res) => {
  res.send('API de gestion de bibliothèque.');
});

// Endpoint pour récupérer les membres

  
// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur en cours d’exécution sur ${HOST}:${PORT}`);
});
