import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Book = sequelize.define('Book', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    genre: {
        type: DataTypes.STRING,
    },
    publishedYear: {
        type: DataTypes.INTEGER,
    },
    summary : {
        type : DataTypes.TEXT,
        allowNull: false,
    },
    cover: { 
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: 'https://via.placeholder.com/150x220?text=Pas+de+couverture',
    },
    isAvailable:  {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    tableName: 'books',
});

export default Book;