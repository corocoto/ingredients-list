import React, {useState, useCallback} from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

const Ingredients = () => {
    const [userIngredients, setUserIngredients] = useState([]);
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
            setUserIngredients(prevState => [...prevState, {id, ...ingredient}]);
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
            setUserIngredients(prevState => prevState.filter(ingredient => ingredient.id !== id));
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredIngredientsHandler = useCallback(filteredIngredients => setUserIngredients(filteredIngredients), []);

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
