import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('library', 'root', 'ROOT', {
  host: 'localhost',
  dialect: 'mysql',
});

export default sequelize;
