import React from 'react'
import { Outlet , useNavigate} from 'react-router-dom';
import {useAuthStatus} from '../hooks/useAuthStatus';

const PrivateRoute = () => {
    const {loggedIn,checkStatus} = useAuthStatus();
    const navigate = useNavigate();
    
    if(checkStatus){
        return <h2> Loading... </h2>
    }

  return loggedIn ? <Outlet /> 
  : navigate("/sign-in")
}

export default PrivateRoute;