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
}, {
  timestamps: true, // Cette option active la gestion automatique des colonnes `createdAt` et `updatedAt`
  // Vous pouvez aussi spécifier le nom des colonnes si vous le souhaitez
  // createdAt: 'createdAt',
  // updatedAt: 'updatedAt',
});

export default User;
