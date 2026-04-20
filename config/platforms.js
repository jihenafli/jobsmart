// ===========================
// PLATEFORMES PAR PAYS
// ===========================
const PLATFORMS_BY_COUNTRY = {
    TN: {
      label: 'Tunisie',
      platforms: [
        { name: 'Tunisie Travail', url: 'https://www.tunisietravail.net', searchUrl: 'https://www.tunisietravail.net/?s=' },
        { name: 'Emploi.com.tn', url: 'https://www.emploi.com.tn', searchUrl: 'https://www.emploi.com.tn/recherche?q=' },
        { name: 'Keejob', url: 'https://www.keejob.com', searchUrl: 'https://www.keejob.com/offres-emploi/?search=' },
        { name: 'Indeed Tunisie', url: 'https://tn.indeed.com', searchUrl: 'https://tn.indeed.com/jobs?q=' },
        { name: 'Bayt Tunisie', url: 'https://www.bayt.com/fr/tunisie', searchUrl: 'https://www.bayt.com/fr/tunisie/jobs/?q=' },
        { name: 'LinkedIn', url: 'https://www.linkedin.com', searchUrl: 'https://www.linkedin.com/jobs/search/?keywords=' },
      ]
    },
    FR: {
      label: 'France',
      platforms: [
        { name: 'Indeed France', url: 'https://fr.indeed.com', searchUrl: 'https://fr.indeed.com/jobs?q=' },
        { name: 'LinkedIn', url: 'https://www.linkedin.com', searchUrl: 'https://www.linkedin.com/jobs/search/?keywords=' },
        { name: 'Welcome to the Jungle', url: 'https://www.welcometothejungle.com', searchUrl: 'https://www.welcometothejungle.com/fr/jobs?query=' },
        { name: 'Glassdoor', url: 'https://www.glassdoor.fr', searchUrl: 'https://www.glassdoor.fr/Offres-emploi/index.htm?sc.keyword=' },
        { name: 'Pôle Emploi', url: 'https://candidat.pole-emploi.fr', searchUrl: 'https://candidat.pole-emploi.fr/offres/recherche?motsCles=' },
        { name: 'APEC', url: 'https://www.apec.fr', searchUrl: 'https://www.apec.fr/candidat/recherche-emploi.html/emploi?motsCles=' },
      ]
    },
    DE: {
      label: 'Allemagne',
      platforms: [
        { name: 'Indeed Allemagne', url: 'https://de.indeed.com', searchUrl: 'https://de.indeed.com/jobs?q=' },
        { name: 'LinkedIn', url: 'https://www.linkedin.com', searchUrl: 'https://www.linkedin.com/jobs/search/?keywords=' },
        { name: 'StepStone', url: 'https://www.stepstone.de', searchUrl: 'https://www.stepstone.de/jobs/' },
        { name: 'XING', url: 'https://www.xing.com', searchUrl: 'https://www.xing.com/jobs/search?q=' },
      ]
    },
    CA: {
      label: 'Canada',
      platforms: [
        { name: 'Indeed Canada', url: 'https://ca.indeed.com', searchUrl: 'https://ca.indeed.com/jobs?q=' },
        { name: 'LinkedIn', url: 'https://www.linkedin.com', searchUrl: 'https://www.linkedin.com/jobs/search/?keywords=' },
        { name: 'Job Bank', url: 'https://www.jobbank.gc.ca', searchUrl: 'https://www.jobbank.gc.ca/jobsearch/jobsearch?searchstring=' },
        { name: 'Workopolis', url: 'https://www.workopolis.com', searchUrl: 'https://www.workopolis.com/jobsearch/find-jobs?ak=' },
      ]
    },
    MA: {
      label: 'Maroc',
      platforms: [
        { name: 'Rekrute', url: 'https://www.rekrute.com', searchUrl: 'https://www.rekrute.com/offres.html?s=' },
        { name: 'Indeed Maroc', url: 'https://ma.indeed.com', searchUrl: 'https://ma.indeed.com/jobs?q=' },
        { name: 'Emploi.ma', url: 'https://www.emploi.ma', searchUrl: 'https://www.emploi.ma/index.php/job/search?q=' },
        { name: 'LinkedIn', url: 'https://www.linkedin.com', searchUrl: 'https://www.linkedin.com/jobs/search/?keywords=' },
      ]
    },
    OTHER: {
      label: 'International',
      platforms: [
        { name: 'LinkedIn', url: 'https://www.linkedin.com', searchUrl: 'https://www.linkedin.com/jobs/search/?keywords=' },
        { name: 'Indeed', url: 'https://www.indeed.com', searchUrl: 'https://www.indeed.com/jobs?q=' },
        { name: 'Glassdoor', url: 'https://www.glassdoor.com', searchUrl: 'https://www.glassdoor.com/Job/jobs.htm?sc.keyword=' },
        { name: 'Remote.co', url: 'https://remote.co', searchUrl: 'https://remote.co/remote-jobs/search/?search_keywords=' },
      ]
    }
  };
  
  // ===========================
  // DOMAINES PROFESSIONNELS
  // ===========================
  const DOMAINS = [
    {
      category: 'Informatique & Tech',
      icon: '💻',
      jobs: ['Développeur Web', 'Développeur Mobile', 'Data Scientist', 'ML Engineer', 'DevOps', 'Cybersécurité', 'UI/UX Designer', 'Chef de Projet IT', 'Administrateur Système', 'Développeur IA']
    },
    {
      category: 'Santé & Médical',
      icon: '🏥',
      jobs: ['Médecin', 'Infirmier(e)', 'Pharmacien(ne)', 'Biologiste', 'Radiologue', 'Kiné', 'Dentiste', 'Sage-femme']
    },
    {
      category: 'Finance & Comptabilité',
      icon: '💰',
      jobs: ['Comptable', 'Auditeur', 'Analyste Financier', 'Contrôleur de Gestion', 'Fiscaliste', 'Trésorier', 'Expert Comptable']
    },
    {
      category: 'Marketing & Communication',
      icon: '📢',
      jobs: ['Marketing Digital', 'Community Manager', 'Chef de Produit', 'Responsable Communication', 'SEO/SEA', 'Brand Manager']
    },
    {
      category: 'Ingénierie & Industrie',
      icon: '⚙️',
      jobs: ['Ingénieur Mécanique', 'Ingénieur Électrique', 'Ingénieur Civil', 'Ingénieur Industriel', 'Technicien de Maintenance', 'Ingénieur Qualité']
    },
    {
      category: 'Éducation & Formation',
      icon: '📚',
      jobs: ['Enseignant', 'Formateur', 'Conseiller Pédagogique', 'Directeur Pédagogique', 'Coach']
    },
    {
      category: 'Commerce & Vente',
      icon: '🛒',
      jobs: ['Commercial', 'Responsable Vente', 'Account Manager', 'Business Developer', 'Chargé de Clientèle']
    },
    {
      category: 'RH & Management',
      icon: '👥',
      jobs: ['RH Généraliste', 'Recruteur', 'Responsable RH', 'DRH', 'Office Manager', 'Assistant RH']
    }
  ];
  
  // ===========================
  // NIVEAUX
  // ===========================
  const LEVELS = [
    { value: 'stage', label: 'Stage' },
    { value: 'junior', label: 'Junior (0-2 ans)' },
    { value: 'mid', label: 'Confirmé (2-5 ans)' },
    { value: 'senior', label: 'Senior (5+ ans)' },
    { value: 'lead', label: 'Lead / Manager' },
    { value: 'freelance', label: 'Freelance' }
  ];
  
  // ===========================
  // PAYS DISPONIBLES
  // ===========================
  const COUNTRIES = [
    { code: 'TN', label: '🇹🇳 Tunisie' },
    { code: 'FR', label: '🇫🇷 France' },
    { code: 'DE', label: '🇩🇪 Allemagne' },
    { code: 'CA', label: '🇨🇦 Canada' },
    { code: 'MA', label: '🇲🇦 Maroc' },
    { code: 'OTHER', label: '🌍 International' }
  ];
  
  module.exports = { PLATFORMS_BY_COUNTRY, DOMAINS, LEVELS, COUNTRIES };
  