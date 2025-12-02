const express = require('express');
const cors = require('cors');
const { port } = require('./config');
const authRoutes = require('./src/routes/auth.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.listen(port, () => {
    console.log('Server listening on port 3000');
});