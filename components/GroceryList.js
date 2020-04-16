import React, { useState, useEffect } from 'react';
import { CheckBox } from 'react-native';

function GroceryItem(props) {
    let { id, price = 0, images = [], title, onChange, quantity = 0, checked = false } = props;
    return <CheckBox
        key={id}
        id
        title
        checked
        onClick={() => {
            checked = !checked;
            onChange({ id, price, checked, quantity });
        }} />
}

export function ClientGroceryList() {
    const [products, setProducts] = useState({ 1234: { id: 1234, title: "Test" } });
    const onSubmit = () => {
        const selectedProducts = Object.values(products).filter(p => p.checked);
        console.log(selectedProducts);
    };
    const onChange = ({ id, price, checked, quantity }) => setProducts(products => ({ ...products, [id]: { ...products[id], price, checked, quantity } }));
    useEffect(() => { updateProducts("eggs", setProducts) }, []);

    return <div>
        {Object.values(products).map(p => GroceryItem({ ...p, onChange }))}
    </div>;
}

const apiKey = '';
const baseUrl = 'https://api.spoonacular.com';

async function updateProducts(query, setProducts) {
    searchProducts(query)
        .then(res => setProducts(products => {
            let newProducts = { ...products };
            res.forEach(p => {
                if (!newProducts.has(p.id)) newProducts.set(id, p);
            });
            return newProducts;
        }));
}

async function searchProducts(query, exclude = []) {
    const qs = getQueryString({ apiKey, query });
    return fetch(`${baseUrl}/food/products/search?${qs}`, { method: 'GET' })
        .then(res => res.json())
        .then(({ products = [] }) => Promise.all(products.map(p => getInfo(p))));
}

async function getInfo(product) {
    const qs = getQueryString({ apiKey });
    return fetch(`${baseUrl}/food/products/${product.id}?${qs}`, { method: 'GET' })
        .then(res => res.json());
}

function getQueryString(obj) {
    return Object.keys(obj)
        .reduce((result, key) => [...result, `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`], [])
        .join('&');
}