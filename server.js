require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.set('trust proxy', 1);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API Routes
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend/dist')));
  // ... after your other app.use('/api/...') routes

// =================================================================
// START: TEMPORARY ADMIN CREATION ROUTE (CORRECTED FOR USERNAME)
// =================================================================
const Admin = require('./models/AdminUser.js'); 
const bcrypt = require('bcryptjs');

app.get('/api/setup/create-new-admin', async (req, res) => {
  try {
    // --- CONFIGURE YOUR NEW ADMIN DETAILS ---
    // IMPORTANT: Use a username that does NOT already exist
    const adminUsername = 'admin'; //  
    const adminPassword = 'M@@rul@123'; // <<<  
    // ------------------------------------

    const adminExists = await Admin.findOne({ username: adminUsername });

    if (adminExists) {
      return res.status(400).send('This new username already exists. Please choose a different one.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const admin = await Admin.create({
      username: adminUsername,
      password: hashedPassword,
    });

    if (admin) {
      res.status(201).json({
        _id: admin._id,
        username: admin.username,
        message: 'NEW admin user created successfully! PLEASE REMOVE THIS ROUTE NOW.',
      });
    } else {
      res.status(400).send('Invalid admin data.');
    }
  } catch (error) {
    res.status(500).send('Server Error: ' + error.message);
  }
});
// =================================================================
// END: TEMPORARY ADMIN CREATION ROUTE
// =================================================================

// ... your static file serving block starts here

  // For any route that is not an API route, send the React app's index.html
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
  });
}
app.get('/', (req, res) => {
    res.send('Welcome to the Maarula Classes Question Bank API!');
});
// MongoDB Connection and Server Start
const PORT = process.env.PORT || 3001;
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
    })
    .catch((err) => console.error('❌ MongoDB Connection Error:', err.message));
// updated security 
// require('dotenv').config();
// require('express-async-errors'); // Must be at the top

// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const path = require('path');

// // Validate environment variables
// if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
//     console.error("FATAL ERROR: MONGODB_URI or JWT_SECRET is not defined.");
//     process.exit(1);
// }

// const app = express();

// // Secure CORS Configuration
// const allowedOrigins = process.env.NODE_ENV === 'production'
//     ? [process.env.PRODUCTION_URL]
//     : ['http://localhost:5173']; // Your React dev server port

// const corsOptions = {
//     origin: (origin, callback) => {
//         if (!origin || allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     }
// };
// app.use(cors(corsOptions));
// app.use(express.json());

// // API Routes
// app.use('/api/questions', require('./routes/questionRoutes'));
// app.use('/api/admin', require('./routes/adminRoutes'));
// app.use('/api/reports', require('./routes/reportRoutes'));
// // (Add your sitemap route here if you implement it)

// // Serve Frontend in Production
// if (process.env.NODE_ENV === 'production') {
//     const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'dist');
//     app.use(express.static(frontendBuildPath));
//     app.get('*', (req, res) => {
//         res.sendFile(path.resolve(frontendBuildPath, 'index.html'));
//     });
// }

// // Centralized Error Handler
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({ message: 'An unexpected error occurred!' });
// });

// // DB Connection & Server Start
// const PORT = process.env.PORT || 3001;
// const startServer = async () => {
//     try {
//         await mongoose.connect(process.env.MONGODB_URI);
//         console.log('✅ Connected to MongoDB');
//         app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
//     } catch (err) {
//         console.error('❌ MongoDB Connection Error:', err.message);
//         process.exit(1);
//     }
// };

// startServer();

// // Graceful Shutdown
// process.on('SIGINT', async () => {
//     await mongoose.connection.close();
//     console.log('MongoDB connection closed due to application termination.');
//     process.exit(0);
// });
