import React, {useCallback, useReducer, useMemo, useEffect} from 'react';
import useHttp from '../../hooks/useHttp';
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

const Ingredients = () => {
    const [userIngredients, dispatch] = useReducer(ingredientsReducer, []);
    const {loading, error, data, sendRequest, reqExtra, reqId} = useHttp();

    useEffect(() => {
        if (loading || error){
            return;
        } else if (reqId === 'ADD_INGREDIENT' && data) {
            dispatch({
                type: 'ADD',
                ingredient: {
                    id: data.name + Math.floor(Math.random() * 10000).toString(),
                    ...reqExtra
                }
            });
        } else if (reqId === 'REMOVE_INGREDIENT' && !(loading && error)) {
            dispatch({
                type: 'DELETE',
                id: reqExtra
            });
        }
    }, [data, reqExtra, reqId, error, loading]);

    const addIngredientHandler = useCallback(ingredient =>
        sendRequest(
            'https://ingredients-list-941ab.firebaseio.com/ingredients.json',
            'POST',
            JSON.stringify(ingredient),
            ingredient,
            'ADD_INGREDIENT'
        ), [sendRequest]);

    const removeIngredientHandler = useCallback(id =>
        sendRequest(
            `https://ingredients-list-941ab.firebaseio.com/ingredients/${id}.json`,
            'DELETE',
            null,
            id,
            'REMOVE_INGREDIENT'
        ), [sendRequest]);

    const filteredIngredientsHandler = useCallback(filteredIngredients =>
        dispatch({
            type: 'SET',
            ingredients: filteredIngredients
        }), []);

    const clearError = useCallback(() => sendRequest({type: 'CLEAR'}), [sendRequest]);

    const ingredientList = useMemo(() =>
        <IngredientList
            ingredients={userIngredients}
            onRemoveItem={removeIngredientHandler}
            loading={loading}
        />, [userIngredients, removeIngredientHandler, loading]);

    return (
        <div className="App">
            {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
            <IngredientForm onAddIngredient={addIngredientHandler}/>
            <section>
                <Search onLoadIngredients={filteredIngredientsHandler}/>
                {ingredientList}
            </section>
        </div>
    );
};

export default Ingredients;
