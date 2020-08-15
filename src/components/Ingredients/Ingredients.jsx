import React, {useState, useCallback, useReducer} from 'react';

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
            return new Error('Should not get here!');
    }
};

const Ingredients = () => {
    const [userIngredients, dispatch] = useReducer(ingredientsReducer, []);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const addIngredientHandler = async ingredient => {
        setIsLoading(true);
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
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }

    };

    const removeIngredientHandler = async id => {
        setIsLoading(true);
        try {
            await fetch(`https://ingredients-list-941ab.firebaseio.com/ingredients/${id}.json`, {method: 'DELETE'});
            dispatch({type: 'DELETE', id});
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredIngredientsHandler = useCallback(filteredIngredients =>
        dispatch({type: 'SET', ingredients: filteredIngredients}), []);

    const clearError = () => setError('');

    return (
        <div className="App">
            {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
            <IngredientForm onAddIngredient={addIngredientHandler}/>
            <section>
                <Search onLoadIngredients={filteredIngredientsHandler}/>
                <IngredientList
                    ingredients={userIngredients}
                    onRemoveItem={removeIngredientHandler}
                    loading={isLoading}
                />
            </section>
        </div>
    );
}

export default Ingredients;
