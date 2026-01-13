import axios from "axios";
import { useEffect, useState } from "react";
import { UserContext } from "./UserContext";

export function UserContextProvider({children}){
    const [user, setUser] = useState(null)
    const [ready, setReady] = useState(false)
    
    useEffect(() => {
        if(!user && !ready){
            axios.get('/profile')
                .then((response) => {
                    setUser(response.data.data)
                    setReady(true)
                })
                .catch(error => {
                    console.log('Not logged in',error.message);
                    setReady(true);
                })
        }
    }, []);
    
    return(
        <UserContext.Provider value={{user, setUser, ready}}>
          {children}           
        </UserContext.Provider>      
    )
}