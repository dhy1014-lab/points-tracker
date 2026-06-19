// src/lib/db.js
import {
  collection, doc, addDoc, updateDoc, deleteDoc, setDoc, getDoc,
  onSnapshot, query, orderBy, serverTimestamp, where, getDocs
} from 'firebase/firestore'
import { db } from './firebase'

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

export const saveProfile = (uid, displayName, email, photoURL) =>
  setDoc(doc(db, 'users', uid), { displayName, email, photoURL }, { merge: true })

export const getPartnerByEmail = async (email) => {
  const q = query(collection(db, 'users'), where('email', '==', email))
  const snap = await getDocs(q)
  if (snap.empty) return null
  return { uid: snap.docs[0].id, ...snap.docs[0].data() }
}
