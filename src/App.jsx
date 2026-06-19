// src/App.jsx
import { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from './lib/firebase'
import { saveProfile } from './lib/db'
import Login from './pages/Login'
import Tracker from './pages/Tracker'

const ALLOWED = ['dhy1014@gmail.com', 'sunjinro@gmail.com']

export default function App() {
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      if (u && !ALLOWED.includes(u.email.toLowerCase())) {
        signOut(auth)
        setUser(null)
        alert('This app is private.')
        return
      }
      setUser(u)
      if (u) saveProfile(u.uid, u.displayName, u.email, u.photoURL)
    })
  }, [])

  if (user === undefined) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ width: 24, height: 24, border: '2px solid #e8e6e0', borderTopColor: '#1a1917', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return user ? <Tracker user={user} /> : <Login />
}
