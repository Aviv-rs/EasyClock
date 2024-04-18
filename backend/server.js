const express = require('express');
const app = express();
const http = require('http').createServer(app);
const cookieParser = require('cookie-parser');
const cors = require('cors');
let port = 3030;

const corsOptions = {
    origin: [
      'http://127.0.0.1:5173',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://localhost:3000',
    ],
    credentials: true,
  }

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());


const authRoutes = require('./api/auth/auth.routes');
const shiftRoutes = require('./api/shift/shift.routes');

app.use('/api/auth', authRoutes);
app.use('/api/shift', shiftRoutes);

http.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});