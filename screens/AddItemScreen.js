import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, FlatList } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';

function Item({ title, dashed }) {
    return (
        <View style={{ ...styles.item, borderStyle: dashed ? 'dashed' : 'inherit' }}>
            <Text style={styles.title}>{title}</Text>
        </View>
    );
}

export default function AddItemScreen() {
    const items = [
        { title: 'Coca-Cola Soft Drinks, Regular, 355 mL, 24/CT' },
        { title: 'Shoppers Drug Mart' },
        { title: 'Whole Foods Market' },
    ];
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.items}>
                <FlatList
                    data={items}
                    renderItem={({ item }) => <Item title={item.title} />}
                    keyExtractor={(item, i) => `${i}`}
                />
                <Item title="Add Item" dashed />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
    },
    contentContainer: {
        paddingTop: 15,
        alignItems: 'center',
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
    },
});
