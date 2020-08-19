import React, {useState, useEffect, useRef} from 'react';
import useHttp from '../../hooks/useHttp';
import Card from '../UI/Card';
import ErrorModal from '../UI/ErrorModal';
import './Search.css';

const Search = React.memo(props => {
    const {onLoadIngredients} = props;
    const [enteredFilter, setEnteredFilter] = useState('');
    const inputRef = useRef(null);
    const {data, sendRequest, loading, error, clear} = useHttp();

    useEffect(() => {
        const timer = setTimeout(()=>{
            if (enteredFilter === inputRef.current.value){
                const query = enteredFilter.length ? `?orderBy="title"&equalTo="${enteredFilter}"` : '';
                sendRequest(`https://ingredients-list-941ab.firebaseio.com/ingredients.json${query}`, 'GET');
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [enteredFilter, inputRef, sendRequest]);

    useEffect(() => {
        if (data && !error && !loading){
            const loadedIngredients = [];
            for (const key in data) {
                loadedIngredients.push({
                    id: key,
                    ...data[key]
                });
            }
            onLoadIngredients(loadedIngredients);
        }
    }, [data, loading, error, onLoadIngredients]);

    return (
        <section className="search">
            {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
            <Card>
                <div className="search-input">
                    <label>Filter by Title</label>
                    {loading && <span>Loading...</span>}
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
