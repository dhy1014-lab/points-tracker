// src/lib/cardCredits.js
// Card credit database — update this file and redeploy to refresh known credits.
// Credits are auto-populated when a matching card is added.
// Last updated: 2026-06-19

export const CARD_DATA_DATE = '2026-06-19'

// Each card has: name (canonical), network, issuer, and credits array
// Credits: { name, amount, cadence, category, notes }
export const CARD_DATABASE = [
  // ── Amex ──
  {
    name: 'Amex Platinum',
    issuer: 'Amex', network: 'Amex',
    credits: [
      { name: '$200 Airline Incidental Credit', amount: 200, cadence: 'Annual', category: 'Airline incidental', notes: 'Select one airline; covers fees (checked bags, seat upgrades, in-flight food). Calendar year.' },
      { name: '$200 Hotel Credit', amount: 200, cadence: 'Annual', category: 'Hotel', notes: 'Prepaid bookings via Amex Travel for Fine Hotels + Resorts or The Hotel Collection (min 2 nights).' },
      { name: '$240 Digital Entertainment Credit', amount: 20, cadence: 'Monthly', category: 'Streaming/Digital', notes: 'Disney+, Hulu, ESPN+, Peacock, The New York Times, SiriusXM. Must enroll.' },
      { name: '$155 Walmart+ Credit', amount: 12.95, cadence: 'Monthly', category: 'Shopping', notes: 'Covers monthly Walmart+ membership (~$12.95/mo). Must enroll.' },
      { name: '$300 Equinox Credit', amount: 25, cadence: 'Monthly', category: 'Other', notes: 'Equinox gym memberships or Equinox+ app. Must enroll.' },
      { name: '$200 Uber Cash', amount: 15, cadence: 'Monthly', category: 'Rideshare', notes: '$15/month + $20 in December = $200/year. Uber and Uber Eats only. Must add card to Uber.' },
      { name: '$100 Saks Fifth Avenue Credit', amount: 50, cadence: 'Semi-annual', category: 'Shopping', notes: '$50 Jan-Jun, $50 Jul-Dec. Must enroll. In-store or saks.com.' },
      { name: 'Global Entry / TSA PreCheck Credit', amount: 100, cadence: 'One-time', category: 'Travel', notes: 'Up to $120 for Global Entry (includes PreCheck) every 4.5 years.' },
      { name: 'Clear Plus Credit', amount: 189, cadence: 'Annual', category: 'Travel', notes: 'Full CLEAR Plus annual membership reimbursed. Must enroll.' },
    ]
  },
  {
    name: 'Amex Gold',
    issuer: 'Amex', network: 'Amex',
    credits: [
      { name: '$120 Dining Credit', amount: 10, cadence: 'Monthly', category: 'Dining', notes: 'Grubhub, The Cheesecake Factory, Goldbelly, Wine.com, Five Guys, Milk Bar. Must enroll.' },
      { name: '$120 Uber Cash', amount: 10, cadence: 'Monthly', category: 'Rideshare', notes: '$10/month for Uber and Uber Eats. Must add Amex Gold to Uber app.' },
      { name: '$100 Resy Credit', amount: 50, cadence: 'Semi-annual', category: 'Dining', notes: '$50 Jan-Jun, $50 Jul-Dec. At US Resy restaurants. Must enroll.' },
      { name: '$84 Dunkin\' Credit', amount: 7, cadence: 'Monthly', category: 'Dining', notes: '$7/month at Dunkin\'. Must enroll.' },
    ]
  },
  {
    name: 'Amex Blue Cash Preferred',
    issuer: 'Amex', network: 'Amex',
    credits: [
      { name: '$84 Disney Bundle Credit', amount: 7, cadence: 'Monthly', category: 'Streaming/Digital', notes: 'Disney Bundle (Disney+, Hulu, ESPN+). Statement credit after purchase. Must enroll.' },
      { name: '$120 Equinox+ Credit', amount: 10, cadence: 'Monthly', category: 'Other', notes: 'Equinox+ digital fitness app only. Must enroll.' },
    ]
  },
  {
    name: 'Amex Business Platinum',
    issuer: 'Amex', network: 'Amex',
    credits: [
      { name: '$400 Dell Credit', amount: 200, cadence: 'Semi-annual', category: 'Shopping', notes: '$200 Jan-Jun, $200 Jul-Dec. Dell.com purchases for business. Must enroll.' },
      { name: '$360 Indeed Credit', amount: 90, cadence: 'Quarterly', category: 'Other', notes: '$90/quarter for Indeed job postings. Must enroll.' },
      { name: '$150 Adobe Credit', amount: 150, cadence: 'Annual', category: 'Streaming/Digital', notes: 'Adobe Creative Cloud annual subscription. Must enroll.' },
      { name: '$120 Wireless Credit', amount: 10, cadence: 'Monthly', category: 'Other', notes: '$10/month for US wireless phone provider bills. Must enroll.' },
      { name: 'Global Entry / TSA PreCheck Credit', amount: 120, cadence: 'One-time', category: 'Travel', notes: 'Up to $120 for Global Entry every 4.5 years.' },
      { name: 'Clear Plus Credit', amount: 189, cadence: 'Annual', category: 'Travel', notes: 'Full CLEAR Plus annual membership.' },
    ]
  },
  {
    name: 'Amex Green',
    issuer: 'Amex', network: 'Amex',
    credits: [
      { name: '$189 Clear Plus Credit', amount: 189, cadence: 'Annual', category: 'Travel', notes: 'Full CLEAR Plus annual membership reimbursed.' },
      { name: '$100 LoungeBuddy Credit', amount: 100, cadence: 'Annual', category: 'Travel', notes: 'Airport lounge access via LoungeBuddy app.' },
    ]
  },

  // ── Chase ──
  {
    name: 'Chase Sapphire Reserve',
    issuer: 'Chase', network: 'Visa',
    credits: [
      { name: '$300 Travel Credit', amount: 300, cadence: 'Annual', category: 'Travel', notes: 'Automatically applies to first travel purchases each cardmember year. Very broad definition of travel.' },
      { name: 'Global Entry / TSA PreCheck Credit', amount: 100, cadence: 'One-time', category: 'Travel', notes: 'Up to $120 for Global Entry every 4 years.' },
      { name: '$60 DoorDash Credit', amount: 5, cadence: 'Monthly', category: 'Dining', notes: '$5/month on DoorDash. Must add card to DoorDash.' },
      { name: 'Lyft Pink Credit', amount: 60, cadence: 'Annual', category: 'Rideshare', notes: 'Complimentary Lyft Pink All Access membership (~$199 value). Must link card.' },
    ]
  },
  {
    name: 'Chase Sapphire Preferred',
    issuer: 'Chase', network: 'Visa',
    credits: [
      { name: '$50 Hotel Credit', amount: 50, cadence: 'Annual', category: 'Hotel', notes: 'Hotels booked through Chase Travel portal. Applied as statement credit each cardmember year.' },
      { name: '$10 Dining Credit', amount: 10, cadence: 'Monthly', category: 'Dining', notes: 'Participating partners via Chase Offers. Check Chase app for current partners.' },
    ]
  },
  {
    name: 'Chase Freedom Flex',
    issuer: 'Chase', network: 'Mastercard',
    credits: [
      { name: 'Cell Phone Protection', amount: 800, cadence: 'One-time', category: 'Other', notes: 'Up to $800/claim, $1,000/year, $50 deductible. Pay monthly phone bill with card.' },
    ]
  },
  {
    name: 'Chase United Explorer',
    issuer: 'Chase', network: 'Visa',
    credits: [
      { name: 'Global Entry / TSA PreCheck Credit', amount: 100, cadence: 'One-time', category: 'Travel', notes: 'Up to $120 for Global Entry every 4 years.' },
      { name: 'First Checked Bag Free', amount: 35, cadence: 'One-time', category: 'Airline incidental', notes: 'Free first checked bag for cardholder + 1 companion on United flights. Must book with card.' },
    ]
  },
  {
    name: 'Chase United Club Infinite',
    issuer: 'Chase', network: 'Visa',
    credits: [
      { name: 'United Club Membership', amount: 650, cadence: 'Annual', category: 'Travel', notes: 'Complimentary United Club lounge membership for cardholder + eligible guests.' },
      { name: 'First & Second Checked Bag Free', amount: 70, cadence: 'One-time', category: 'Airline incidental', notes: 'Free first + second checked bags for cardholder + 1 companion on United.' },
      { name: 'Global Entry / TSA PreCheck Credit', amount: 100, cadence: 'One-time', category: 'Travel', notes: 'Up to $120 for Global Entry every 4 years.' },
    ]
  },
  {
    name: 'Chase IHG One Rewards Premier',
    issuer: 'Chase', network: 'Mastercard',
    credits: [
      { name: 'Annual Free Night Certificate', amount: 150, cadence: 'Annual', category: 'Hotel', notes: 'Free night at IHG property up to 40K points value each anniversary year.' },
      { name: 'Global Entry / TSA PreCheck Credit', amount: 100, cadence: 'One-time', category: 'Travel', notes: 'Up to $120 for Global Entry every 4 years.' },
    ]
  },
  {
    name: 'Chase Marriott Bonvoy Boundless',
    issuer: 'Chase', network: 'Visa',
    credits: [
      { name: 'Annual Free Night Certificate', amount: 150, cadence: 'Annual', category: 'Hotel', notes: 'Free night at Marriott property up to 35K points each anniversary year.' },
    ]
  },
  {
    name: 'Chase World of Hyatt',
    issuer: 'Chase', network: 'Visa',
    credits: [
      { name: 'Annual Free Night Certificate', amount: 150, cadence: 'Annual', category: 'Hotel', notes: 'Free night at Category 1-4 Hyatt each anniversary year. Earn second free night at $15K spend.' },
    ]
  },
  {
    name: 'Chase Southwest Rapid Rewards Plus',
    issuer: 'Chase', network: 'Visa',
    credits: [
      { name: '$75 Southwest Travel Credit', amount: 75, cadence: 'Annual', category: 'Travel', notes: 'Applied to Southwest purchases each anniversary year.' },
      { name: 'Anniversary Bonus Points', amount: 3000, cadence: 'Annual', category: 'Travel', notes: '3,000 bonus points each account anniversary.' },
    ]
  },

  // ── Citi ──
  {
    name: 'Citi Strata Premier',
    issuer: 'Citi', network: 'Mastercard',
    credits: [
      { name: '$100 Hotel Savings Benefit', amount: 100, cadence: 'Annual', category: 'Hotel', notes: '$100 off a single hotel stay of $500+ booked via CitiTravel.com each calendar year.' },
    ]
  },
  {
    name: 'Citi Prestige',
    issuer: 'Citi', network: 'Mastercard',
    credits: [
      { name: '$250 Travel Credit', amount: 250, cadence: 'Annual', category: 'Travel', notes: 'Broad travel credit — airlines, hotels, car rentals, cruises. Calendar year.' },
      { name: 'Fourth Night Free', amount: 0, cadence: 'Annual', category: 'Hotel', notes: 'Two uses/year. Book 4+ consecutive nights via Citi Concierge, 4th night free (excl. taxes).' },
      { name: 'Global Entry / TSA PreCheck Credit', amount: 100, cadence: 'One-time', category: 'Travel', notes: 'Up to $120 for Global Entry every 5 years.' },
    ]
  },

  // ── Capital One ──
  {
    name: 'Capital One Venture X',
    issuer: 'Capital One', network: 'Visa',
    credits: [
      { name: '$300 Travel Credit', amount: 300, cadence: 'Annual', category: 'Travel', notes: 'Must book through Capital One Travel portal. Applied automatically.' },
      { name: '10,000 Anniversary Bonus Miles', amount: 100, cadence: 'Annual', category: 'Travel', notes: '10,000 bonus miles (~$100 value) each account anniversary.' },
      { name: 'Global Entry / TSA PreCheck Credit', amount: 100, cadence: 'One-time', category: 'Travel', notes: 'Up to $120 for Global Entry every 4 years.' },
    ]
  },
  {
    name: 'Capital One Venture',
    issuer: 'Capital One', network: 'Visa',
    credits: [
      { name: 'Global Entry / TSA PreCheck Credit', amount: 100, cadence: 'One-time', category: 'Travel', notes: 'Up to $120 for Global Entry every 4 years.' },
    ]
  },

  // ── Bilt ──
  {
    name: 'Bilt Mastercard',
    issuer: 'Wells Fargo', network: 'Mastercard',
    credits: [
      { name: 'Rent Payments — No Fee', amount: 0, cadence: 'Monthly', category: 'Other', notes: 'Pay rent with no transaction fee (most cards charge 2-3%). Must make 5+ transactions/statement to earn points.' },
      { name: 'Rent Day Perks (1st of month)', amount: 0, cadence: 'Monthly', category: 'Other', notes: 'Double points on most categories on the 1st of each month (not rent). Rotating transfer bonuses.' },
    ]
  },

  // ── Wells Fargo ──
  {
    name: 'Wells Fargo Autograph Journey',
    issuer: 'Wells Fargo', network: 'Visa',
    credits: [
      { name: '$50 Airline Credit', amount: 50, cadence: 'Annual', category: 'Airline incidental', notes: 'Statement credit on airline purchases each anniversary year.' },
    ]
  },

  // ── Airline cards ──
  {
    name: 'Delta SkyMiles Reserve',
    issuer: 'Amex', network: 'Amex',
    credits: [
      { name: 'Delta Sky Club Access', amount: 650, cadence: 'Annual', category: 'Travel', notes: 'Unlimited Sky Club visits when flying Delta. Also access to Amex Centurion lounges on Delta flights.' },
      { name: 'Annual Companion Certificate', amount: 300, cadence: 'Annual', category: 'Travel', notes: 'Domestic First Class, Comfort+, or Main Cabin companion certificate each anniversary year.' },
      { name: 'Global Entry / TSA PreCheck Credit', amount: 100, cadence: 'One-time', category: 'Travel', notes: 'Up to $120 for Global Entry every 4.5 years.' },
      { name: 'First Checked Bag Free', amount: 35, cadence: 'One-time', category: 'Airline incidental', notes: 'Free first checked bag for cardholder + 8 companions on Delta flights. Must book with card.' },
    ]
  },
  {
    name: 'Delta SkyMiles Gold',
    issuer: 'Amex', network: 'Amex',
    credits: [
      { name: 'First Checked Bag Free', amount: 35, cadence: 'One-time', category: 'Airline incidental', notes: 'Free first checked bag for cardholder + 8 companions on Delta flights.' },
      { name: '$100 Delta Flight Credit', amount: 100, cadence: 'Annual', category: 'Travel', notes: 'After $10,000 spend in a calendar year.' },
    ]
  },
  {
    name: 'Alaska Airlines Visa Signature',
    issuer: 'Bank of America', network: 'Visa',
    credits: [
      { name: 'Annual Companion Fare', amount: 0, cadence: 'Annual', category: 'Travel', notes: 'Buy one ticket, bring a companion from $122 (taxes/fees) each account anniversary. Must spend $6K/year.' },
      { name: 'Free Checked Bag', amount: 35, cadence: 'One-time', category: 'Airline incidental', notes: 'Free first checked bag for cardholder + 6 companions on Alaska flights.' },
    ]
  },
  {
    name: 'Southwest Rapid Rewards Priority',
    issuer: 'Chase', network: 'Visa',
    credits: [
      { name: '$75 Southwest Travel Credit', amount: 75, cadence: 'Annual', category: 'Travel', notes: 'Automatically applied to Southwest purchases each anniversary year.' },
      { name: '7,500 Anniversary Bonus Points', amount: 75, cadence: 'Annual', category: 'Travel', notes: '7,500 bonus points each account anniversary (~$75 value toward Companion Pass).' },
      { name: '4 Upgraded Boardings', amount: 30, cadence: 'Annual', category: 'Travel', notes: '4 upgraded boardings per year when available.' },
    ]
  },

  // ── Hotel cards ──
  {
    name: 'Marriott Bonvoy Brilliant',
    issuer: 'Amex', network: 'Amex',
    credits: [
      { name: '$300 Dining Credit', amount: 25, cadence: 'Monthly', category: 'Dining', notes: '$25/month for dining worldwide. Calendar month.' },
      { name: 'Annual Free Night Award', amount: 300, cadence: 'Annual', category: 'Hotel', notes: 'Free night up to 85K Marriott points each anniversary year.' },
      { name: 'Global Entry / TSA PreCheck Credit', amount: 100, cadence: 'One-time', category: 'Travel', notes: 'Up to $120 for Global Entry every 4.5 years.' },
    ]
  },
  {
    name: 'Marriott Bonvoy Bevy',
    issuer: 'Amex', network: 'Amex',
    credits: [
      { name: '$150 Marriott Credit', amount: 150, cadence: 'Annual', category: 'Hotel', notes: 'Marriott Bonvoy hotel purchases. Calendar year.' },
      { name: 'Annual Free Night Award', amount: 150, cadence: 'Annual', category: 'Hotel', notes: 'Free night up to 50K Marriott points each anniversary year at $15K spend.' },
    ]
  },
  {
    name: 'Hilton Honors Aspire',
    issuer: 'Amex', network: 'Amex',
    credits: [
      { name: '$200 Airline Incidental Credit', amount: 50, cadence: 'Quarterly', category: 'Airline incidental', notes: '$50/quarter. Select one airline. Covers fees (seat upgrades, checked bags, in-flight purchases).' },
      { name: '$400 Hilton Resort Credit', amount: 200, cadence: 'Semi-annual', category: 'Hotel', notes: '$200 Jan-Jun, $200 Jul-Dec at Hilton Resorts worldwide.' },
      { name: 'Annual Free Night Certificate', amount: 300, cadence: 'Annual', category: 'Hotel', notes: 'One free weekend night at most Hilton properties each anniversary year.' },
      { name: 'Global Entry / TSA PreCheck Credit', amount: 100, cadence: 'One-time', category: 'Travel', notes: 'Up to $120 for Global Entry every 4.5 years.' },
    ]
  },
  {
    name: 'Hilton Honors Surpass',
    issuer: 'Amex', network: 'Amex',
    credits: [
      { name: '$50 Quarterly Credit', amount: 50, cadence: 'Quarterly', category: 'Other', notes: '$50 quarterly on eligible Hilton purchases.' },
    ]
  },
  {
    name: 'Hyatt Credit Card',
    issuer: 'Chase', network: 'Visa',
    credits: [
      { name: 'Annual Free Night Certificate (Cat 1-4)', amount: 150, cadence: 'Annual', category: 'Hotel', notes: 'Free night at Category 1-4 Hyatt each anniversary year.' },
      { name: 'Second Free Night Certificate (Cat 1-4)', amount: 150, cadence: 'Annual', category: 'Hotel', notes: 'Earned after $15,000 spend in a calendar year.' },
    ]
  },
  {
    name: 'IHG One Rewards Traveler',
    issuer: 'Chase', network: 'Mastercard',
    credits: [
      { name: 'Fourth Night Free', amount: 0, cadence: 'Annual', category: 'Hotel', notes: 'When redeeming points for 4+ consecutive nights, 4th night is free (unlimited uses).' },
    ]
  },
]

// Fuzzy search — returns cards with a match score, sorted by relevance
export function searchCards(query) {
  if (!query || query.length < 2) return []
  const q = query.toLowerCase()
  const results = CARD_DATABASE.map(card => {
    const name = card.name.toLowerCase()
    const issuer = card.issuer.toLowerCase()
    // Exact match scores highest, then starts-with, then contains
    let score = 0
    if (name === q) score = 100
    else if (name.startsWith(q)) score = 80
    else if (name.includes(q)) score = 60
    else if (issuer.includes(q)) score = 30
    else {
      // word-level partial match
      const words = q.split(' ').filter(Boolean)
      const matches = words.filter(w => name.includes(w) || issuer.includes(w))
      score = (matches.length / words.length) * 50
    }
    return { ...card, score }
  }).filter(c => c.score > 0)

  results.sort((a, b) => b.score - a.score)
  return results.slice(0, 6)
}

export function getCardByName(name) {
  const n = name.toLowerCase().trim()
  return CARD_DATABASE.find(c => c.name.toLowerCase() === n) || null
}
