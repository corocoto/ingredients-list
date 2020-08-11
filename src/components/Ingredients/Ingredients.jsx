import React, {useState} from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
    const [userIngredients, setUserIngredients] = useState([]);

    const addIngredientHandler = ingredient => {
        setUserIngredients(prevState => [
            ...prevState,
            {
                id: Math.floor(Math.random() * 10000).toString(),
                ...ingredient
            }
        ]);
    };

    const removeIngredientHandler = id => {
        setUserIngredients(prevState => prevState.filter(ingredient => ingredient.id !== id));
    };

    return (
        <div className="App">
            <IngredientForm onAddIngredient={addIngredientHandler}/>

            <section>
                <Search/>
                <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler}/>
            </section>
        </div>
    );
}

export default Ingredients;
