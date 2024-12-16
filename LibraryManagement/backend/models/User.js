import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // Chemin vers ta configuration Sequelize

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Contrainte unique
        validate: {
            notEmpty: { msg: 'Username cannot be empty.' },
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Contrainte unique
        validate: {
            isEmail: { msg: 'Must be a valid email address.' },
            notEmpty: { msg: 'Email cannot be empty.' },
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Password cannot be empty.' },
        },
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'member',
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true, // Peut être ajouté plus tard
        validate: {
            len: {
                args: [5, 255],
                msg: 'Address must be between 5 and 255 characters.',
            },
        },
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true, // Peut être ajouté plus tard
        validate: {
            is: {
                args: /^[0-9]{10,15}$/, // Regex pour les numéros de téléphone
                msg: 'Phone number must be between 10 and 15 digits.',
            },
        },
    },
    borrowedBooks: {
        type: DataTypes.INTEGER,
        defaultValue: 0, // Exemple pour le nombre de livres empruntés
      },
});

export default User;
