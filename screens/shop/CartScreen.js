import React, { useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import CartItem from '../../components/shop/CartItem';
import Colors from '../../constants/Colors';
import * as cartActions from '../../store/actions/cart';
import * as orderActions from '../../store/actions/orders';


const CartScreen = props => {

    const [isLoading, setIsloading] = useState(false)
    const cartTotalAmount = useSelector(state => state.cart.totalAmount);
    const cartItems = useSelector(state => {
        const transFormCartItems = [];

        for (const key in state.cart.items) {
            transFormCartItems.push({
                productId: key,
                productTitle: state.cart.items[key].productTitle,
                quantity: state.cart.items[key].quantity,
                sum: state.cart.items[key].sum
            });
        }
        return transFormCartItems.sort((a, b) => a.productId > b.productId ? 1 : -1);
    });

    const dispatch = useDispatch();
    const sendOrderHandler = async () => {
        setIsloading(true);
        await dispatch(orderActions.addOrder(cartItems, cartTotalAmount));
        setIsloading(false);
    }

    return (
        <View style={Styles.screen}>
            <View style={Styles.summary}>
                <Text style={Styles.summaryText}>Total: <Text style={Styles.amount}>${Math.round(cartTotalAmount.toFixed(2) * 100 / 100)}</Text></Text>
                {isLoading
                    ? <ActivityIndicator size={'small'} color={Colors.primaryColor} />
                    : <Button color={Colors.accentColor} title="Order Now" disabled={cartItems.length === 0} onPress={sendOrderHandler} />
                }

            </View>
            <FlatList
                data={cartItems}
                keyExtractor={item => item.productId}
                renderItem={itemData =>
                    <CartItem
                        deletable={true}
                        quantity={itemData.item.quantity}
                        title={itemData.item.productTitle}
                        amount={itemData.item.sum}
                        onRemove={() => {
                            dispatch(cartActions.removeFromCart(itemData.item.productId));
                        }}
                    />
                }
            />
        </View>
    );
};

CartScreen.navigationOptions = {
    headerTitle: 'Your Cart',
}


const Styles = StyleSheet.create({
    screen: {
        margin: 20,
    },
    summary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { height: 2, width: 0 },
        shadowRadius: 8,
        elevation: 5,
        borderRadius: 10,
        backgroundColor: 'white',
        padding: 10
    },
    summaryText: {
        fontFamily: 'open-sans-bold',
        fontSize: 18,

    },
    amount: {
        color: Colors.accentColor
    }
});

export default CartScreen