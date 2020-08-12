import React, {useState, useEffect} from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
    const [userIngredients, setUserIngredients] = useState([]);

    useEffect(() => {
        fetch('https://ingredients-list-941ab.firebaseio.com/ingredients.json')
            .then(response => response.json())
            .then(data => {
                const loadedIngredients = [];
                for (const key in data){
                    loadedIngredients.push({
                        id: key,
                        ...data[key]
                    });
                }
                setUserIngredients(loadedIngredients);
            });
    }, []); //if second argument's value looks like `[]`, so it'll work like `componentDidMount`

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
