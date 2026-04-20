const express = require('express');
const router = express.Router();
const auth = require('../controllers/authMiddleware');
const CV = require('../models/CV');
const { searchJobs } = require('../services/scraping');
const { calculateMatchScore } = require('../services/ai');

// POST /api/jobs/search — Rechercher des offres compatibles
router.post('/search', auth, async (req, res) => {
  try {
    const { jobTypes, location = 'France', platforms = ['Indeed'] } = req.body;

    // Récupérer le CV de l'utilisateur
    const cv = await CV.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
    if (!cv) return res.status(404).json({ error: 'Upload ton CV d\'abord' });

    // Construire les requêtes de recherche
    const queries = jobTypes?.length > 0
      ? jobTypes
      : cv.analysis.jobTitles?.slice(0, 3) || ['Développeur'];

    // Rechercher les offres
    const rawJobs = await searchJobs(queries, location, 30);

    // Calculer le score de matching pour chaque offre
    const scoredJobs = await Promise.all(
      rawJobs.map(async (job) => {
        try {
          const matchData = await calculateMatchScore(
            cv.analysis,
            `${job.title} chez ${job.company}: ${job.description}`
          );
          return { ...job, matchScore: matchData.score, matchReasons: matchData.reasons, missingSkills: matchData.missing };
        } catch {
          return { ...job, matchScore: Math.floor(Math.random() * 30) + 50 };
        }
      })
    );

    // Filtrer les offres avec score >= 60 et trier
    const filteredJobs = scoredJobs
      .filter(j => j.matchScore >= 60)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 15);

    res.json({
      total: filteredJobs.length,
      jobs: filteredJobs
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
