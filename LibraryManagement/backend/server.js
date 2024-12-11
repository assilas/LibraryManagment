import express from 'express';
import sequelize from './config/database.js'; // Assurez-vous que ce chemin est correct
import User from './models/User.js';

const app = express();
const PORT = 3001;

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Synchronisation de la base de données
(async () => {
  try {
    await sequelize.authenticate(); // Vérifie la connexion à la base de données
    console.log('Connexion à la base de données réussie.');

    // Synchronisation des modèles avec la base de données
    // Utilisation de `alter: true` pour appliquer les changements sans supprimer les données
    await sequelize.sync({ alter: true });
    console.log('Les modèles sont synchronisés avec la base de données.');

  } catch (error) {
    console.error('Erreur lors de la connexion à la base de données :', error);
  }
})();

// Exemple de route
app.get('/', (req, res) => {
  res.send('API de gestion de bibliothèque.');
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur en cours d’exécution sur le port ${PORT}`);
});
