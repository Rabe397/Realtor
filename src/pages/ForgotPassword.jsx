import React,{useState} from 'react';
import key from '../assets/photo-1564767609342-620cb19b2357.jpg';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail} from "firebase/auth";
import {auth} from '../firebase/firebaseConnect';
import GoogleAuth from '../components/GoogleAuth';
import { toast } from 'react-toastify';

const ForgotPassword = ()=>{
    const [email,setEmail] = useState("");

    const handleChange = (e)=>{
        e.preventDefault();
        setEmail(e.target.value);
    }

    const sendEmail = async (e)=>{
        e.preventDefault();
        try{
           await sendPasswordResetEmail(auth,email);
           toast.success("Email was sent");
        }
        catch(error){
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(`${errorMessage}`);
        }
    }
    return(
        <section className="bg-green-50 min-h-screen">
            <h2 className='text-center py-4 text-2xl'> Forgot Password </h2>
            <div className="w-full mx-auto flex justify-center items-center flex-wrap gap-7 px-8 my-9">
                <figure className='w-full lg:w-[50%] lg:mx-auto md:w-[67%] mb-12 md:mb-6'> 
                    <img src={key} alt="key" className='w-full rounded'/>
                </figure>
                <form action="" className='w-full md:w-[67%] lg:w-[40%]'>
                    <input type="email" name="" id="email" value={email} onChange={handleChange} placeholder='Email address' 
                     className='w-full p-3 outline-none bg-white mb-3'
                    />
                    <div className="flex justify-between items-center">
                        <div>
                            <span> Don't have an account? </span>
                            <Link to='/sign-up' className='text-blue-400'> Register </Link>
                        </div>
                        <Link to='/sign-in' className='text-red-400'> Sign In instead? </Link>
                    </div>
                    <button className='bg-blue-600 text-white w-full py-3 my-3 hover:bg-blue-800 transition duration-150 rounded' 
                     onClick={sendEmail}>
                        Send Reset Password 
                    </button>
                    <div className="flex items-center before:border-t before:flex-1 before:border-gray-300 after:border-t 
                     after:flex-1 after:border-gray-300">
                      <p className='mx-1 font-500'> OR </p> 
                    </div>
                    <GoogleAuth />
                </form>
            </div>
        </section>
    )
}
export default ForgotPassword;