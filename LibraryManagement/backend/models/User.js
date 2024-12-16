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
});

export default User;
