import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import firebaseConfig from './firebase.config.js'

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const storage = firebase.storage();

const storageRef = storage.ref();

const baseWrapper = {
  getCollection: async (collection) => {
    try {
      const ref = db.collection(collection);
      const data = await ref.get();
      return data.docs.map(doc => doc.data());
    } catch (err) {
      alert(err);
    }
  },
  getItem: async (collection, id) => {
    try {
      return await (await db.collection(collection).doc(id).get()).data();
    } catch (err) {
<<<<<<< HEAD
      return null;
=======
      alert(err);
>>>>>>> 971cea97a90c1f8b8acabbc9170f0743d662c214
    }
  },
  setObject: async (collection, docId, object) => {
    try {
      const ref = db.collection(collection)
        .doc(docId)
        .set(object);
    } catch (err) {
      alert(err);
    }
  },
  uploadImage: async (fileRef, filename) => {
    try {
      const uploadTask = storageRef
        .child('images/' + filename)
        .putString(fileRef, 'data_url');
  
      uploadTask.on('state_changed', (snapshot) => {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED:
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING:
            console.log('Upload is running');
            break;
        }
      }, (err) => {
        alert(err)
      }, () => {
        console.log('Upload is finished');
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          console.log('File available at', downloadURL);
        });
        // Maja is going to update user auth url here
      });
    } catch (err) {
      alert(err);
    }
  }
}

const ordersWrapper = {
  addOrder: async (groceries, location, userId) => {
    try {
      const uuid = generateId();

      const order = {
        groceries: groceries.map(g => ({ uuid: g.uuid, quantity: q.quantity })),
        location,
        client: userId
      };

      await db.collection("orders")
        .doc(uuid)
        .set(order);

      const user = await baseWrapper.getItem("user", userId);
      await db.collection("user")
        .doc(userId)
        .update('my_orders', [...user['my_orders'], uuid]);

    } catch (err) {
      alert(err);
    }
  },
  getOrder: async (orderId) => {
    try {
      const order = await baseWrapper.getItem("orders", orderId);
      const clientName = await usersWrapper.getUser(order.client);
      const groceries = await Promise.all(order.groceries.map(async g => {
        const grocery = await groceriesWrapper.getGrocery(g.uuid);
        return { ...grocery, quantity: g.quantity };
      }));
      return { ...order, groceries, clientName };
    } catch (err) {
      alert(err);
    }
  },
  claimOrder: async (orderId, userId) => {
    try {
      await db.collection("orders")
        .doc(orderId)
        .update('deliverer', userId);
      const user = await baseWrapper.getItem("user", userId);
      await db.collection("user")
        .doc(userId)
        .update('pickup_orders', [...user['pickup_orders'], orderId]);
    } catch (err) {
      alert(err);
    }
  }
};

const groceriesWrapper = {
  getSuggestedGroceries: async (query) => {
    try {
      return await db
        .collection("grocery_items")
        .orderBy('uuid')
        .startAt(query)
        .endAt(`${query}\uf8ff`)
        .get()
        .then(res => res.docs.map(d => d.data()));
    } catch (err) {
      alert(err);
    }
  },
  getGrocery: async (uuid) => await baseWrapper.getItem("grocery_items", uuid)
}

const usersWrapper = {
  getUser: async (uuid) => await baseWrapper.getItem("user", uuid),
  addUser: async (user) => {
    const { email } = user;
    try {
      const record = await baseWrapper.getItem("user", email);
      if (!record) {
        const userObj = {
          email: user.email,
          ...user,
          my_orders: [],
          pickup_orders: [],
          balance: 0,
          karma: 0,
          is_verified: false
        };
        console.log(userObj);
        await baseWrapper.setObject("user", email, userObj);
      };
    } catch (err) {
      alert(err);
    }
  }
}

const generateId = () => Math.floor(Math.random() * 90000) + 10000;

const fireDb = {
  ...ordersWrapper,
  ...groceriesWrapper,
  ...usersWrapper,
  ...baseWrapper
}

export default fireDb;

