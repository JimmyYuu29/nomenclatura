import express from 'express';
import cors from 'cors';
import { initDatabase } from './db.js';
import { router } from './routes.js';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

app.use(cors());
app.use(express.json());
app.use('/api', router);

const dbReady = initDatabase();
if (!dbReady) {
  console.warn('Database not available — API will report db: false');
}

app.listen(PORT, () => {
  console.log(`Nomenclatura API running on port ${PORT}`);
});
