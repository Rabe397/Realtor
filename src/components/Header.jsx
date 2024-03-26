import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation , useNavigate} from 'react-router-dom';

const Header = ()=>{
    const location = useLocation();
    const navigate = useNavigate();

    const pathMatch = (route)=>{
        if(location.pathname === route){
            return true;
        }
    }

    return(
        <header className=' bg-white border-b shadow-sm sticky top-0'>
            <div className='flex justify-between items-center px-5 py-3 max-w-7xl mx-auto bg-white border-b'>
                <figure onClick={()=> navigate("/")}> 
                    <img src="https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg" alt="logo" className='h-5 cursor-pointer'/>
                 </figure>
                <nav className='flex justify-between w-1/3'>
                    <Link to='/' className={`text-gray-400 cursor-pointer ${pathMatch("/") && "text-gray-900 border-b border-b-red-500"}`}>
                        Home 
                    </Link>
                    <Link to='/offers' 
                    className={`text-gray-400 cursor-pointer ${pathMatch("/offers") && "text-gray-900 border-b border-b-red-500"}`}>
                        Offers 
                    </Link>
                    <Link to='/sign-in' 
                    className={`text-gray-400 cursor-pointer ${pathMatch("/sign-in") && "text-gray-900 border-b border-b-red-500"}`}>
                        Sign in 
                    </Link>
                </nav>
            </div>
            
        </header>
    )
}
export default Header;