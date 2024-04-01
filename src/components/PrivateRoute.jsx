import React from 'react'
import { Outlet , useNavigate} from 'react-router-dom';
import {useAuthStatus} from '../hooks/useAuthStatus';
import Spinner from './Spinner';

const PrivateRoute = () => {
    const {loggedIn,checkStatus} = useAuthStatus();
    const navigate = useNavigate();
    
    if(checkStatus){
        return <Spinner />
    }

  return loggedIn ? <Outlet /> 
  : navigate("/sign-in")
}

export default PrivateRoute;