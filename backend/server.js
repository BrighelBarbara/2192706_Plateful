//crea il server express e collega le rotte API

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

//rotta api signup
const userRoutes = require('./routes/users');
//rotta api login 
const authRoutes = require('./routes/auth');
//rotta api eventi 
const eventRoutes = require('./routes/events');
//rotta proposte 
const proposalRoutes = require('./routes/proposals')
//rotta partecipanti
const participantRoutes = require('./routes/participants');

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/proposals', proposalRoutes)
app.use('/api/participants', participantRoutes);

app.get('/', (req, res) => {
  res.send('Server Plateful attivo!');
});

app.listen(PORT, () => {
  console.log(`✅ Server avviato su http://localhost:${PORT}`);
});
