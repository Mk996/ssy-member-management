import firebaseConfig from './firebaseConfig'
import firebase from 'firebase/app'
require('firebase/firestore')
require('firebase/database')
require('firebase/auth')

const fb = firebase.initializeApp(firebaseConfig)
const fs = firebase.firestore()
const db = firebase.database()
const fa = firebase.auth()

export { fb, fs, db, fa }
