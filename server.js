const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
const userRoutes = require('./routes/userRoutes');
const cloudinary = require('./config/Cloudinary');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);

// Socket.io
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('send_message', (message) => {
    io.emit('receive_message', message);
  });

  socket.on('send_group_message', (message) => {
    io.emit('receive_group_message', message);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


//---------------------------------
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');

// const app = express();
// const PORT = 5000;

// // Middleware
// app.use(cors({
//   origin: 'http://10.10.10.55:5000', // Allow all origins (for development only)

// }));
// app.use(express.json());

// // MongoDB Atlas connection
// const MONGO_URI = 'mongodb+srv://anbarasan16022000:MDBanbu2000@cluster0.774m1.mongodb.net/myDatabase?retryWrites=true&w=majority&appName=Cluster0';

// mongoose.connect(MONGO_URI)
//   .then(() => console.log('Connected to MongoDB Atlas'))
//   .catch(err => console.error('Error connecting to MongoDB:', err));

// // Define a schema and model
// const userSchema = new mongoose.Schema();

// const User = mongoose.model('User', userSchema);

// // Route to get data from MongoDB
// app.get('/api/users', async (req, res) => {
//   console.log(req.headers, "--------------header----");
  
//   try {
//     const users = await User.find();
//     console.log('------user data -----',users)
//     res.json(users);
//     // res.json([
//     //   { _id: '1', name: 'John Doe', age: 30, email: 'john.doe@example.com' },
//     //   { _id: '2', name: 'Jane Doe', age: 25, email: 'jane.doe@example.com' },
//     // ]);
//   } catch (err) {
//     console.log('-----error----',err)
//     res.status(500).json({ message: err.message });
//   }
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);

// });

