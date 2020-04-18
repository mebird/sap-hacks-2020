import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import firebaseConfig from './firebase.config.js'
import * as FileSystem from 'expo-file-system';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const storage = firebase.storage();

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
  getCollectionWhole: async (collection) => {
    try {
      const ref = db.collection(collection);
      const data = await ref.get();
      console.log(data.docs);
      return data.docs;
    } catch (err) {
      alert(err);
    }
  },
  getItem: async (collection, id) => {
    try {
      return await (await db.collection(collection).doc(id).get()).data();
    } catch (err) {
      return null;
    }
  },
  setObject: async (collection, docId, object) => {
    try {
      const ref = await db.collection(collection)
        .doc(docId)
        .set(object);
    } catch (err) {
      alert(err);
    }
  },
  uploadImage: async (image, filename) => {
    const loc = image.path || image.uri;
    try {
      const base64 = await FileSystem.readAsStringAsync(loc, { encoding: 'base64' });
      const uploadTask = storage
        .ref('images/' + filename)
        .putString(`data:image/jpeg;base64,${base64}`, 'data_url');

      return await new Promise((resolve, reject) => {
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
          alert(err);
          reject(err);
        }, () => {
          console.log('Upload is finished');
          resolve(uploadTask.snapshot.ref.getDownloadURL());
        });
      });
    } catch (err) {
      console.log(err.message);
      throw new Error('Unable to upload image. Please try again.');
    }
  }
}

const ordersWrapper = {
  addOrder: async (groceries, location, userId, priority) => {
    try {
      const uuid = generateId();

      const order = {
        groceries: groceries.map(g => ({ uuid: g.uuid, quantity: g.quantity })),
        clientConf: false,
        deliverer: 'Unconfirmed',
        delivererConf: false,
        hasBegun: false,
        location,
        priority: priority,
        client: userId
      };
      console.log('Here')
      await db.collection("orders")
        .doc(uuid + "")
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
  },
  getOrders: async (email) => {
    try {
      const ordersRef = db.collection('orders');
      const query = await ordersRef.where('client', '==', email).get();
      return query.docs.map(doc => doc.data());
    } catch (err) {
      alert(err);
    }
  },
  getJobs: async (name) => {
    try {
      const ordersRef = db.collection('orders');
      const query = await ordersRef.where('deliverer', '==', name).get();
      return query.docs;
    } catch (err) {
      alert(err);
    }
  },
};

const groceriesWrapper = {
  getSuggestedGroceries: async (query) => {
    query = query.toLowerCase();
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
    const { email, image, password } = user;
    const record = await baseWrapper.getItem("user", email);
    if (!record) {
      try {
        await firebase.auth().createUserWithEmailAndPassword(email, password);
        const auth_image = await baseWrapper.uploadImage(image, email);
        const userObj = {
          email: user.email,
          auth_image,
          ...user,
          image: '',
          my_orders: [],
          pickup_orders: [],
          balance: 0,
          karma: 0,
          is_verified: false
        };
        await baseWrapper.setObject("user", email, userObj);
      } catch (e) {
        // Delete the user in the case we run into snags with the img upload
        const loggedInUser = firebase.auth().currentUser;
        if (loggedInUser) await loggedInUser.delete();
        throw e;
      }
    } else {
      throw new Error("This email is already registered. Please log in instead!")
    };
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

