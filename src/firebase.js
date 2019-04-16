import firebase from "firebase/app"; // bec we're making use of firebase.initializeApp(config)
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

var config = {
  apiKey: "AIzaSyCbAaJpYq6deb_hww0n2YngoALUifGuzSQ",
  authDomain: "react-slack-clone-b1cde.firebaseapp.com",
  databaseURL: "https://react-slack-clone-b1cde.firebaseio.com",
  projectId: "react-slack-clone-b1cde",
  storageBucket: "react-slack-clone-b1cde.appspot.com",
  messagingSenderId: "320052412181"
};

firebase.initializeApp(config);

export default firebase; // to use anywhere in the app
