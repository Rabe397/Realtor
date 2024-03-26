import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase/firebaseConnect';
import {FcHome} from 'react-icons/fc';
import { signOut, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

const Profile = ()=>{
    const navigate = useNavigate();
    const [edit , setEdit] = useState(false);
    const [formData , setFormData] = useState({
        email: auth.currentUser.email,
        name: auth.currentUser.displayName,
    });
    const {email,name} = formData;
    
    const logOut = ()=>{
        signOut(auth);
        navigate("/");
    }

    const changeInput = (e)=>{
        e.preventDefault();
        setFormData((prevState)=>({
            ...prevState,
            [e.target.id] : e.target.value
        }))
    }

    const applyChange = async ()=>{
        try{
            if(auth.currentUser.displayName !== name && name !== "" && name.length > 2){
                // update display name in firebase auth
                await updateProfile(auth.currentUser,{
                    displayName : name,
                })
                // update name in firestore
                const docRef = doc(db,"users" , auth.currentUser.uid);
                await updateDoc(docRef,{
                    name : name,
                })
            }
            toast.success("Profile details updated");
        }catch(error){
            toast.error("Could not update Profile details");
        }
    }

    return(
        <section className="bg-green-50">
         <section className='max-w-6xl mx-auto w-full md:w-[50%] px-3 flex flex-col justify-center items-center '>
          <h2 className="text-center text-2xl my-10 font-bold"> My Profile </h2>
          <form>
            <input type="text" id="name" value={name} className={`w-full bg-white border p-2 mb-2 text-xl rounded 
             ${edit && "bg-red-100"}`} disabled={!edit} onChange={changeInput}/>
            <input type="email" id="email" value={email} className="w-full bg-white border p-2 mb-2 text-xl rounded" disabled/>
            <div className="flex justify-between items-center mb-3 text-sm whitespace-nowrap">
                <div>
                    <span> Do you want to change your name? </span>
                    <span className='text-red-500 hover:text-red-700 transition duration-150 cursor-pointer ml-1'
                     onClick={()=> {  setEdit(!edit) ; edit && applyChange()}}> {edit ? "Apply Change" : "Edit"}</span>
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
         
        </section>
    )
}
export default Profile;