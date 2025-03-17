require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Registration = require('./models/Registration');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Timeout handling
app.use((req, res, next) => {
  req.setTimeout(5000); // Set request timeout to 5 seconds
  res.setTimeout(5000); // Set response timeout to 5 seconds
  next();
});

// MongoDB Connection
const atlasUrl = process.env.MONGODB_URI;

mongoose.connect(atlasUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 10, // Increase connection pool size
})
.then(() => {
  console.log('Connected to MongoDB Atlas');
})
.catch((err) => {
  console.error('Failed to connect to MongoDB Atlas:', err);
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// POST Endpoint
app.post('/register', async (req, res) => {
  const { name, gender, maritalStatus, sharingRoom, phoneNumber, email, attendants, ageBracket, volunteerOpportunities, eventDetails } = req.body;
  if (!name || !phoneNumber || !email) {
    return res.status(400).send('Name, phone number, and email are required');
  }

  const registration = new Registration({
    name,
    gender,
    maritalStatus,
    sharingRoom,
    phoneNumber,
    email,
    attendants,
    ageBracket,
    volunteerOpportunities,
    eventDetails,
  });

  try {
    await registration.save();
    res.status(201).send('Registration Successful!');
  } catch (error) {
    res.status(500).send('Error saving registration');
  }
});

// GET Endpoint

app.get('/registrations', async (req, res) => {
    try {
      const registrations = await Registration.find();
      res.status(200).json(registrations);
    } catch (error) {
      res.status(500).send('Error fetching registrations');
    }
  });

// PUT Endpoint
app.put('/registrations/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const updatedRegistration = await Registration.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedRegistration) {
      return res.status(404).send('Registration not found');
    }
    res.status(200).json(updatedRegistration);
  } catch (error) {
    res.status(500).send('Error updating registration');
  }
});

module.exports = app;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
