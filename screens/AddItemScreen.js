
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, FlatList, TextInput } from 'react-native';
import fireDb from '../firebasedb';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import { useStoreActions } from 'easy-peasy';

function Item({ uuid, price, dashed }) {
    return (
        <View style={{ ...styles.item, borderStyle: dashed ? 'dashed' : 'inherit' }}>
            <View style={{ flex: 1 }}>
                <Text>{uuid}</Text>
            </View>
            <View style={{ flex: 1 }}>
                <Text style={{ textAlign: 'right' }}>{`$${price}`}</Text>
            </View>

        </View>
    );
}

export default function AddItemScreen(props) {
    const [name, setName] = useState('');
    const [item, setItem] = useState(null);
    const [items, setItems] = useState([]);

    console.log(JSON.stringify(items));

    useEffect(() => {
        (async () => setItems(await fireDb.getCollection('grocery_items')))();
    }, []);

    const { addItem } = useStoreActions(s => s.myOrder);

    const onPress = () => {
        if (item) addItem(item);
        props.onPress();
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.items}>
                <Text style={{ fontWeight: 'bold' }}>Add Item</Text>
                <TextInput
                    placeholder="eggs"
                    autoCapitalize="none"
                    style={styles.search}
                    onChangeText={async (text) => {
                        setName(text);
                        await setItems(await fireDb.getSuggestedGroceries(text));
                    }}
                    value={name}
                />
                <FlatList
                    data={items}
                    renderItem={({ item }) => <Item {...item} dashed />}
                    keyExtractor={(item, i) => `${i}`}
                />
                <Button title="Add Item" onPress={onPress} buttonStyle={styles.itemBtn} dashed />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F3FA'
    },
    contentContainer: {
        paddingTop: 15,
        alignItems: 'center'
    },
    items: {
        flex: 1,
        width: '90%',
        marginBottom: 10,
    },
    item: {
        borderWidth: 1,
        borderRadius: 3,
        padding: 10,
        marginTop: 10,
        flexDirection: 'row'
    },
    search: {
        borderColor: '#2B3158',
        height: 40,
        borderRadius: 3,
        borderWidth: 1,
        marginTop: 10,
        paddingLeft: 8
    },
    itemBtn: {
        backgroundColor: '#F2F3FA',
        borderColor: '#2B3158',
        height: 50,
        width: 180,
        marginHorizontal: 10,
    },
});
