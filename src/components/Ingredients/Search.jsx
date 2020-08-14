import React, {useState, useEffect, useRef} from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
    const {onLoadIngredients} = props;
    const [enteredFilter, setEnteredFilter] = useState('');
    const inputRef = useRef(null);


    useEffect(() => {
        const timer = setTimeout(()=>{
            if (enteredFilter === inputRef.current.value){
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
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [enteredFilter, onLoadIngredients, inputRef]);

    return (
        <section className="search">
            <Card>
                <div className="search-input">
                    <label>Filter by Title</label>
                    <input
                        type="text"
                        ref={inputRef}
                        value={enteredFilter}
                        onChange={event => setEnteredFilter(event.target.value)}
                    />
                </div>
            </Card>
        </section>
    );
});

export default Search;
