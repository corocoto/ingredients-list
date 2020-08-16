import {useReducer, useCallback} from 'react';

const httpRequests = (curHttpState, action) => {
    switch (action.type) {
        case 'SEND':
            return {error: null, loading: true, data: null, extra: null, identifier: action.identifier};
        case 'RESPONSE':
            return {...curHttpState, loading: false, data: action.responseData, extra: action.extra};
        case 'ERROR':
            return {loading: false, error: action.errorMessage};
        case 'CLEAR':
            return {...curHttpState, error: null};
        default:
            throw new Error('Should not be reached!');
    }
};

const useHttp = () => {
    const [httpState, httpDispatch] = useReducer(httpRequests, {
        loading: false,
        error: null,
        data: null,
        extra: null,
        identifier: null
    });

    const sendRequest = useCallback(async (url, method, body, reqExtra, reqId) => {
        httpDispatch({type: 'SEND', identifier: reqId});
        try {
            const response = await fetch(url, {
                method,
                body,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            httpDispatch({type: 'RESPONSE', responseData: response.json(), extra: reqExtra});
        } catch (error) {
            httpDispatch({type: 'ERROR', errorMessage: error.message});
        }
    }, []);

    return {
        loading: httpState.loading,
        error: httpState.error,
        data: httpState.data,
        sendRequest,
        reqExtra: httpState.extra,
        reqId: httpState.identifier
    };
};

export default useHttp;