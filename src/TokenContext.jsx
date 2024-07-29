import React, { createContext, useState } from 'react';

export const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
    const [isToken, setIsToken] = useState(!!localStorage.getItem('accessToken'));

    return (
        <TokenContext.Provider value={[isToken, setIsToken]}>
            {children}
        </TokenContext.Provider>
    );
};
