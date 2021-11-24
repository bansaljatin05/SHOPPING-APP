import React from 'react';
import { FlatList, Button, Alert, View, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ProductItem from '../../components/shop/ProductItem';
import HeaderButton from '../../components/UI/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import * as productActions from '../../store/actions/products';
import Colors from '../../constants/Colors'

const UserProductScreen = props => {
    const userProduct = useSelector(state => state.products.userProducts);
    const editProductHandler = (id) => {
        props.navigation.navigate('EditProduct', { productId: id });
    }
    const dispatch = useDispatch()
    const deleteHandler = (id) => {
        Alert.alert('Are you Sure ?', 'Do You really want to delete this item?', [
            { text: 'No', style: 'default', onPress: () => { } },
            { text: 'Yes', style: 'destructive', onPress: () => { dispatch(productActions.deleteProduct(id)) } }
        ]);
    };

    if(userProduct.length === 0) {
        return <View style={{flex: 1, justifyContent: 'center', alignItems: "center"}}>
            <Text>No Products found, maybe start creating some</Text>
        </View>
    }
    return <FlatList
        data={userProduct}
        keyExtractor={item => item.id}
        renderItem={itemData =>
            <ProductItem
                image={itemData.item.imageUrl}
                title={itemData.item.title}
                price={itemData.item.price}
                onSelect={() => { editProductHandler(itemData.item.id); }}
            >
                <Button color={Colors.primaryColor} title="Edit" onPress={() => { editProductHandler(itemData.item.id); }} />
                <Button color={Colors.primaryColor} title="Delete" onPress={() => deleteHandler(itemData.item.id)} />
            </ProductItem>}
    />
}
UserProductScreen.navigationOptions = navdata => {
    return {
        headerTitle: 'Your Products',
        headerLeft: () => <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item title='Admin' iconName='ios-menu' onPress={() => {
                navdata.navigation.toggleDrawer();
            }} />
        </HeaderButtons>,
        headerRight: () => <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item title='Add' iconName='ios-create' onPress={() => {
                navdata.navigation.navigate('EditProduct');
            }} />
        </HeaderButtons>
    }
}

export default UserProductScreen;