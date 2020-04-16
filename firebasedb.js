import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import firebaseConfig from './firebase.config'

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

const fireDb = {
  getCollection: async (collection) => {
    try {
      const ref = db.collection(collection);
      const data = await ref.get();
      return data.docs.map(doc => doc.data());
    } catch(err) {
      alert(err);
    }
  },
  // putObject not confirmed to work
  putObject: async (collection, object) => {
    try {
    const ref = db.collection(collection)
                    .set(object);
    } catch(err) {
      alert(err);
    }
  }, // add more methods here
}

export default fireDb;

