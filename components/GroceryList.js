import React, { useState, useEffect } from 'react';

export function GroceryList(props) {
    const [products, setProducts] = useState([]);
    useEffect(() => { searchProducts('eggs').then(setProducts); }, []);;
    if (products.length === 0) return <div>LOADING</div>;
    return <div>"HI!"</div>;
}

const apiKey = '';
const baseUrl = 'https://api.spoonacular.com';

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