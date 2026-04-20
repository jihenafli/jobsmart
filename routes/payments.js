const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const auth = require('../controllers/authMiddleware');
const User = require('../models/User');

const PLANS = {
  basic:   { price: 1000, limit: 10,     name: 'Basic' },    // 10€
  pro:     { price: 2500, limit: 50,     name: 'Pro' },      // 25€
  premium: { price: 5000, limit: 999999, name: 'Premium' }   // 50€
};

// POST /api/payments/create-checkout — Créer une session de paiement
router.post('/create-checkout', auth, async (req, res) => {
  try {
    const { plan } = req.body;
    if (!PLANS[plan]) return res.status(400).json({ error: 'Plan invalide' });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: req.user.email,
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: `JobSmart AI — Plan ${PLANS[plan].name}`,
            description: `${PLANS[plan].limit} candidatures par mois`
          },
          unit_amount: PLANS[plan].price,
          recurring: { interval: 'month' }
        },
        quantity: 1
      }],
      success_url: `${process.env.FRONTEND_URL}/dashboard?payment=success&plan=${plan}`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing`,
      metadata: { userId: req.user._id.toString(), plan }
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/payments/webhook — Webhook Stripe (après paiement)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { userId, plan } = session.metadata;

    await User.findByIdAndUpdate(userId, {
      plan,
      applicationsLimit: PLANS[plan].limit,
      applicationsUsed: 0,
      stripeCustomerId: session.customer
    });

    console.log(`✅ Plan ${plan} activé pour l'utilisateur ${userId}`);
  }

  res.json({ received: true });
});

// GET /api/payments/plans — Liste des plans
router.get('/plans', (req, res) => {
  res.json({
    free:    { price: 0,  limit: 1,      features: ['1 candidature/mois', 'Analyse CV IA', 'Matching offres'] },
    basic:   { price: 10, limit: 10,     features: ['10 candidatures/mois', 'Tout du plan gratuit', 'Priorité support'] },
    pro:     { price: 25, limit: 50,     features: ['50 candidatures/mois', 'Tout du plan Basic', 'Lettres premium IA'] },
    premium: { price: 50, limit: 999999, features: ['Illimité', 'Tout du plan Pro', 'Dashboard analytics'] }
  });
});

module.exports = router;
