import React from 'react';
import { View, Text, Image, Button, StyleSheet, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux'
import Colors from '../../constants/Colors';
import * as CartActions from '../../store/actions/cart';

const ProductDetailScreen = props => {
    const productId = props.navigation.getParam('productId');
    const selectedProduct = useSelector(state => state.products.availableProducts.find(prod => prod.id === productId));
    const dispatch = useDispatch();

    return (
        <ScrollView>
            <Image style={styles.image} source={{ uri: selectedProduct.imageUrl }} />
            <View style={styles.actions}> 
                <Button color={Colors.primaryColor} title='Add to Cart' onPress={() => {
                    dispatch(CartActions.addToCart(selectedProduct))
                }} />
            </View>
            <Text style={styles.price}>
                ${selectedProduct.price.toFixed(2)}
            </Text>
            <Text style={styles.description}>
                {selectedProduct.description}
            </Text>
        </ScrollView>
    );
}

ProductDetailScreen.navigationOptions = navData => {
    return {
        headerTitle: navData.navigation.getParam('productTitle')
    };
}

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 300
    },
    price: {
        fontSize: 20,
        color: '#888',
        textAlign: 'center',
        margin: 20,
        fontFamily: 'open-sans-bold'
    },
    description: {
        fontFamily: 'open-sans',
        fontSize: 14,
        textAlign: 'center',
        marginHorizontal: 20
    },
    actions: {

    }
})

export default ProductDetailScreen