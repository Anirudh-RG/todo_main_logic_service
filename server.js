const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); 
const todoRoutes = require('./routes/todoRoutes');
const { createTodoTableIfNotExists } = require('./models/todoModel');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.get('/todos/health', (req, res) => {
  res.status(200).json({ message: 'Todo Service is healthy' });
});
app.use('/todos', todoRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, async () => {
  await createTodoTableIfNotExists();
  console.log(`Todo Service running on port ${PORT}`);
});
