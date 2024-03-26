import React, { useEffect, useState } from 'react';
import { auth } from '../firebase/firebaseConnect';
import {FcHome} from 'react-icons/fc';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Profile = ()=>{
    const navigate = useNavigate();
    const [formData , setFormData] = useState({
        email: auth.currentUser.email,
        name: auth.currentUser.displayName,
    });
    const {email,name} = formData;
    
    const logOut = ()=>{
        signOut(auth);
        navigate("/");
    }
    return(
        <>
         <section className='max-w-6xl mx-auto w-full md:w-[50%] px-3 flex flex-col justify-center items-center bg-green-50'>
          <h2 className="text-center text-2xl my-10 font-bold"> My Profile </h2>
          <form>
            <input type="text" id="name" value={name} className="w-full bg-white border p-2 mb-2 text-xl rounded" disabled/>
            <input type="email" id="email" value={email} className="w-full bg-white border p-2 mb-2 text-xl rounded" disabled/>
            <div className="flex justify-between items-center mb-3 text-sm whitespace-nowrap">
                <div>
                    <span> Do you want to change your name? </span>
                    <span className='text-red-500 hover:text-red-700 transition duration-150 cursor-pointer ml-1'> Edit</span>
                </div>
                <p className='text-blue-500 hover:text-blue-700 transition duration-150 cursor-pointer'
                 onClick={logOut}> 
                  Sign Out 
                </p>
            </div>
            <button className="bg-blue-700 w-full flex justify-center items-center flex- py-2">
                <FcHome />
                <p className='text-white ml-3'> SELL OR RENT YOUR HOME </p>
            </button>
          </form>
          </section>
         
        </>
    )
}
export default Profile;