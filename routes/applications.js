const express = require('express');
const router = express.Router();
const auth = require('../controllers/authMiddleware');
const Application = require('../models/Application');
const CV = require('../models/CV');
const User = require('../models/User');
const { generateCoverLetter } = require('../services/ai');
const { sendApplication } = require('../services/email');

// POST /api/applications/generate — Générer une lettre de motivation
router.post('/generate', auth, async (req, res) => {
  try {
    const { job, language = 'fr' } = req.body;

    const cv = await CV.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
    if (!cv) return res.status(404).json({ error: 'CV introuvable' });

    const coverLetter = await generateCoverLetter(cv.analysis, job, language);

    res.json({ coverLetter });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/applications/send — Envoyer une candidature
router.post('/send', auth, async (req, res) => {
  try {
    const { job, coverLetter, recipientEmail } = req.body;
    const user = req.user;

    // Vérifier la limite du plan
    if (user.applicationsUsed >= user.applicationsLimit) {
      return res.status(403).json({
        error: 'Limite atteinte',
        message: `Plan ${user.plan}: ${user.applicationsLimit} candidature(s) maximum. Passe au plan Pro!`,
        upgradeRequired: true
      });
    }

    // Envoyer l'email
    if (recipientEmail) {
      await sendApplication({
        to: recipientEmail,
        candidateName: user.name,
        jobTitle: job.title,
        company: job.company,
        coverLetter
      });
    }

    // Sauvegarder la candidature
    const application = await Application.create({
      userId: user._id,
      job,
      matchScore: job.matchScore,
      coverLetter,
      status: 'sent',
      emailSentAt: new Date()
    });

    // Incrémenter le compteur
    await User.findByIdAndUpdate(user._id, { $inc: { applicationsUsed: 1 } });

    res.json({
      message: 'Candidature envoyée avec succès !',
      application: application._id,
      remaining: user.applicationsLimit - user.applicationsUsed - 1
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/applications — Historique des candidatures
router.get('/', auth, async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
