import React, { useEffect, useState } from 'react';
import { FlatList, View, ActivityIndicator, StyleSheet, Text } from "react-native";
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import OrderItem from '../../components/shop/OrderItem';
import * as OrdersActions from '../../store/actions/orders'
import Colors from '../../constants/Colors';

const OrdersScreen = props => {
    const orders = useSelector(state => state.orders.orders);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => { 
        setIsLoading(true);
        dispatch(OrdersActions.fetchOrders())
        .then(() => {
            setIsLoading(false);
        })
    }, [dispatch])
    if(isLoading) {
        return <View style={styles.centered}>
            <ActivityIndicator size='large' color={Colors.primaryColor} />
        </View>
    }

    if(orders.length === 0) {
        return <View style={{flex: 1, justifyContent: 'center', alignItems: "center"}}>
            <Text>No Products found, maybe start ordering some</Text>
        </View>
    }

    return <FlatList
        data={orders}
        keyExtractor={item => item.id}
        renderItem={itemData =>
            <OrderItem
                amount={itemData.item.totalAmount}
                date={itemData.item.readableDate}
                items={itemData.item.items}
            />}
    />
};

OrdersScreen.navigationOptions = (navdata) => {
    return {
        headerTitle: 'Your Orders',
        headerLeft: () => <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item title='Menu' iconName='ios-menu' onPress={() => {
                navdata.navigation.toggleDrawer();
            }} />
        </HeaderButtons>
    }
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})



export default OrdersScreen;