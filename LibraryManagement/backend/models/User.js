import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  firstName: { // Prénom
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: { // Nom
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: { // Numéro de téléphone
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: /^[0-9]{10}$/, // Vérifie que le numéro contient exactement 10 chiffres
    },
  },
  address: { // Adresse postale
    type: DataTypes.STRING,
    allowNull: true, 
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false,
  },
}, {
  timestamps: true,
});

export default User;
