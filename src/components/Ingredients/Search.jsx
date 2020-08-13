import React, {useState, useEffect} from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
    const {onLoadIngredients} = props;
    const [enteredFilter, setEnteredFilter] = useState('');

    useEffect(() => {
        const query = enteredFilter.length ? `?orderBy="title"&equalTo="${enteredFilter}"` : '';
        fetch(`https://ingredients-list-941ab.firebaseio.com/ingredients.json${query}`)
            .then(response => response.json())
            .then(data => {
                const loadedIngredients = [];
                for (const key in data) {
                    loadedIngredients.push({
                        id: key,
                        ...data[key]
                    });
                }
                onLoadIngredients(loadedIngredients);
            });
    }, [enteredFilter, onLoadIngredients]);

    return (
        <section className="search">
            <Card>
                <div className="search-input">
                    <label>Filter by Title</label>
                    <input type="text" value={enteredFilter} onChange={event => setEnteredFilter(event.target.value)}/>
                </div>
            </Card>
        </section>
    );
});

export default Search;
