const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  name: String,
  gender: String,
  maritalStatus: String,
  sharingRoom: String,
  phoneNumber: String,
  email: String,
  attendants: [{
    name: String,
    gender: String,
  }],
  ageBracket: String,
  volunteerOpportunities: [String],
  eventDetails: {
    description: String,
    included: String,
  },
});

module.exports = mongoose.model('Registration', registrationSchema);
