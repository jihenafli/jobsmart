const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cvId: { type: mongoose.Schema.Types.ObjectId, ref: 'CV' },
  job: {
    title: String,
    company: String,
    location: String,
    salary: String,
    url: String,
    platform: String,
    description: String
  },
  matchScore: { type: Number, min: 0, max: 100 },
  coverLetter: String,
  status: {
    type: String,
    enum: ['pending', 'sent', 'opened', 'replied', 'rejected'],
    default: 'pending'
  },
  emailSentAt: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', applicationSchema);
