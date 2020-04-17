import * as React from 'react';
import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useStoreState } from 'easy-peasy';
import fireDb from '../firebasedb';

function Item({ title }) {
    return (
        <View style={styles.item}>
            <Text style={styles.title}>{title}</Text>
        </View>
    );
}

export default function ViewOrderScreen() {
    const { user: { karma = 0, name, auth_image, email } } = useStoreState(state => state || { user: {} });
    const [recentHistory, setRecentHistory] = React.useState();

    React.useEffect(() => {
        const getRctHistory = async () => {
            try {
                const history = await fireDb.getOrders(email);
                setRecentHistory(history.filter(order => !order.clientConf || !order.delivererConf));
            } catch (err) {
                alert(err);
            }
        }
        getRctHistory()
    },[])
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.profile}>
                <Image
                    style={styles.profilePicture}
                    source={{ uri: auth_image }}
                />
                <Text style={styles.userName}>{name}</Text>
                <Text style={styles.text}>Karma {karma}</Text>
            </View>
            <View style={styles.history}>
                <FlatList
                    data={recentHistory}
                    contentContainerStyle={styles.historyList}
                    renderItem={({ item }) => <Item title={`${item.deliverer} is delivering from ${item.location} for your order of: ` + item.groceries.map(food => `${food.uuid} x${food.quantity} `)} />}
                    keyExtractor={(item, i) => `${i}`}
                    ListHeaderComponent={<Text style={{ fontWeight: 'bold' }}>Ongoing Orders</Text>}
                />
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
        width: '90%',
        marginBottom: 10,
    },
    summary: {
        flex: 1,
        width: '90%',
        marginBottom: 10,
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
