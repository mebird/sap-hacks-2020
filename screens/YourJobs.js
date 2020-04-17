import * as React from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, ShadowPropTypesIOS } from 'react-native';
import { ScrollView, ForceTouchGestureHandler } from 'react-native-gesture-handler';
import { useStoreState, useStoreActions } from 'easy-peasy';
import fireDb from '../firebasedb';
import { useNavigation } from '@react-navigation/native';

function Item({ title, item }) {
    const { user: { karma = 0, name, auth_image, email } } = useStoreState(state => state || { user: {} });
    const addKarma = useStoreActions(state => state.changeKarma);

    const confirmedDelivered = async() => {
        try {
            await fireDb.setObject('orders', item.id, { ...item.data(), deliveryConf: true});
            alert('Thank you so much <3');
            addKarma(karma + 5);
            navigation.push('Root');
        } catch (err) {
            alert(err);
        }
    }
    const navigation = useNavigation();
    
    return (
        <View style={styles.item}>
            <TouchableOpacity onPress={() => confirmedDelivered()}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.title}>items: {item.data().groceries.map(item => `${item.uuid} x${item.quantity}`)}</Text>
            </TouchableOpacity>
        </View>
    );
}

export default function YourJobs() {
    const { user: { karma = 0, name, auth_image, email } } = useStoreState(state => state || { user: {} });

    const [jobs, setJobs] = React.useState();

    React.useEffect(() => {
       const getJobs = async () => {
         let yourJobs = await fireDb.getJobs(name);
         yourJobs = yourJobs.filter(doc => !doc.data().deliveryConf);
         setJobs(yourJobs);
       }
       getJobs();
    },[])

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.history}>
                <FlatList
                    data={jobs}
                    contentContainerStyle={styles.historyList}
                    renderItem={({ item }) => <Item title={`${item.data().location} for ${item.data().client} (priority: ${item.data().priority})`} item={item} />}
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
