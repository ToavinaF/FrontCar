import axios from 'axios';
import React, { createContext, useState } from 'react';

export const ApiProvider = createContext();


const ApiContext = ({ children }) => {
    const [apiData, setApiData] = useState(null);
    const [apiMessage, setApiMessage] = useState(null);
    const apiGet = async (valueApi) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/${valueApi}`);
            setApiData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    const apiPost = async (valueApi) => {
        try{
            const response = await axios.post(`http://127.0.0.1:8000/api/${valueApi}`);
            setApiMessage('succes');
        }
        catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    return (
        <ApiProvider.Provider value={{ apiData, apiGet,apiMessage,apiPost }}>
            {children}
        </ApiProvider.Provider>
    );
};

export default ApiContext;

