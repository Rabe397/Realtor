import React from 'react';
import {FcGoogle} from 'react-icons/fc';
import {signInWithPopup} from "firebase/auth";
import { auth , db, googleProvider } from "../firebase/firebaseConnect";
import { useNavigate } from 'react-router';
import { toast} from 'react-toastify';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

const GoogleAuth = () => {
  const navigate = useNavigate();

  const googleSign = async (e)=>{
    e.preventDefault();
    try{
      const userCredential = await signInWithPopup(auth , googleProvider);
      const user = userCredential.user;
      // check if user exist
      const docRef = (db,"users",user.uid);
      const docSnap = await getDoc(docRef);
      if(!docSnap.exists()){
        await setDoc(docRef,{
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp()
        })
        navigate("/")
    }    
    }catch(error){
      toast.error(`${error}`);
    }
  }
  return (
    <div>
        <button className='bg-red-500 hover:bg-red-600 text-white flex justify-center items-center gap-2 w-full py-3 
        mt-3 rounded transition' onClick={googleSign}>
            <FcGoogle className="text-2xl bg-white rounded-full"/>
            Continue with Google 
        </button>
    </div>
  )
}

export default GoogleAuth;