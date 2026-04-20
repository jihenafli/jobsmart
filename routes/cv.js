const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const auth = require('../controllers/authMiddleware');
const CV = require('../models/CV');
const { analyzeCV } = require('../services/ai');

// Config upload (stockage mémoire, pas sur disque)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Seuls les fichiers PDF sont acceptés'));
  }
});

// POST /api/cv/upload — Uploader et analyser le CV
router.post('/upload', auth, upload.single('cv'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Aucun fichier reçu' });

    // Extraire le texte du PDF
    const pdfData = await pdfParse(req.file.buffer);
    const rawText = pdfData.text;

    if (!rawText || rawText.trim().length < 50)
      return res.status(400).json({ error: 'CV trop court ou illisible' });

    // Analyser avec IA
    const analysis = await analyzeCV(rawText);

    // Sauvegarder en base
    const cv = await CV.create({
      userId: req.user._id,
      originalName: req.file.originalname,
      rawText,
      analysis
    });

    res.json({
      message: 'CV analysé avec succès',
      cvId: cv._id,
      analysis
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/cv/my — Récupérer le CV de l'utilisateur
router.get('/my', auth, async (req, res) => {
  try {
    const cv = await CV.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
    if (!cv) return res.status(404).json({ error: 'Aucun CV trouvé' });
    res.json(cv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
