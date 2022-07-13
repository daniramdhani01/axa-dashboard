import { createContext, useReducer } from 'react'

export const UserContext = createContext();

const initialState = {
    isLogin: false,
    storedata: []
}

const reducer = (state, action) => {
    const { type, payload } = action

    switch (type) {
        case 'SET_USER':
        case 'SET_POST':
        case 'SET_ALBUM':
            return {
                isLogin: true,
                storedata: payload,
            };
        case 'DESTROY':
            return {
                isLogin: false,
                storedata: [],
            };
        default:
            throw new Error();
    }
}

export const UserContextProvider = ({ children }) => {

    const [state, dispatch] = useReducer(reducer, initialState)

    return (
        <UserContext.Provider value={[state, dispatch]}>
            {children}
        </UserContext.Provider>
    )

}