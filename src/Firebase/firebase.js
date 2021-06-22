import firebase from 'firebase';
import * as firebaseui from 'firebaseui'

const firebaseConfig = {
    apiKey: "apikey",
    authDomain: "authDomain",
    databaseURL: "databaseURL",
    projectId: "projectId",
    storageBucket: "storageBucket",
    messagingSenderId: "messagingSenderId",
    appId: "appId",
    measurementId: "measurementId"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var storage = firebase.storage();
var auth = firebase.auth();
var usersCollection = firebase.firestore().collection("users");
var foldersCollection = firebase.firestore().collection("folders");
var vouchersCollection = firebase.firestore().collection("vouchers");

const authUI = new firebaseui.auth.AuthUI(auth);

var provider = new firebase.auth.GoogleAuthProvider();

export { firebase, authUI, provider, storage, usersCollection, foldersCollection, vouchersCollection }