import React, {useState, useCallback} from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
    const [userIngredients, setUserIngredients] = useState([]);

    const addIngredientHandler = async ingredient => {
        const response = await fetch('https://ingredients-list-941ab.firebaseio.com/ingredients.json', {
            method: 'POST',
            body: JSON.stringify(ingredient),
            headers: {
                'Content-type': 'application/json'
            }
        });
        const id = response.json().name + Math.floor(Math.random() * 1000).toString();
        setUserIngredients(prevState => [...prevState, {id, ...ingredient}]);
    };

    const removeIngredientHandler = id => {
        setUserIngredients(prevState => prevState.filter(ingredient => ingredient.id !== id));
    };

    const filteredIngredientsHandler = useCallback(filteredIngredients => setUserIngredients(filteredIngredients), []);

    return (
        <div className="App">
            <IngredientForm onAddIngredient={addIngredientHandler}/>

            <section>
                <Search onLoadIngredients={filteredIngredientsHandler}/>
                <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler}/>
            </section>
        </div>
    );
}

export default Ingredients;
