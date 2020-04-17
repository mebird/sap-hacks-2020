import firebase from "./firebasedb";

async function generateUser() {
    const results = await fetch("https://randomuser.me/api/", { method: "GET" }).then(res => res.json())
    const { name: { first, last }, location: { city }, email, login: { password } } = results[0];
    return { name: `${first} ${last}`, location: city, email, password: password };
}

async function populateUsers() {
    await firebase.addUser(generateUser());
}

populateUsers();