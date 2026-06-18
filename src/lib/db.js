// src/lib/db.js
import {
  collection, doc, addDoc, updateDoc, deleteDoc, setDoc,
  onSnapshot, query, orderBy, serverTimestamp, getDoc
} from 'firebase/firestore'
import { db } from './firebase'

// Collections live at: users/{uid}/cards, /ecosystems, /opportunities, /partners
export const userRef = (uid) => doc(db, 'users', uid)

export const colRef = (uid, col) =>
  collection(db, 'users', uid, col)

export const add = (uid, col, data) =>
  addDoc(colRef(uid, col), { ...data, createdAt: serverTimestamp() })

export const update = (uid, col, id, data) =>
  updateDoc(doc(db, 'users', uid, col, id), data)

export const remove = (uid, col, id) =>
  deleteDoc(doc(db, 'users', uid, col, id))

export const subscribe = (uid, col, callback) => {
  const q = query(colRef(uid, col), orderBy('createdAt', 'asc'))
  return onSnapshot(q, (snap) =>
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  )
}

// Save display name so each user can look up the other
export const saveProfile = (uid, displayName, email, photoURL) =>
  updateDoc(doc(db, 'users', uid), { displayName, email, photoURL }).catch(() =>
    setDoc(doc(db, 'users', uid), { displayName, email, photoURL })
  )

export const getProfile = (uid) =>
  getDoc(doc(db, 'users', uid)).then((d) => (d.exists() ? d.data() : null))
