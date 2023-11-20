'use client'

import { createContext, useContext, useState } from 'react';

const CustomInfoContext = createContext();

export const CustomProvider = ({ children }) => {
    const [customInfo, setCustomInfo] = useState(null);

    const setCustomInfoData = (data) => {
        setCustomInfo(data);
    };

    return (
        <CustomInfoContext.Provider value={{ customInfo, setCustomInfoData }}>
            {children}
        </CustomInfoContext.Provider>
    );
};

export const useCustomInfo = () => useContext(CustomInfoContext);
