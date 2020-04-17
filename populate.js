import firebase from "./firebasedb";

async function generateUser() {
    const results = await fetch("https://randomuser.me/api/", { method: "GET" }).then(res => res.json());
    const { name: { first, last }, location: { city }, email, login: { password }, phone, picture: { large } } = results.results[0];
    return await firebase.addUser({
        name: `${first} ${last}`,
        location: city,
        phonenumber: phone,
        auth_image: large,
        email,
        password
    });
}

async function generateGrocery() {
    const uuid = (await fetch("https://random-word-api.herokuapp.com/word?number=1", { method: "GET" }).then(res => res.json()))[0];
    const price = Math.floor(Math.random() * 10000) / 100;
    return firebase.setObject("grocery_items", uuid, { uuid, price });
}

const populate = async () => {
    generateUser();
    generateGrocery();
}

export default populate;
