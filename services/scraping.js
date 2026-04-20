const puppeteer = require('puppeteer');
const { PLATFORMS_BY_COUNTRY } = require('../config/platforms');

async function scrapeIndeed(query, countryCode = 'TN', limit = 20) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36');

  const baseUrls = { TN: 'https://tn.indeed.com', FR: 'https://fr.indeed.com', MA: 'https://ma.indeed.com', CA: 'https://ca.indeed.com', DE: 'https://de.indeed.com', OTHER: 'https://www.indeed.com' };
  const baseUrl = baseUrls[countryCode] || baseUrls.OTHER;

  try {
    await page.goto(`${baseUrl}/jobs?q=${encodeURIComponent(query)}&sort=date`, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForSelector('a[data-jk]', { timeout: 10000 }).catch(() => {});

    const jobs = await page.evaluate((limit, baseUrl) => {
      const cards = document.querySelectorAll('a[data-jk], .job_seen_beacon');
      const results = [];
      for (let i = 0; i < Math.min(cards.length, limit); i++) {
        const card = cards[i];
        const title = (card.querySelector('.jobTitle span[title]')?.title || card.querySelector('.jobTitle')?.textContent || '').trim();
        const company = (card.querySelector('[data-testid="company-name"]')?.textContent || card.querySelector('.companyName')?.textContent || '').trim();
        const location = (card.querySelector('[data-testid="text-location"]')?.textContent || card.querySelector('.companyLocation')?.textContent || '').trim();
        const salary = (card.querySelector('.salary-snippet-container')?.textContent || 'Non précisé').trim();
        const jobId = card.getAttribute('data-jk') || card.closest('[data-jk]')?.getAttribute('data-jk') || '';
        const description = (card.querySelector('.job-snippet')?.textContent || '').trim();
        if (title && company) results.push({ title, company, location, salary, url: jobId ? `${baseUrl}/viewjob?jk=${jobId}` : '', description, platform: 'Indeed', companyEmail: null });
      }
      return results;
    }, limit, baseUrl);

    await browser.close();
    return jobs.length > 0 ? jobs : getMockJobs(query, countryCode);
  } catch (error) {
    await browser.close();
    return getMockJobs(query, countryCode);
  }
}

function getMockJobs(query, countryCode) {
  const mocks = {
    TN: [
      { title: query, company: 'Vermeg', location: 'Tunis, Tunisie', salary: '1500-2500 DT/mois', url: 'https://tn.indeed.com', description: `Poste ${query} chez Vermeg.`, platform: 'Indeed', companyEmail: 'rh@vermeg.com' },
      { title: `${query} Junior`, company: 'Telnet', location: 'Ariana, Tunisie', salary: '1200-1800 DT/mois', url: 'https://tn.indeed.com', description: `Poste ${query} chez Telnet.`, platform: 'Keejob', companyEmail: 'recrutement@telnet.tn' },
      { title: `${query} Stage`, company: 'Sofrecom', location: 'Tunis (Hybrid)', salary: '500-800 DT/mois', url: 'https://tn.indeed.com', description: `Stage ${query} chez Sofrecom.`, platform: 'Emploi.com.tn', companyEmail: null },
    ],
    FR: [
      { title: `${query} Senior`, company: 'Capgemini', location: 'Paris, France', salary: '55k-75k €/an', url: 'https://fr.indeed.com', description: `Poste ${query} chez Capgemini.`, platform: 'Indeed', companyEmail: 'recrutement@capgemini.com' },
      { title: `${query} Junior`, company: 'Sopra Steria', location: 'Lyon, France', salary: '38k-48k €/an', url: 'https://fr.indeed.com', description: `Poste ${query} chez Sopra Steria.`, platform: 'Welcome to the Jungle', companyEmail: null },
    ],
    MA: [
      { title: query, company: 'Maroc Telecom', location: 'Casablanca, Maroc', salary: '8k-15k MAD/mois', url: 'https://ma.indeed.com', description: `Poste ${query} chez IAM.`, platform: 'Rekrute', companyEmail: 'rh@iam.ma' },
      { title: `${query} Junior`, company: 'OCP Group', location: 'Rabat, Maroc', salary: '7k-12k MAD/mois', url: 'https://ma.indeed.com', description: `Poste ${query} chez OCP.`, platform: 'Emploi.ma', companyEmail: null },
    ],
    OTHER: [
      { title: `${query} Remote`, company: 'Remote Company', location: 'Full Remote', salary: '40k-70k €/an', url: 'https://www.indeed.com', description: `Poste remote ${query}.`, platform: 'Indeed', companyEmail: null },
    ]
  };
  return mocks[countryCode] || mocks.OTHER;
}

async function searchJobs(queries, countryCode = 'TN', limit = 20) {
  const allJobs = [];
  for (const query of queries.slice(0, 3)) {
    try {
      const jobs = await scrapeIndeed(query, countryCode, Math.ceil(limit / queries.length));
      allJobs.push(...jobs);
    } catch (err) {
      allJobs.push(...getMockJobs(query, countryCode));
    }
  }
  const seen = new Set();
  return allJobs.filter(job => {
    const key = `${job.title}-${job.company}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

module.exports = { searchJobs, getMockJobs };










// // ===========================
// // SERVICE DE SCRAPING D'OFFRES
// // ===========================
// // Note: Ce service utilise des APIs publiques et du scraping léger.
// // Pour la production, utilise les APIs officielles quand disponibles.

// const puppeteer = require('puppeteer');

// // Scraper Indeed
// async function scrapeIndeed(query, location = 'France', limit = 20) {
//   const browser = await puppeteer.launch({
//     headless: 'new',
//     args: ['--no-sandbox', '--disable-setuid-sandbox']
//   });

//   const page = await browser.newPage();
//   await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

//   const url = `https://fr.indeed.com/jobs?q=${encodeURIComponent(query)}&l=${encodeURIComponent(location)}`;

//   try {
//     await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
//     await page.waitForSelector('.job_seen_beacon', { timeout: 10000 });

//     const jobs = await page.evaluate((limit) => {
//       const cards = document.querySelectorAll('.job_seen_beacon');
//       const results = [];

//       for (let i = 0; i < Math.min(cards.length, limit); i++) {
//         const card = cards[i];
//         const title = card.querySelector('.jobTitle span')?.textContent?.trim() || '';
//         const company = card.querySelector('.companyName')?.textContent?.trim() || '';
//         const location = card.querySelector('.companyLocation')?.textContent?.trim() || '';
//         const salary = card.querySelector('.salary-snippet')?.textContent?.trim() || 'Non précisé';
//         const url = card.querySelector('a')?.href || '';
//         const description = card.querySelector('.job-snippet')?.textContent?.trim() || '';

//         if (title && company) {
//           results.push({ title, company, location, salary, url, description, platform: 'Indeed' });
//         }
//       }
//       return results;
//     }, limit);

//     await browser.close();
//     return jobs;
//   } catch (error) {
//     await browser.close();
//     console.error('Erreur scraping Indeed:', error.message);
//     return getMockJobs(query); // Fallback sur données mock
//   }
// }

// // Données de démonstration si scraping échoue
// function getMockJobs(query) {
//   return [
//     {
//       title: `${query} - Senior`,
//       company: 'TechCorp France',
//       location: 'Paris, France',
//       salary: '45 000 - 65 000 €/an',
//       url: 'https://fr.indeed.com',
//       description: `Nous recherchons un ${query} expérimenté pour rejoindre notre équipe.`,
//       platform: 'Indeed'
//     },
//     {
//       title: `${query} Junior`,
//       company: 'StartupParis',
//       location: 'Lyon, France',
//       salary: '35 000 - 45 000 €/an',
//       url: 'https://fr.indeed.com',
//       description: `Poste de ${query} junior dans une startup en croissance.`,
//       platform: 'Indeed'
//     },
//     {
//       title: `${query} - Remote`,
//       company: 'GlobalTech',
//       location: 'Full Remote',
//       salary: '50 000 - 70 000 €/an',
//       url: 'https://fr.indeed.com',
//       description: `Opportunité remote pour un profil ${query}.`,
//       platform: 'Indeed'
//     }
//   ];
// }

// // Recherche multi-plateforme
// async function searchJobs(queries, location, limit = 20) {
//   const allJobs = [];

//   for (const query of queries) {
//     try {
//       const jobs = await scrapeIndeed(query, location, Math.ceil(limit / queries.length));
//       allJobs.push(...jobs);
//     } catch (err) {
//       console.error(`Erreur pour "${query}":`, err.message);
//       allJobs.push(...getMockJobs(query));
//     }
//   }

//   // Dédoublonner par titre + entreprise
//   const seen = new Set();
//   return allJobs.filter(job => {
//     const key = `${job.title}-${job.company}`;
//     if (seen.has(key)) return false;
//     seen.add(key);
//     return true;
//   });
// }

// module.exports = { searchJobs, getMockJobs };
