import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebaseConnect';


const useAuthStatus = () => {
    const [loggedIn , setLoggedIn] = useState(false);
    const [ checkStatus , setCheckStatus] = useState(true);
    useEffect(()=>{
        onAuthStateChanged(auth,(user)=>{
            if(user){
                setLoggedIn(true);
            }
            setCheckStatus(false);
        })
    },[])

  return {loggedIn , checkStatus}
}

export {useAuthStatus};