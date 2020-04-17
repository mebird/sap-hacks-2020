import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { Button } from 'react-native-elements';
import * as React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';

function Item({ title }) {
    return (
        <View style={styles.item}>
            <Text style={styles.title}>{title}</Text>
        </View>
    );
}

export default function DashboardScreen(props) {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.logo}>
                <Text style={styles.titleLabel}>StaySafe</Text>
                <Image
                    style={styles.logoPicture}
                    source={require('../assets/images/on-demand-deliveries-polaris.png')}
                />
            </View>

            <View style={styles.fixToText}>
                <Button
                    title="PLACE ORDER"
                    titleStyle={{ color: '#2B3158' }}
                    type="outline"
                    buttonStyle={styles.placeOrderBtn}
                    onPress={() => props.navigation.push("Place an Order")}
                />
                <Button
                    title="PICKUP ORDER"
                    buttonStyle={styles.viewOrderBtn}
                    onPress={() => props.navigation.push("Pickup an Order")}
                />
            </View>
            <View style={styles.fixToText}>
                <Button
                    title="VIEW HISTORY"
                    buttonStyle={styles.viewHistoryBtn}
                    onPress={() => props.navigation.push("View an History")}
                />
                <Button
                    title="VIEW ORDER"
                    buttonStyle={styles.needHelpBtn}
                    onPress={() => props.navigation.push("View Current Orders")}
                />
            </View>
            <View style={styles.fixToText}>
                <Button
                    title="LEADERBOARD"
                    buttonStyle={styles.leaderboardBtn}
                    onPress={() => props.navigation.push("Leaderboard")}
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
        height: 100,
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
    leaderboardBtn: {
        backgroundColor: '#7F7A8F',
        height: 100,
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
    },
    title: {},
});
