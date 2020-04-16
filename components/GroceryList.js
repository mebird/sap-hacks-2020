import * as React from 'react';
import { Text } from 'react-native';

export function MonoText(props) {
    return <Text {...props} style={[props.style, { fontFamily: 'space-mono' }]} />;
}


const apiKey = '';
const baseUrl = 'https://api.spoonacular.com';

async function searchProducts(query, exclude = []) {
    const qs = getQueryString({ apiKey, query });
    fetch(`${baseUrl}/food/products/search?${qs}`, { method: 'GET' })
        .then(res => res.json())
        .then(resJson => resJson.products)
        .then(products => Promise.all(products.map(p => getInfo(p))));
}

async function getInfo(product) {
    const qs = getQueryString({ apiKey, id: product.id });
    fetch(`${baseUrl}/food/products`, { method: 'GET' })
        .then(res => res.json());
}

function getQueryString(obj) {
    return Object.keys(obj)
        .reduce(result, key => [...result, `${encodeURIComponent(key)}=${encodeURIComponent(queries[key])}`], [])
        .join('&');
}