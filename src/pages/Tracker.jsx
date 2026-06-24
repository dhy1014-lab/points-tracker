// src/pages/Tracker.jsx
import { useState, useEffect } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { subscribe, getPartnerByEmail } from '../lib/db'
import Dashboard from '../components/Dashboard'
import Cards from '../components/Cards'
import Ecosystems from '../components/Ecosystems'
import Opportunities from '../components/Opportunities'
import Credits from '../components/Credits'
import Partners from '../components/Partners'

const ALLOWED_EMAILS = ['dhy1014@gmail.com', 'sunjinro@gmail.com']
const TABS = ['Dashboard', 'Cards', 'Points', 'Credits', 'Opportunities', 'Transfer partners']
const emptyData = () => ({ cards: [], ecosystems: [], opportunities: [], partners: [], credits: [] })

export default function Tracker({ user }) {
  const [tab, setTab] = useState('Dashboard')
  const [view, setView] = useState('all') // 'all' | 'me' | 'partner'
  const [myData, setMyData] = useState(emptyData())
  const [partnerData, setPartnerData] = useState(emptyData())
  const [partner, setPartner] = useState(null) // { uid, displayName, ... }

  const myName = user.displayName?.split(' ')[0] || 'Me'
  const partnerEmail = ALLOWED_EMAILS.find(e => e !== user.email.toLowerCase())

  // Resolve partner profile from their email
  useEffect(() => {
    if (!partnerEmail) return
    getPartnerByEmail(partnerEmail).then(p => { if (p) setPartner(p) })
  }, [partnerEmail])

  // Subscribe to my data
  useEffect(() => {
    const cols = ['cards', 'ecosystems', 'opportunities', 'partners', 'credits']
    const unsubs = cols.map(col =>
      subscribe(user.uid, col, (docs) =>
        setMyData(prev => ({ ...prev, [col]: docs }))
      )
    )
    return () => unsubs.forEach(u => u())
  }, [user.uid])

  // Subscribe to partner data once resolved
  useEffect(() => {
    if (!partner?.uid) return
    const cols = ['cards', 'ecosystems', 'opportunities', 'partners', 'credits']
    const unsubs = cols.map(col =>
      subscribe(partner.uid, col, (docs) =>
        setPartnerData(prev => ({ ...prev, [col]: docs }))
      )
    )
    return () => unsubs.forEach(u => u())
  }, [partner?.uid])

  const partnerName = partner?.displayName?.split(' ')[0] || 'Partner'

  const tag = (items, name, uid) => items.map(item => ({ ...item, _holder: name, _uid: uid }))

  const viewData = (col) => {
    if (view === 'me') return tag(myData[col], myName, user.uid)
    if (view === 'partner') return tag(partnerData[col], partnerName, partner?.uid)
    return [...tag(myData[col], myName, user.uid), ...tag(partnerData[col], partnerName, partner?.uid)]
  }

  const activeUid = view === 'partner' ? partner?.uid : user.uid
  const isReadonly = view === 'partner'
  const showSections = view === 'all'

  const sharedProps = { readonly: isReadonly, showSections, myName, partnerName }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        padding: '0 1.5rem', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: 52, position: 'sticky', top: 0, zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>✈</span>
            <span style={{ fontWeight: 600, fontSize: 15 }}>Points Tracker</span>
          </div>
          <div style={{
            display: 'flex', background: 'var(--bg)', borderRadius: 20,
            padding: 3, gap: 2, border: '1px solid var(--border)'
          }}>
            {[['all', 'All'], ['me', myName], ['partner', partnerName]].map(([v, label]) => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: '3px 12px', fontSize: 12, borderRadius: 20, border: 'none',
                cursor: 'pointer',
                background: view === v ? 'var(--surface)' : 'transparent',
                color: view === v ? 'var(--text)' : 'var(--text-2)',
                fontWeight: view === v ? 500 : 400,
                boxShadow: view === v ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s'
              }}>{label}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user.photoURL && <img src={user.photoURL} alt="" style={{ width: 28, height: 28, borderRadius: '50%' }} />}
          <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{myName}</span>
          <button onClick={() => signOut(auth)} style={{ fontSize: 12, color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer' }}>
            Sign out
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1 }}>
        <nav style={{
          width: 180, borderRight: '1px solid var(--border)',
          padding: '1rem 0', background: 'var(--surface)',
          display: 'flex', flexDirection: 'column', gap: 2,
          position: 'sticky', top: 52, height: 'calc(100vh - 52px)', overflowY: 'auto'
        }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              textAlign: 'left', padding: '7px 16px',
              background: tab === t ? 'var(--bg)' : 'none',
              border: 'none', borderLeft: tab === t ? '2px solid var(--text)' : '2px solid transparent',
              fontSize: 13, fontWeight: tab === t ? 500 : 400,
              color: tab === t ? 'var(--text)' : 'var(--text-2)',
              cursor: 'pointer'
            }}>{t}</button>
          ))}
        </nav>

        <main style={{ flex: 1, padding: '1.5rem 2rem', maxWidth: 900 }}>
          {view === 'partner' && (
            <div style={{
              padding: '8px 14px', borderRadius: 8, marginBottom: '1rem',
              background: 'var(--accent-light)', color: 'var(--accent-text)', fontSize: 13
            }}>
              Viewing {partnerName}'s data — read only
            </div>
          )}

          {tab === 'Dashboard' && <Dashboard cards={viewData('cards')} ecosystems={viewData('ecosystems')} opportunities={viewData('opportunities')} {...sharedProps} />}
          {tab === 'Cards' && <Cards uid={activeUid} cards={viewData('cards')} {...sharedProps} onAddCredits={async (cardName, credits) => {
            const { add } = await import('../lib/db')
            for (const c of credits) {
              await add(activeUid, 'credits', { ...c, cardName, used: false })
            }
          }} />}
          {tab === 'Points' && <Ecosystems uid={activeUid} ecosystems={viewData('ecosystems')} {...sharedProps} />}
          {tab === 'Opportunities' && <Opportunities uid={activeUid} opportunities={viewData('opportunities')} {...sharedProps} />}
          {tab === 'Credits' && <Credits uid={activeUid} credits={viewData('credits')} {...sharedProps} />}
          {tab === 'Transfer partners' && <Partners uid={activeUid} partners={viewData('partners')} {...sharedProps} />}
        </main>
      </div>
    </div>
  )
}
