import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
});

async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
        await sequelize.sync({ alter: true });
        console.log('Models synchronized with the database.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

connectDB();

export default sequelize;