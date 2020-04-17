import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import firebaseConfig from './firebase.config.js'

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

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
      alert(err);
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
      if (!record) await baseWrapper.setObject("user", email, {
        ...user,
        my_orders: [],
        pickup_orders: [],
        balance: 0,
        karma: 0,
        is_verified: false
      })
    } catch (err) {

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

