
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, FlatList, TextInput } from 'react-native';
import fireDb from '../firebasedb';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { useStoreActions } from 'easy-peasy';

function Item({ item: { uuid, price }, dashed, setItem, selected }) {
    const itemStyles = [styles.item, { borderStyle: (dashed && !selected) ? 'dashed' : 'inherit' }];
    if (selected) itemStyles.push(styles.selected);
    return (
        <TouchableOpacity
            style={itemStyles}
            onPress={() => selected ? setItem(null) : setItem({ uuid, price })}>
            <View style={{ flex: 1 }}>
                <Text style={{ color: (selected ? 'white' : 'black') }}>{uuid}</Text>
            </View>
            <View style={{ flex: 1 }}>
                <Text style={{ textAlign: 'right', color: (selected ? 'white' : 'black') }}>{`$${price}`}</Text>
            </View>
        </TouchableOpacity>
    );
}

export default function AddItemScreen(props) {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [item, setItem] = useState(null);
    const [items, setItems] = useState([]);
    const { addItem } = useStoreActions(s => s.myOrder);

    useEffect(() => {
        (async () => setItems(await fireDb.getCollection('grocery_items')))();
    }, []);
    const onPress = () => {
        if (item) addItem({ ...item, quantity });
        props.onPress();
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <View style={styles.items}>
                    <Text style={{ fontWeight: 'bold' }}>Add Item</Text>
                    <TextInput
                        placeholder="eggs"
                        autoCapitalize="none"
                        style={styles.textInput}
                        onChangeText={async (text) => {
                            setName(text);
                            const suggestions = await fireDb.getSuggestedGroceries(text);
                            if (item) suggestions.unshift(item);
                            const filteredItems = suggestions.filter((v, i, a) => a.findIndex(t => (t.uuid === v.uuid)) === i);
                            await setItems(filteredItems);
                        }}
                        value={name}
                    />
                    <FlatList
                        data={items}
                        renderItem={(i) =>
                            <Item
                                item={i.item}
                                dashed
                                setItem={setItem}
                                selected={!!item && item.uuid === i.item.uuid} />}
                        keyExtractor={(item, i) => `${i}`}
                    />
                </View>
            </ScrollView >
            <View style={styles.footer}>
                <TextInput
                    placeholder={"1"}
                    style={{ ...styles.textInput, width: 80 }}
                    keyboardType={"numberic"}
                    onChangeText={t => setQuantity(Number(t))}
                    value={`${quantity}`} />
                <TouchableOpacity
                    style={styles.submitBtn}
                    onPress={onPress}
                >
                    <Text style={styles.btnText}> + </Text>
                </TouchableOpacity>
            </View>
        </View >
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
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        flex: 1,
        backgroundColor: '#F2F3FA',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
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
    selected: {
        backgroundColor: '#FF5300',
        color: 'white',
        borderColor: 'transparent'
    },
    textInput: {
        borderColor: '#2B3158',
        height: 40,
        borderRadius: 3,
        borderWidth: 1,
        marginTop: 10,
        paddingLeft: 10,
        paddingRight: 8
    },
    submitBtn: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 3,
        padding: 10,
        backgroundColor: '#2B3158',
        width: 40,
        height: 40,
        alignItems: 'center',
        margin: 10
    },
    btnText: {
        color: 'white',
    }
});
