import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, ActivityIndicator, View, StyleSheet, Text, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import ProductItem from '../../components/shop/ProductItem';
import * as CartActions from '../../store/actions/cart';
import * as productsActions from '../../store/actions/products';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors'

const ProductsOverviewScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [error, setError] = useState();
    const products = useSelector(state => state.products.availableProducts);
    const dispatch = useDispatch();
    
    const loadProducts = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        try {
            await dispatch(productsActions.fetchProducts());
        } catch(err) {
            setError(err.message);
        }
        setIsRefreshing(false)
    }, [dispatch, setIsLoading, setError]);

    useEffect(() => {
        const willFocusSub = props.navigation.addListener('willFocus', loadProducts);
        return () => {
            willFocusSub.remove();
        } 
    }, [loadProducts]);
    
    useEffect(() => {
        setIsLoading(true);
        loadProducts().then(() => {
            setIsLoading(false)
        })
    }, [dispatch, loadProducts]);
         
    const selectItemHandler = (id, title) => {
        props.navigation.navigate('ProductDetail', { productId: id, productTitle: title })
    };

    if(error) {
        return <View style={styles.centered}>
            <Text>An error Occured</Text>
            <Button title="Try Again" onPress={() => {loadProducts}} color={Colors.primaryColor} />
        </View>
    }

    if (isLoading) {
        return <View style={styles.centered}>
            <ActivityIndicator size='large' color={Colors.primaryColor} />
        </View>
    }
    if (!isLoading && products.length === 0) {
        return <View style={styles.centered}>
            <Text>No Products Found.. Maybe Start adding Some</Text>
        </View>
    }

    return <FlatList
        data={products}
        onRefresh={loadProducts}
        refreshing={isRefreshing}
        keyExtractor={item => item.id}
        renderItem={itemData =>
            <ProductItem
                image={itemData.item.imageUrl}
                title={itemData.item.title}
                price={itemData.item.price}
                onSelect={() => {
                    selectItemHandler(itemData.item.id, itemData.item.title)
                }}
            >
                <Button color={Colors.primaryColor} title="View Details" onPress={() => selectItemHandler(itemData.item.id, itemData.item.title)} />
                <Button color={Colors.primaryColor} title="To Cart" onPress={() => {
                    dispatch(CartActions.addToCart(itemData.item));
                }} />
            </ProductItem>
        }
    />
}

ProductsOverviewScreen.navigationOptions = navdata => {
    return {
        headerTitle: 'All Products',
        headerLeft: () => <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item title='Menu' iconName='ios-menu' onPress={() => {
                navdata.navigation.toggleDrawer();
            }} />
        </HeaderButtons>,
        headerRight: () => <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item title='Cart' iconName='ios-cart' onPress={() => {
                navdata.navigation.navigate('Cart')
            }} />
        </HeaderButtons>
    }
};

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default ProductsOverviewScreen;