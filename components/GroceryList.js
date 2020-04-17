import React, { useState, useEffect } from 'react';
import { CheckBox, View } from 'react-native';
import firebase from '../firebasedb';

function GroceryItem(props) {
    let { uuid, onChange, quantity = 0, checked = false, viewMode = false } = props;
    return <CheckBox
        key={uuid}
        id={uuid}
        disabled={viewMode}
        checked
        onPress={() => {
            checked = !checked;
            onChange({ uuid, checked, quantity });
        }} />
}

export function ClientGroceryList(props) {
    const { groceries = [], viewMode } = props;
    const [products, setProducts] = useState(groceries.reduce((prev, curr) => ({ ...prev, [curr[uuid]]: curr }), {}));

    // Handle the order creation
    const onSubmit = () => {
        const selectedProducts = Object.values(products).filter(p => p.checked);
        console.log(selectedProducts);
    };

    const onChange = ({ uuid, checked, quantity }) => setProducts(products => ({ ...products, [uuid]: { ...products[uuid], checked, quantity } }));

    // Attach updateProducts to the search header
    useEffect(() => { updateProducts("t", setProducts) }, []);

    return (
        <View>
        {Object.values(products).map(p => GroceryItem({ ...p, onChange, viewMode }))}
        </View>
    )
}

async function updateProducts(query, setProducts) {
    searchProducts(query)
        .then(res =>
            setProducts(products => {
                res.forEach(p => {
                    if (!products[p.uuid]) products[p.uuid] = p;
                });
                return products;
            }));
}

async function searchProducts(query) {
    return await firebase.getSuggestedGroceries(query);
}
