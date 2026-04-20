const nodemailer = require('nodemailer');

// Configuration Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // App Password Gmail (pas ton vrai mot de passe)
  }
});

// ===========================
// ENVOYER UNE CANDIDATURE
// ===========================
async function sendApplication({ to, candidateName, jobTitle, company, coverLetter }) {
  const subject = `Candidature — ${jobTitle} chez ${company}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0; font-size: 14px; color: #666;">Candidature envoyée via JobSmart AI</p>
      </div>
      
      <div style="white-space: pre-line; line-height: 1.7; font-size: 15px;">
${coverLetter}
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="font-size: 13px; color: #999;">
          ${candidateName}<br/>
          Envoyé depuis <a href="#" style="color: #1D9E75;">JobSmart AI</a>
        </p>
      </div>
    </div>
  `;

  const info = await transporter.sendMail({
    from: `"${candidateName}" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    text: coverLetter
  });

  return info;
}

// ===========================
// ENVOYER EMAIL DE BIENVENUE
// ===========================
async function sendWelcomeEmail({ to, name }) {
  await transporter.sendMail({
    from: `"JobSmart AI" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Bienvenue sur JobSmart AI 🚀',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1D9E75;">Bienvenue ${name} !</h2>
        <p>Ton compte JobSmart AI est créé. Tu peux maintenant :</p>
        <ul>
          <li>Uploader ton CV</li>
          <li>Trouver des offres compatibles</li>
          <li>Envoyer ta première candidature automatique</li>
        </ul>
        <a href="${process.env.FRONTEND_URL}" 
           style="background: #1D9E75; color: white; padding: 12px 24px; 
                  border-radius: 6px; text-decoration: none; display: inline-block; margin-top: 16px;">
          Commencer maintenant
        </a>
      </div>
    `
  });
}

module.exports = { sendApplication, sendWelcomeEmail };
