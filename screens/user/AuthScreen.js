import React, { useCallback, useReducer, useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, KeyboardAvoidingView, Button, ActivityIndicator, Alert } from 'react-native';
import Input from '../../components/UI/Input';
import Colors from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';
import * as authActions from '../../store/actions/auth';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE'
const formReducer = (state, action) => {
    if (action.type === FORM_INPUT_UPDATE) {
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value
        };
        const updatedValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
        };
        let updatedFormIsValid = true;
        for (const key in updatedValidities) {
            updatedFormIsValid = updatedFormIsValid
        }
        return {
            ...state,
            formIsValid: updatedFormIsValid,
            inputValidities: updatedValidities,
            inputValues: updatedValues
        }
    }

    return state;
};

const AuthScreen = props => {
    const [isLoading, setIsLoading] = useState(false)
    const [isSignup, setIsSignup] = useState(false);
    const [error, setError] = useState();
    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            email: '',
            password: ''
        },
        inputValidities: {
            email: false,
            password: false
        },
        formIsValid: false
    });

    useEffect(() => {
        if(error) {
            Alert.alert('Error occured', error, [{text: 'Okay'}]);
        }
    },[error])

    const dispatch = useDispatch();
    const authHandler = async () => {
        let action;
        if (isSignup) {
            action = authActions.signup(formState.inputValues.email, formState.inputValues.password);
        } else {
            action = authActions.login(formState.inputValues.email, formState.inputValues.password);
        }
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(action);
            props.navigation.navigate('Shop')
        } catch (err) {
            setError(err.message)
            setIsLoading(false);
        }
    };

    const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: inputValue,
            isValid: inputValidity,
            input: inputIdentifier
        })
    }, [dispatchFormState])

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' keyboardVerticalOffset={50} style={styles.screen}>
            <LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.gradient}>
                <View style={styles.authContainer}>
                    <ScrollView>
                        <Input
                            id='email'
                            label='E-mail'
                            keyBoardType='email-address'
                            required
                            email
                            autoCapitalize='none'
                            errorText="Please enter a valid email address.."
                            onInputChange={inputChangeHandler}
                            initialValue=""
                        />
                        <Input
                            id='password'
                            label='Password'
                            keyBoardType='default'
                            secureTextEntry
                            required
                            minLength={5}
                            autoCapitalize='none'
                            errorText="Please enter a valid password.."
                            onInputChange={inputChangeHandler}
                            initialValue=""
                        />
                        <View style={styles.buttonContainer}>
                            <View style={styles.button}>
                                {isLoading
                                    ? <ActivityIndicator size={'small'} color={Colors.primaryColor}/>
                                    : <Button
                                        title={isSignup ? "Sign Up" : "Login"}
                                        color={Colors.primaryColor}
                                        onPress={authHandler}
                                    />
                                }
                            </View>
                            <View style={styles.button}>
                                <Button
                                    title={`Switch to ${isSignup ? 'Login' : 'Sign Up'}`}
                                    color={Colors.accentColor}
                                    onPress={() => {
                                        setIsSignup(prevState => !prevState);
                                    }}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
};

AuthScreen.navigationOptions = {
    headerTitle: 'Login'
}

const styles = StyleSheet.create({
    authContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 5,
        width: '80%',
        maxWidth: 400,
        maxHeight: 400,
        padding: 15
    },
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gradient: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        marginTop: 5,
    }
});

export default AuthScreen;