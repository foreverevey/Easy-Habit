import React, { useReducer } from 'react';

export default(reducer, actions, initialState) =>{
  const MyContext = React.createContext();

  const Provider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const boundActions = {};
    for (let key in actions){
      boundActions[key] = actions[key](dispatch);
    }

    return (
      <MyContext.Provider value={{state, ...boundActions}}>
        {children}
      </MyContext.Provider>
    )
  }

  return { MyContext, Provider };
};
