// src/pages/Tracker.jsx
import { useState, useEffect } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { subscribe, getProfile } from '../lib/db'
import Dashboard from '../components/Dashboard'
import Cards from '../components/Cards'
import Ecosystems from '../components/Ecosystems'
import Opportunities from '../components/Opportunities'
import Partners from '../components/Partners'

const TABS = ['Dashboard', 'Cards', 'Points', 'Opportunities', 'Transfer partners']

export default function Tracker({ user }) {
  const [tab, setTab] = useState('Dashboard')
  const [myData, setMyData] = useState({ cards: [], ecosystems: [], opportunities: [], partners: [] })
  const [partnerData, setPartnerData] = useState(null)
  const [partnerUid, setPartnerUid] = useState('')
  const [partnerInputVal, setPartnerInputVal] = useState('')
  const [partnerProfile, setPartnerProfile] = useState(null)
  const [viewingPartner, setViewingPartner] = useState(false)
  const [partnerLoading, setPartnerLoading] = useState(false)
  const [partnerError, setPartnerError] = useState('')

  // Subscribe to my own data
  useEffect(() => {
    const cols = ['cards', 'ecosystems', 'opportunities', 'partners']
    const unsubs = cols.map(col =>
      subscribe(user.uid, col, (docs) =>
        setMyData(prev => ({ ...prev, [col]: docs }))
      )
    )
    return () => unsubs.forEach(u => u())
  }, [user.uid])

  // Subscribe to partner data if connected
  useEffect(() => {
    if (!partnerUid) { setPartnerData(null); return }
    const cols = ['cards', 'ecosystems', 'opportunities', 'partners']
    const d = { cards: [], ecosystems: [], opportunities: [], partners: [] }
    const unsubs = cols.map(col =>
      subscribe(partnerUid, col, (docs) => {
        d[col] = docs
        setPartnerData({ ...d })
      })
    )
    return () => unsubs.forEach(u => u())
  }, [partnerUid])

  const connectPartner = async () => {
    const uid = partnerInputVal.trim()
    if (!uid) return
    setPartnerLoading(true)
    setPartnerError('')
    const profile = await getProfile(uid)
    if (!profile) {
      setPartnerError('No account found with that user ID')
      setPartnerLoading(false)
      return
    }
    setPartnerUid(uid)
    setPartnerProfile(profile)
    setPartnerLoading(false)
  }

  const currentData = viewingPartner && partnerData ? partnerData : myData
  const currentUid = viewingPartner && partnerUid ? partnerUid : user.uid
  const isReadonly = viewingPartner

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top nav */}
      <header style={{
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        padding: '0 1.5rem', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: 52, position: 'sticky', top: 0, zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>✈</span>
          <span style={{ fontWeight: 600, fontSize: 15 }}>Points Tracker</span>
          {partnerProfile && (
            <div style={{ display: 'flex', gap: 4, marginLeft: 12 }}>
              <button
                onClick={() => setViewingPartner(false)}
                style={{
                  padding: '3px 10px', fontSize: 12, borderRadius: 20,
                  border: '1px solid var(--border-strong)',
                  background: !viewingPartner ? 'var(--text)' : 'none',
                  color: !viewingPartner ? '#fff' : 'var(--text)',
                  cursor: 'pointer'
                }}
              >Mine</button>
              <button
                onClick={() => setViewingPartner(true)}
                style={{
                  padding: '3px 10px', fontSize: 12, borderRadius: 20,
                  border: '1px solid var(--border-strong)',
                  background: viewingPartner ? 'var(--text)' : 'none',
                  color: viewingPartner ? '#fff' : 'var(--text)',
                  cursor: 'pointer'
                }}
              >{partnerProfile.displayName?.split(' ')[0] || 'Partner'}</button>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user.photoURL && (
            <img src={user.photoURL} alt="" style={{ width: 28, height: 28, borderRadius: '50%' }} />
          )}
          <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{user.displayName?.split(' ')[0]}</span>
          <button
            onClick={() => signOut(auth)}
            style={{ fontSize: 12, color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer' }}
          >Sign out</button>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
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
              cursor: 'pointer', marginRight: 0
            }}>{t}</button>
          ))}

          {/* Partner connect */}
          <div style={{ marginTop: 'auto', padding: '1rem', borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
              {partnerProfile ? 'Household' : 'Share with partner'}
            </div>
            {partnerProfile ? (
              <div style={{ fontSize: 12, color: 'var(--text-2)' }}>
                Connected to {partnerProfile.displayName}
                <button onClick={() => { setPartnerUid(''); setPartnerProfile(null); setViewingPartner(false) }}
                  style={{ display: 'block', marginTop: 4, fontSize: 11, color: 'var(--red)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  Disconnect
                </button>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 6 }}>
                  Your user ID:<br />
                  <code style={{ fontSize: 10, wordBreak: 'break-all', fontFamily: 'var(--mono)', color: 'var(--text-2)' }}>{user.uid}</code>
                </div>
                <input
                  value={partnerInputVal}
                  onChange={e => setPartnerInputVal(e.target.value)}
                  placeholder="Partner's user ID"
                  style={{
                    width: '100%', padding: '5px 8px', border: '1px solid var(--border-strong)',
                    borderRadius: 6, fontSize: 11, marginBottom: 6,
                    background: 'var(--surface)', color: 'var(--text)'
                  }}
                />
                <button onClick={connectPartner} disabled={partnerLoading} style={{
                  width: '100%', padding: '5px 0', fontSize: 11,
                  border: '1px solid var(--border-strong)', borderRadius: 6,
                  background: 'none', cursor: 'pointer', color: 'var(--text)'
                }}>{partnerLoading ? 'Connecting…' : 'Connect'}</button>
                {partnerError && <div style={{ fontSize: 11, color: 'var(--red)', marginTop: 4 }}>{partnerError}</div>}
              </>
            )}
          </div>
        </nav>

        {/* Main content */}
        <main style={{ flex: 1, padding: '1.5rem 2rem', maxWidth: 900 }}>
          {viewingPartner && (
            <div style={{
              padding: '8px 14px', borderRadius: 8, marginBottom: '1rem',
              background: 'var(--accent-light)', color: 'var(--accent-text)', fontSize: 13
            }}>
              Viewing {partnerProfile?.displayName}'s data — read only
            </div>
          )}

          {tab === 'Dashboard' && <Dashboard {...currentData} />}
          {tab === 'Cards' && <Cards uid={currentUid} cards={currentData.cards} readonly={isReadonly} />}
          {tab === 'Points' && <Ecosystems uid={currentUid} ecosystems={currentData.ecosystems} readonly={isReadonly} />}
          {tab === 'Opportunities' && <Opportunities uid={currentUid} opportunities={currentData.opportunities} readonly={isReadonly} />}
          {tab === 'Transfer partners' && <Partners uid={currentUid} partners={currentData.partners} readonly={isReadonly} />}
        </main>
      </div>
    </div>
  )
}
