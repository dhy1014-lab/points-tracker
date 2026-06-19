// src/lib/seedPartners.js
// Run once per user to seed transfer partner reference data
import { add, getAll, update } from './db'

// Bump this date whenever PARTNERS data below is refreshed with new info
export const PARTNERS_DATA_DATE = '2026-06-19'

const PARTNERS = [
  // ── Chase Ultimate Rewards ──
  { source: 'Chase UR', partner: 'United MileagePlus', ratio: '1:1', category: 'Airline', notes: 'Best for Star Alliance; domestic from 8K, sweet spot for international' },
  { source: 'Chase UR', partner: 'Air Canada Aeroplan', ratio: '1:1', category: 'Airline', notes: 'Star Alliance; stopover awards, Lufthansa first class from 87K' },
  { source: 'Chase UR', partner: 'Air France/KLM Flying Blue', ratio: '1:1', category: 'Airline', notes: 'Monthly Promo Awards; business class to Europe regularly discounted' },
  { source: 'Chase UR', partner: 'British Airways Avios', ratio: '1:1', category: 'Airline', notes: 'Short-haul Europe from 4K Avios; also books AA/Iberia/Finnair' },
  { source: 'Chase UR', partner: 'Iberia Plus', ratio: '1:1', category: 'Airline', notes: 'OneWorld; business to Spain/Latin America can be very cheap' },
  { source: 'Chase UR', partner: 'Aer Lingus AerClub', ratio: '1:1', category: 'Airline', notes: 'OneWorld; transatlantic business from 50K each way' },
  { source: 'Chase UR', partner: 'Singapore KrisFlyer', ratio: '1:1', category: 'Airline', notes: 'Star Alliance; Suites class; transfers take up to 48hrs' },
  { source: 'Chase UR', partner: 'Virgin Atlantic Flying Club', ratio: '1:1', category: 'Airline', notes: 'ANA business to Japan from 60K; Delta One sweet spots' },
  { source: 'Chase UR', partner: 'Southwest Rapid Rewards', ratio: '1:1', category: 'Airline', notes: 'Domestic; points never expire; Companion Pass value' },
  { source: 'Chase UR', partner: 'JetBlue TrueBlue', ratio: '1:1', category: 'Airline', notes: 'No award chart; points offset ticket price' },
  { source: 'Chase UR', partner: 'World of Hyatt', ratio: '1:1', category: 'Hotel', notes: '⚠ Sapphire Preferred drops to 4:3 on 10/1/26. Reserve stays 1:1. Best hotel partner — Cat 1-8 from 3,500/night' },
  { source: 'Chase UR', partner: 'Marriott Bonvoy', ratio: '1:1', category: 'Hotel', notes: 'Rarely best use; transfers take 1-5 days' },
  { source: 'Chase UR', partner: 'IHG One Rewards', ratio: '1:1', category: 'Hotel', notes: 'Rarely good value; IHG points worth ~0.5¢ each' },
  { source: 'Chase UR', partner: 'Wyndham Rewards', ratio: '1:1', category: 'Hotel', notes: 'Added Feb 2026; awards priced at 7.5K/15K/30K per night' },

  // ── Amex Membership Rewards ──
  { source: 'Amex MR', partner: 'Air Canada Aeroplan', ratio: '1:1', category: 'Airline', notes: 'Star Alliance; Lufthansa first class; stopover awards' },
  { source: 'Amex MR', partner: 'Air France/KLM Flying Blue', ratio: '1:1', category: 'Airline', notes: 'Promo Awards monthly; great for business to Europe' },
  { source: 'Amex MR', partner: 'ANA Mileage Club', ratio: '1:1', category: 'Airline', notes: 'Star Alliance; transfers up to 48hrs; round-trip J to Japan sweet spot' },
  { source: 'Amex MR', partner: 'Avianca LifeMiles', ratio: '1:1', category: 'Airline', notes: 'Star Alliance; no fuel surcharges; great for United/Lufthansa awards' },
  { source: 'Amex MR', partner: 'British Airways Avios', ratio: '1:1', category: 'Airline', notes: 'Short-haul Europe from 4K; books AA/Iberia/Finnair/JAL' },
  { source: 'Amex MR', partner: 'Virgin Atlantic Flying Club', ratio: '1:1', category: 'Airline', notes: 'ANA business J from 60K; Delta One sweet spots; frequent transfer bonuses' },
  { source: 'Amex MR', partner: 'Delta SkyMiles', ratio: '1:1', category: 'Airline', notes: 'No award chart; dynamic pricing; usually poor value vs other partners' },
  { source: 'Amex MR', partner: 'Singapore KrisFlyer', ratio: '1:1', category: 'Airline', notes: 'Star Alliance; Suites class; transfers up to 48hrs' },
  { source: 'Amex MR', partner: 'Iberia Plus', ratio: '1:1', category: 'Airline', notes: 'OneWorld; business to Spain from 34K each way' },
  { source: 'Amex MR', partner: 'Aer Lingus AerClub', ratio: '1:1', category: 'Airline', notes: 'OneWorld; transatlantic business to Ireland/UK' },
  { source: 'Amex MR', partner: 'Qantas Frequent Flyer', ratio: '1:1', category: 'Airline', notes: 'OneWorld; useful for Fiji/Pacific routes; transfers instant' },
  { source: 'Amex MR', partner: 'Qatar Airways Privilege Club', ratio: '1:1', category: 'Airline', notes: 'OneWorld; Qsuites business class sweet spots' },
  { source: 'Amex MR', partner: 'Emirates Skywards', ratio: '1:1', category: 'Airline', notes: 'High fuel surcharges; ratio recently worsened; use Chase/Bilt/C1 for 1:1 instead' },
  { source: 'Amex MR', partner: 'Etihad Guest', ratio: '1:1', category: 'Airline', notes: '⚠ Partnership ending June 30, 2026 — transfer before then' },
  { source: 'Amex MR', partner: 'Cathay Pacific Asia Miles', ratio: '5:4', category: 'Airline', notes: '20% penalty ratio; consider BA Avios (1:1, also books CX) instead' },
  { source: 'Amex MR', partner: 'AeroMexico Club Premier', ratio: '1:1.6', category: 'Airline', notes: 'Bonus ratio; useful if flying AeroMexico or SkyTeam to Mexico' },
  { source: 'Amex MR', partner: 'JetBlue TrueBlue', ratio: '2.5:2', category: 'Airline', notes: 'Penalty ratio; Chase transfers 1:1 to JetBlue — use that instead' },
  { source: 'Amex MR', partner: 'Hilton Honors', ratio: '1:2', category: 'Hotel', notes: 'Bonus ratio but Hilton pts worth ~0.5¢; rarely better than direct booking' },
  { source: 'Amex MR', partner: 'Marriott Bonvoy', ratio: '1:1', category: 'Hotel', notes: 'Slow transfers (up to 3 weeks); avoid unless topping off for a specific stay' },
  { source: 'Amex MR', partner: 'Choice Privileges', ratio: '1:1', category: 'Hotel', notes: 'Japan/Scandinavia sweet spots; decent value in expensive markets' },

  // ── Citi ThankYou ──
  { source: 'Citi TY', partner: 'American Airlines AAdvantage', ratio: '1:1', category: 'Airline', notes: 'Requires Strata Elite/Premier. OneWorld; great for partner awards (JAL, Cathay, BA)' },
  { source: 'Citi TY', partner: 'Air Canada Aeroplan', ratio: '1:1', category: 'Airline', notes: 'Star Alliance; Lufthansa/Swiss/United awards with stopovers' },
  { source: 'Citi TY', partner: 'Air France/KLM Flying Blue', ratio: '1:1', category: 'Airline', notes: 'Monthly Promo Awards; business to Europe' },
  { source: 'Citi TY', partner: 'Avianca LifeMiles', ratio: '1:1', category: 'Airline', notes: 'Star Alliance; no fuel surcharges; frequent transfer bonuses' },
  { source: 'Citi TY', partner: 'Singapore KrisFlyer', ratio: '1:1', category: 'Airline', notes: 'Star Alliance; Suites; transfers up to 48hrs' },
  { source: 'Citi TY', partner: 'Turkish Airlines Miles&Smiles', ratio: '1:1', category: 'Airline', notes: 'Star Alliance; incredible short-haul sweet spots from 7.5K' },
  { source: 'Citi TY', partner: 'Virgin Atlantic Flying Club', ratio: '1:1', category: 'Airline', notes: 'ANA J from 60K; Delta One sweet spots' },
  { source: 'Citi TY', partner: 'Qatar Airways Privilege Club', ratio: '1:1', category: 'Airline', notes: 'OneWorld; Qsuites business sweet spots; frequent bonuses' },
  { source: 'Citi TY', partner: 'Cathay Pacific Asia Miles', ratio: '1:1', category: 'Airline', notes: 'OneWorld; business to Asia; no fuel surcharges' },
  { source: 'Citi TY', partner: 'Etihad Guest', ratio: '1:1', category: 'Airline', notes: '⚠ Check status — Etihad partnerships are in flux in 2026' },
  { source: 'Citi TY', partner: 'Emirates Skywards', ratio: '1:1', category: 'Airline', notes: 'High fuel surcharges; check award pricing carefully' },
  { source: 'Citi TY', partner: 'EVA Air Infinity MileageLands', ratio: '1:1', category: 'Airline', notes: 'Star Alliance; exclusive Citi partner; business to Asia sweet spots' },
  { source: 'Citi TY', partner: 'Thai Royal Orchid Plus', ratio: '1:1', category: 'Airline', notes: 'Star Alliance; unique Citi partner' },
  { source: 'Citi TY', partner: 'Iberia Plus', ratio: '1:1', category: 'Airline', notes: 'OneWorld; business to Spain/Latin America' },
  { source: 'Citi TY', partner: 'Aer Lingus AerClub', ratio: '1:1', category: 'Airline', notes: 'OneWorld; transatlantic business' },
  { source: 'Citi TY', partner: 'JetBlue TrueBlue', ratio: '1:1', category: 'Airline', notes: 'Domestic; no award chart; points offset ticket price' },
  { source: 'Citi TY', partner: 'Wyndham Rewards', ratio: '1:1', category: 'Hotel', notes: 'Awards at 7.5K/15K/30K per night; good value in expensive markets' },
  { source: 'Citi TY', partner: 'Choice Privileges', ratio: '1:1.5', category: 'Hotel', notes: 'Bonus ratio; Japan/Scandinavia sweet spots 6-7K TY per night' },

  // ── Capital One Miles ──
  { source: 'Capital One', partner: 'Air Canada Aeroplan', ratio: '1:1', category: 'Airline', notes: 'Star Alliance; Lufthansa/Swiss awards; stopovers allowed' },
  { source: 'Capital One', partner: 'Air France/KLM Flying Blue', ratio: '1:1', category: 'Airline', notes: 'Monthly Promo Awards; great for last-minute business to Europe' },
  { source: 'Capital One', partner: 'Avianca LifeMiles', ratio: '1:1', category: 'Airline', notes: 'Star Alliance; no fuel surcharges; United/Lufthansa awards' },
  { source: 'Capital One', partner: 'British Airways Avios', ratio: '1:1', category: 'Airline', notes: 'Short-haul Europe from 4K; books AA/Iberia/Finnair' },
  { source: 'Capital One', partner: 'Turkish Airlines Miles&Smiles', ratio: '1:1', category: 'Airline', notes: 'Star Alliance; incredible short-haul sweet spots from 7.5K' },
  { source: 'Capital One', partner: 'Singapore KrisFlyer', ratio: '1:1', category: 'Airline', notes: 'Star Alliance; Suites class; transfers up to 48hrs' },
  { source: 'Capital One', partner: 'Cathay Pacific Asia Miles', ratio: '1:1', category: 'Airline', notes: 'OneWorld; business to Asia; no fuel surcharges' },
  { source: 'Capital One', partner: 'Qatar Airways Privilege Club', ratio: '1:1', category: 'Airline', notes: 'OneWorld; Qsuites business; strong sweet spots' },
  { source: 'Capital One', partner: 'Virgin Atlantic Flying Club', ratio: '1:1', category: 'Airline', notes: 'ANA J from 60K; Delta One; frequent bonuses' },
  { source: 'Capital One', partner: 'Etihad Guest', ratio: '1:1', category: 'Airline', notes: 'Middle East/Asia routes; check availability before transferring' },
  { source: 'Capital One', partner: 'Finnair Plus', ratio: '1:1', category: 'Airline', notes: 'OneWorld; useful for Nordics and Japan (via JL partnership)' },
  { source: 'Capital One', partner: 'Qantas Frequent Flyer', ratio: '1:1', category: 'Airline', notes: 'OneWorld; Australia/Pacific; also books Emirates' },
  { source: 'Capital One', partner: 'Aeromexico Club Premier', ratio: '1:1', category: 'Airline', notes: 'SkyTeam; Mexico routes' },
  { source: 'Capital One', partner: 'TAP Miles&Go', ratio: '1:1', category: 'Airline', notes: 'Star Alliance; useful for Portugal/Europe connections' },
  { source: 'Capital One', partner: 'Emirates Skywards', ratio: '2:1.5', category: 'Airline', notes: 'Penalty ratio; high fuel surcharges — rarely best use' },
  { source: 'Capital One', partner: 'EVA Air Infinity MileageLands', ratio: '2:1.5', category: 'Airline', notes: 'Penalty ratio; Star Alliance; business to Asia' },
  { source: 'Capital One', partner: 'Japan Airlines Mileage Bank', ratio: '2:1.5', category: 'Airline', notes: 'Penalty ratio; OneWorld; business to Japan sweet spots via partners' },
  { source: 'Capital One', partner: 'JetBlue TrueBlue', ratio: '5:3', category: 'Airline', notes: 'Penalty ratio; avoid — use Chase (1:1) if possible' },
  { source: 'Capital One', partner: 'Wyndham Rewards', ratio: '1:1', category: 'Hotel', notes: 'Fixed award pricing; good for expensive markets' },
  { source: 'Capital One', partner: 'Choice Privileges', ratio: '1:1', category: 'Hotel', notes: 'Japan/Scandinavia sweet spots' },
  { source: 'Capital One', partner: 'I Prefer (Preferred Hotels)', ratio: '1:2', category: 'Hotel', notes: 'Bonus ratio; independent luxury properties; periodic transfer bonuses' },
  { source: 'Capital One', partner: 'Accor Live Limitless', ratio: '2:1', category: 'Hotel', notes: 'Penalty ratio; Europe/Asia properties; rarely worth it' },

  // ── Bilt Rewards ──
  { source: 'Bilt', partner: 'World of Hyatt', ratio: '1:1', category: 'Hotel', notes: 'Best use of Bilt points. Only non-Chase currency that transfers to Hyatt. Cat 1-8 from 3,500/night' },
  { source: 'Bilt', partner: 'Alaska Airlines Atmos Rewards', ratio: '1:1', category: 'Airline', notes: 'Bilt exclusive. OneWorld; American flights from 7.5K; Cathay/JAL premium awards' },
  { source: 'Bilt', partner: 'United MileagePlus', ratio: '1:1', category: 'Airline', notes: 'Star Alliance; domestic from 8K; international business sweet spots' },
  { source: 'Bilt', partner: 'Air Canada Aeroplan', ratio: '1:1', category: 'Airline', notes: 'Star Alliance; Lufthansa first class; stopover awards' },
  { source: 'Bilt', partner: 'Air France/KLM Flying Blue', ratio: '1:1', category: 'Airline', notes: 'Monthly Promo Awards; business to Europe' },
  { source: 'Bilt', partner: 'Virgin Atlantic Flying Club', ratio: '1:1', category: 'Airline', notes: 'ANA J from 60K; Delta One sweet spots; Rent Day bonuses' },
  { source: 'Bilt', partner: 'Emirates Skywards', ratio: '1:1', category: 'Airline', notes: 'Bilt & Chase are only major programs at 1:1; high fuel surcharges on Emirates metal' },
  { source: 'Bilt', partner: 'British Airways Avios', ratio: '1:1', category: 'Airline', notes: 'Short-haul Europe from 4K; books AA/Iberia/Finnair/JAL' },
  { source: 'Bilt', partner: 'Cathay Pacific Asia Miles', ratio: '1:1', category: 'Airline', notes: 'OneWorld; business to Asia; no fuel surcharges' },
  { source: 'Bilt', partner: 'Turkish Airlines Miles&Smiles', ratio: '1:1', category: 'Airline', notes: 'Star Alliance; short-haul from 7.5K; best for United/Star Alliance awards' },
  { source: 'Bilt', partner: 'Iberia Plus', ratio: '1:1', category: 'Airline', notes: 'OneWorld; business to Spain/Latin America from 34K each way' },
  { source: 'Bilt', partner: 'Aer Lingus AerClub', ratio: '1:1', category: 'Airline', notes: 'OneWorld; transatlantic business to Ireland/UK' },
  { source: 'Bilt', partner: 'Southwest Rapid Rewards', ratio: '1:1', category: 'Airline', notes: 'Domestic; Companion Pass value; no change fees' },
  { source: 'Bilt', partner: 'Japan Airlines Mileage Bank', ratio: '1:1', category: 'Airline', notes: 'OneWorld; business to Japan; AA partner award sweet spots' },
  { source: 'Bilt', partner: 'Qatar Airways Privilege Club', ratio: '1:1', category: 'Airline', notes: 'OneWorld; Qsuites business class' },
  { source: 'Bilt', partner: 'Etihad Guest', ratio: '1:1', category: 'Airline', notes: 'Middle East/Asia routes' },
  { source: 'Bilt', partner: 'TAP Miles&Go', ratio: '1:1', category: 'Airline', notes: 'Star Alliance; Portugal/Europe connections' },
  { source: 'Bilt', partner: 'Virgin Red', ratio: '1:1', category: 'Airline', notes: 'Can convert to Virgin Atlantic Flying Club; lifestyle rewards' },
  { source: 'Bilt', partner: 'Spirit Free Spirit', ratio: '1:1', category: 'Airline', notes: 'Budget domestic; unique Bilt exclusive; useful for cheap domestic routes' },
  { source: 'Bilt', partner: 'Hilton Honors', ratio: '1:1', category: 'Hotel', notes: 'Points worth ~0.5¢; Hyatt almost always better' },
  { source: 'Bilt', partner: 'Marriott Bonvoy', ratio: '1:1', category: 'Hotel', notes: 'Slow transfers; avoid unless specific redemption in mind' },
  { source: 'Bilt', partner: 'IHG One Rewards', ratio: '1:1', category: 'Hotel', notes: 'Low point value ~0.5¢; better to pay cash most of the time' },
  { source: 'Bilt', partner: 'Wyndham Rewards', ratio: '1:1', category: 'Hotel', notes: 'Added March 2026; 7.5K/15K/30K per night' },
  { source: 'Bilt', partner: 'Accor Live Limitless', ratio: '3:2', category: 'Hotel', notes: 'Penalty ratio; Europe/Asia luxury properties; check value vs cash' },
]

export async function seedTransferPartners(uid) {
  // Assign sortOrder so ecosystem groups and items stay in seeded order
  const bySource = {}
  PARTNERS.forEach(p => {
    if (!bySource[p.source]) bySource[p.source] = []
    bySource[p.source].push(p)
  })
  let groupIndex = 0
  for (const source of Object.keys(bySource)) {
    const items = bySource[source]
    for (let i = 0; i < items.length; i++) {
      await add(uid, 'partners', { ...items[i], sortOrder: groupIndex * 1000 + i })
    }
    groupIndex++
  }
}

// Refreshes existing transfer partner entries with current ratio/category/notes
// from the PARTNERS list above, matching by source+partner name (case-insensitive).
// - Existing entries: ratio/category/notes are updated, sortOrder/position untouched.
// - New entries (added to PARTNERS since last refresh): appended at the end of their group.
// - Entries the user added manually that aren't in PARTNERS: left completely alone.
// Returns a summary: { updated, added, unchanged }
export async function refreshTransferPartners(uid) {
  const existing = await getAll(uid, 'partners')

  const keyOf = (s, p) => `${s.trim().toLowerCase()}|||${p.trim().toLowerCase()}`
  const existingByKey = new Map(existing.map(e => [keyOf(e.source, e.partner), e]))

  let updated = 0
  let added = 0
  let unchanged = 0

  // Find max sortOrder per source group so new items append at the end
  const maxSortBySource = {}
  existing.forEach(e => {
    const cur = maxSortBySource[e.source]
    if (cur === undefined || (e.sortOrder ?? 0) > cur) maxSortBySource[e.source] = e.sortOrder ?? 0
  })

  for (const p of PARTNERS) {
    const key = keyOf(p.source, p.partner)
    const match = existingByKey.get(key)

    if (match) {
      const changed = match.ratio !== p.ratio || match.category !== p.category || match.notes !== p.notes
      if (changed) {
        await update(uid, 'partners', match.id, { ratio: p.ratio, category: p.category, notes: p.notes })
        updated++
      } else {
        unchanged++
      }
    } else {
      const nextSort = (maxSortBySource[p.source] ?? -1) + 1
      maxSortBySource[p.source] = nextSort
      await add(uid, 'partners', { ...p, sortOrder: nextSort })
      added++
    }
  }

  return { updated, added, unchanged }
}
