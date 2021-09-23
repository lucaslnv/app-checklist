import React, { createContext, useState } from 'react';

export const Context = createContext({});

export const ContextProvider = (props) => {

  const [obj, setObj] = useState({});

  return(
    <Context.Provider value={{obj, setObj}}>
        {props.children}
    </Context.Provider>
  )

}