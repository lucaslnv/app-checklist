import React, {useState} from 'react';
import Routes from './src/routes';
import { ContextProvider } from './src/context/Index';

export default function App(){

  return(
    <ContextProvider>
      <Routes />
    </ContextProvider>
  );
}
