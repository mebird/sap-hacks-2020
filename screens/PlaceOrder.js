import { Button, Overlay } from 'react-native-elements';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import { useStoreState, useStoreActions } from 'easy-peasy';
import AddItemScreen from './AddItemScreen';

function Item({ item: { uuid, price, quantity } }) {
    const { clearItem } = useStoreActions(s => s.myOrder);

    return (
        <View style={styles.item}>
            <View style={{ flex: 1 }}>
                <Text>{uuid}</Text>
            </View>
            <View style={{ flex: 1 }}>
                <Text style={{ textAlign: 'right' }}>{`${quantity} x $${price}`}</Text>
            </View>
            <TouchableOpacity style={styles.delete} onPress={() => clearItem({ uuid })}>
                <Text style={{ color: 'white', textAlign: 'center' }}>{`x`}</Text>
            </TouchableOpacity>
        </View>
    );
}

export default function PlaceOrder(props) {
    const { items } = useStoreState(s => s.myOrder);
    const [popover, setPopover] = useState(false);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.fixToText}>
                <Button
                    title="+ Add item"
                    titleStyle={{ color: '#2B3158' }}
                    type="outline"
                    buttonStyle={styles.addItem}
                    onPress={() => setPopover(p => !p)}
                />
            </View>
            <View style={styles.items}>
                <FlatList
                    key={items.length}
                    data={items}
                    renderItem={({ item }) => <Item item={item} />}
                    keyExtractor={(item, i) => `${i}`} />
            </View>

            <Overlay overlayStyle={styles.overlay} isVisible={popover}>
                <AddItemScreen onPress={() => setPopover(p => !p)} />
            </Overlay>

            <View style={styles.fixToText}>
                <Button
                    title="Back"
                    titleStyle={{ color: '#2B3158' }}
                    type="outline"
                    buttonStyle={styles.placeOrderBtn}
                    onPress={() => props.navigation.push("Dashboard")}
                />
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F3FA',
    },
    contentContainer: {
        paddingTop: 15,
        alignItems: 'center',
    },
    placeOrderBtn: {
        backgroundColor: '#F2F3FA',
        borderColor: '#2B3158',
        height: 50,
        width: 180,
        marginHorizontal: 10,
    },
    viewOrderBtn: {
        backgroundColor: '#737CB0',
        height: 100,
        width: 180,
        marginHorizontal: 10,
    },
    viewHistoryBtn: {
        backgroundColor: '#F8CE7F',
        height: 100,
        width: 180,
        marginHorizontal: 10,
    },
    needHelpBtn: {
        backgroundColor: '#2B3158',
        height: 100,
        width: 180,
        marginHorizontal: 10,
    },
    addItem: {
        borderStartColor: '#2B3158',
        borderStyle: 'dashed',
        height: 50,
        width: 380,
        marginHorizontal: 10,
    },
    logo: {
        flex: 1,
        alignItems: 'center',
        marginVertical: 15,
    },
    fixToText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 10,
    },
    logoPicture: {
        height: 200,
        width: 400,
    },
    titleLabel: {
        margin: 2.5,
        fontWeight: 'bold',
        color: '#2B3158',
        fontSize: 20
    },
    text: {
        margin: 2.5,
        fontSize: 12
    },
    item: {
        borderWidth: 1,
        borderRadius: 3,
        padding: 10,
        marginTop: 10,
        flexDirection: 'row'
    },
    overlay: {
        borderRadius: 3,
        padding: 0
    },
    items: {
        flex: 1,
        width: '90%',
        marginBottom: 10,
    },
    delete: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'transparent',
        width: 20,
        textAlign: 'center',
        color: 'white',
        backgroundColor: 'red',
        alignSelf: 'flex-end',
        marginLeft: 10
    }
});
