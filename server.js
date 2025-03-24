const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// const ngrok = require('ngrok');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
// app.use(cors({ origin: 'http://10.10.10.55:5000/api/items' }));
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;
// MongoDB Atlas Connection
// const uri = "mongodb+srv://anbarasan16022000:nAImw4QqsLwOqpeG@cluster1.6f4z0.mongodb.net/DemoAppDatabase?retryWrites=true&w=majority&appName=Cluster1";
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define a Schema
const ItemSchema = new mongoose.Schema({
  name: String,
});

const Item = mongoose.model('Item', ItemSchema);

// Routes
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/forceUpdate', async (req, res) => {
  try {
    const items = {version:1.1}
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/items', async (req, res) => {
  // console.log('--->',req.body.name)
        


  const item = new Item({
    name: req.body.name,
  });

  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);

  // const url = await ngrok.connect(PORT);
  // console.log(`ngrok tunnel opened at: ${url}`);
});