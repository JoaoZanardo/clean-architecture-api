import dotenv from 'dotenv';
dotenv.config();

export default {
    mongoUrl: process.env.MONGO_URL as string,
    mongoTestUrl: process.env.MONGO_TEST_URL as string,
    tokenScret: process.env.TOKEN_SECRET as string
}