import React, {useCallback, useReducer, useMemo} from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

const ingredientsReducer = (ingredientsState, action) => {
    switch (action.type) {
        case 'SET':
            return action.ingredients;
        case  'ADD':
            return [...ingredientsState, action.ingredient];
        case 'DELETE':
            return ingredientsState.filter(ingredient => ingredient.id !== action.id);
        default:
            throw new Error('Should not get here!');
    }
};

const httpRequests = (curHttpState, action) => {
    switch (action.type) {
        case 'SEND':
            return {error: null, loading: true};
        case 'RESPONSE':
            return {...curHttpState, loading: false};
        case 'ERROR':
            return  {loading: false, error: action.errorMessage};
        case 'CLEAR':
            return {...curHttpState, error: null};
        default:
            throw new Error('Should not be reached!');
    }
}

const Ingredients = () => {
    const [userIngredients, dispatch] = useReducer(ingredientsReducer, []);
    const [httpState, httpDispatch] = useReducer(httpRequests, {loading: false, error: null})

    const addIngredientHandler = useCallback(async ingredient => {
        httpDispatch({type: 'SEND'});
        try {
            const response = await fetch('https://ingredients-list-941ab.firebaseio.com/ingredients.json', {
                method: 'POST',
                body: JSON.stringify(ingredient),
                headers: {
                    'Content-type': 'application/json'
                }
            });
            const id = response.json().name + Math.floor(Math.random() * 1000).toString();
            dispatch({type: 'ADD', ingredient: {id, ...ingredient}});
            httpDispatch({type: 'RESPONSE'});
        } catch (error) {
            httpDispatch({type: 'ERROR', errorMessage: error.message});
        }
    }, []);

    const removeIngredientHandler = useCallback(async id => {
        httpDispatch({type: 'SEND'});
        try {
            await fetch(`https://ingredients-list-941ab.firebaseio.com/ingredients/${id}.json`, {method: 'DELETE'});
            dispatch({type: 'DELETE', id});
            httpDispatch({type: 'RESPONSE'});
        } catch (error) {
            httpDispatch({type: 'ERROR', errorMessage: error.message});
        }
    }, []);

    const filteredIngredientsHandler = useCallback(filteredIngredients =>
        dispatch({type: 'SET', ingredients: filteredIngredients}), []);

    const clearError = useCallback(() => httpDispatch({type: 'CLEAR'}), []);

    const ingredientList = useMemo(() => (
        <IngredientList
            ingredients={userIngredients}
            onRemoveItem={removeIngredientHandler}
            loading={httpState.loading}
        />
    ), [userIngredients, removeIngredientHandler, httpState.loading]);

    return (
        <div className="App">
            {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
            <IngredientForm onAddIngredient={addIngredientHandler}/>
            <section>
                <Search onLoadIngredients={filteredIngredientsHandler}/>
                {ingredientList}
            </section>
        </div>
    );
}

export default Ingredients;
