import * as React from 'react';
import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useStoreState } from 'easy-peasy';

function Item({ title }) {
    return (
        <View style={styles.item}>
            <Text style={styles.title}>{title}</Text>
        </View>
    );
}

export default function ProfileScreen() {
    const { user: { karma = 0, name } } = useStoreState(state => state.user || { user: {} });
    const recentHistory = [
        { title: 'Save on Foods' },
        { title: 'Shoppers Drug Mart' },
        { title: 'Whole Foods Market' },
    ];
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.profile}>
                <Image
                    style={styles.profilePicture}
                    source={{
                        uri: 'https://i.pinimg.com/originals/9f/10/f6/9f10f61ab04adb749c4b762b6e543c26.jpg'
                    }}
                />
                <Text style={styles.userName}>{name}</Text>
                <Text style={styles.text}>Karma {karma}</Text>
            </View>
            <View style={styles.history}>
                <FlatList
                    data={recentHistory}
                    contentContainerStyle={styles.historyList}
                    renderItem={({ item }) => <Item title={item.title} />}
                    keyExtractor={(item, i) => `${i}`}
                    ListHeaderComponent={<Text style={{ fontWeight: 'bold' }}>Recent History</Text>}
                />
            </View>
            <View style={styles.summary}>
                <Text style={{ fontWeight: 'bold' }}>Summary</Text>
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
    profile: {
        flex: 1,
        alignItems: 'center',
        marginVertical: 20,
    },
    history: {
        flex: 1,
        // alignItems: 'center',
        width: '90%',
        marginBottom: 10,
    },
    summary: {
        flex: 1,
        width: '90%',
    },
    profilePicture: {
        height: 75,
        width: 75,
        borderRadius: 75,
    },
    userName: {
        margin: 2.5,
        fontWeight: 'bold',
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
    },
    title: {},
});