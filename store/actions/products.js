import Product from "../../models/Product";

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';

export const fetchProducts = () => {
    return async (dispatch, getState) => {
        // any async code!!
        const userId = getState().auth.userId;
        try {
            const response = await fetch('https://clone-54f57.firebaseio.com/products.json');

            if (!response.ok) {
                throw new Error('Something went wrong')
            }
            const resData = await response.json();
            const loadedProducts = [];
            for (const key in resData) {
                loadedProducts.push(new Product(key, resData[key].ownerId, resData[key].title, resData[key].imageUrl, resData[key].description, resData[key].price));
            }
            dispatch({ type: SET_PRODUCTS, products: loadedProducts, userProducts: loadedProducts.filter(prod => prod.ownerId === userId ) })
        } catch (err) {
            //send to custom analytics server
            throw err
        }
    }
}

export const deleteProduct = productId => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const response = await fetch(`https://clone-54f57.firebaseio.com/products/${productId}.json?auth=${token}`, {
            method: 'DELETE',
        });
        if(!response.ok) {
            throw new Error('Something went Wrong')
        }
        dispatch({ type: DELETE_PRODUCT, pid: productId });
    }
    return 
};

export const createProduct = (title, description, imageUrl, price) => {
    return async (dispatch, getState) => {
        // any async code!!
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        const response = await fetch(`https://clone-54f57.firebaseio.com/products.json?auth=${token}`, {
            method: 'POST',
            header: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description,
                imageUrl,
                price,
                ownerId: userId
            })
        });
        const resData = await response.json();
        console.log(resData)

        dispatch({
            type: CREATE_PRODUCT,
            productData: {
                id: resData.name,
                title,
                description,
                imageUrl,
                price,
                ownerId: userId
            }
        })
    }
};

export const updateProduct = (id, title, description, imageUrl, price) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const response = await fetch(`https://clone-54f57.firebaseio.com/products/${id}.json?auth=${token}`, {
            method: 'PUT',
            header: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description,
                imageUrl,
                price
            })
        });
        if(!response.ok) {
            throw new Error('Something went Wrong!!!')
        }
        dispatch({
            type: UPDATE_PRODUCT,
            pid: id,
            productData: {
                title: title,
                description: description, //or you can write only name the items will be automatically mapped
                imageUrl
            }
        });
    }
};