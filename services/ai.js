

require("dotenv").config();

const Groq = require('groq-sdk');

if (!process.env.GROQ_API_KEY) {
  throw new Error("❌ GROQ_API_KEY manquante dans .env");
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Modèle Groq ultra-rapide (gratuit)
const MODEL = 'llama-3.3-70b-versatile';

// ===========================
// ANALYSER LE CV
// ===========================
async function analyzeCV(cvText) {
  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [{
      role: 'user',
      content: `Analyse ce CV et réponds UNIQUEMENT en JSON valide, sans texte avant ou après, sans backticks.

CV:
${cvText}

Format JSON attendu:
{
  "skills": ["liste des compétences techniques"],
  "experience": "junior ou mid ou senior",
  "education": "niveau d'études",
  "languages": ["langues parlées"],
  "jobTitles": ["postes correspondant au profil"],
  "summary": "résumé professionnel en 2 phrases"
}`
    }],
    max_tokens: 1000,
    temperature: 0.2
  });

  const text = response.choices[0].message.content.trim()
    .replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(text);
}

// ===========================
// CALCULER SCORE MATCHING
// ===========================
async function calculateMatchScore(cvAnalysis, jobDescription) {
  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [{
      role: 'user',
      content: `Compare ce profil avec cette offre d'emploi. Réponds UNIQUEMENT en JSON valide, sans backticks.

PROFIL:
- Compétences: ${cvAnalysis.skills.join(', ')}
- Expérience: ${cvAnalysis.experience}
- Formation: ${cvAnalysis.education}

OFFRE:
${jobDescription}

Format JSON attendu:
{
  "score": 85,
  "reasons": ["raison 1", "raison 2"],
  "missing": ["compétence manquante"]
}`
    }],
    max_tokens: 500,
    temperature: 0.1
  });

  const text = response.choices[0].message.content.trim()
    .replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(text);
}

// ===========================
// GÉNÉRER LETTRE DE MOTIVATION
// ===========================
async function generateCoverLetter(cvAnalysis, job, language = 'fr') {
  const langInstruction =
    language === 'ar' ? 'Écris en arabe (عربي)' :
    language === 'en' ? 'Write in English' :
    'Écris en français';

  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [{
      role: 'user',
      content: `${langInstruction}. Génère une lettre de motivation professionnelle et personnalisée.

PROFIL DU CANDIDAT:
- Résumé: ${cvAnalysis.summary}
- Compétences: ${cvAnalysis.skills.join(', ')}
- Expérience: ${cvAnalysis.experience}
- Formation: ${cvAnalysis.education}

POSTE VISÉ:
- Titre: ${job.title}
- Entreprise: ${job.company}
- Lieu: ${job.location}
- Description: ${job.description || 'Non fournie'}

Génère une lettre professionnelle, naturelle, personnalisée.
3 paragraphes maximum. Pas de formules génériques.
Commence directement par "Madame, Monsieur," (ou équivalent selon la langue).
Ne mets pas de balises, juste le texte de la lettre.`
    }],
    max_tokens: 800,
    temperature: 0.7
  });

  return response.choices[0].message.content.trim();
}

module.exports = { analyzeCV, calculateMatchScore, generateCoverLetter };
