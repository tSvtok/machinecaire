require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./config/db');
const User = require('./models/User');
const errorHandler = require('./middlewares/errorHandler');
const swaggerDocument = require('./docs/swagger');

const app = express();
app.use(express.json());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerDocument);
});
app.get('/', (req, res) => res.redirect('/api-docs'));

// Initialisation DB et utilisateur par défaut
const init = async () => {
  await connectDB();
  try {
    const exists = await User.findOne({ email: 'admin@machine.com' });
    if (!exists) {
      await User.create({ email: 'admin@machine.com', password: 'admin123', name: 'Admin', role: 'admin' });
      console.log('Default user created: admin@machine.com / admin123');
    }
  } catch (err) {
    console.log('Default user init check skipped:', err.message);
  }
};
init();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/user'));
app.use('/api/machines', require('./routes/machine'));
app.use('/api/signalements', require('./routes/signalement'));

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT} (Swagger at http://localhost:${PORT}/api-docs)`));
}

module.exports = app;
