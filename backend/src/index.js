const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const testRoutes = require('./routes/test');
const categoriesRoutes = require('./routes/categories');
const jokesRoutes = require('./routes/jokes');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ ok: true, service: 'backend', status: 'up' });
});

app.use('/api/test', testRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/jokes', jokesRoutes);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: 'Ruta no encontrada' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Backend escuchando en puerto ${PORT}`);
});
