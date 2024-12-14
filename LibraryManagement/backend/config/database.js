import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('library', 'root', 'c@millEchen14', {
  host: 'localhost',
  dialect: 'mysql',
});

export default sequelize;
