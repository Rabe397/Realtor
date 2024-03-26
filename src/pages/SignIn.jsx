import React, { useState } from 'react';
import key from '../assets/photo-1564767609342-620cb19b2357.jpg';
import { Link , useNavigate} from 'react-router-dom';
import {FaEye,FaEyeSlash} from 'react-icons/fa';
import { signInWithEmailAndPassword} from "firebase/auth";
import {auth} from '../firebase/firebaseConnect';
import GoogleAuth from '../components/GoogleAuth';
import { toast } from 'react-toastify';


const SignIn = ()=>{
    const navigate = useNavigate();
    const [showPass , setShowPass] = useState(false)
    const [formData,setFormData] = useState({
        email: "",
        password: "",
    })
    const {email,password} = formData;

    const handleChange = (e)=>{
        e.preventDefault();
        setFormData((prevState)=>({
            ...prevState,
            [e.target.id]: e.target.value,
        }));
    }

    const signFun = async (e)=>{
        e.preventDefault();
        try{
            const userCredential = await signInWithEmailAndPassword(auth,email,password);
            const user = userCredential.user;
            if(user){
                navigate("/");
            }
        }
        catch(error){
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(`${errorMessage}`);
        }
    }
    return(
        <section className="bg-green-50 min-h-screen">
            <h2 className='text-center py-4 text-2xl'> Sign In</h2>
            <div className="w-full mx-auto flex justify-center items-center flex-wrap gap-7 px-8 my-9">
                <figure className='w-full lg:w-[50%] lg:mx-auto md:w-[67%] mb-12 md:mb-6'> 
                    <img src={key} alt="key" className='w-full rounded'/>
                </figure>
                <form action="" className='w-full md:w-[67%] lg:w-[40%]'>
                    <input type="email" name="" id="email" value={email} onChange={handleChange} placeholder='Email address' className='w-full p-3 outline-none bg-white'/>
                    <div className='relative'>
                      <input type={showPass? "text" : "password"} name="" id="password" value={password} onChange={handleChange} placeholder='Password' className='w-full p-3 my-3 outline-none bg-white '/>
                      {showPass ? <FaEye onClick={()=> setShowPass(!showPass)}
                      className="absolute right-3 top-7"/> : <FaEyeSlash onClick={()=> setShowPass(!showPass)} className="absolute right-3 top-7"/>}
                    </div>
                    <div className="flex justify-between items-center">
                        <div>
                            <span> Don't have an account? </span>
                            <Link to='/sign-up' className='text-blue-400'> Register </Link>
                        </div>
                        <Link to='/forgot-password' className='text-red-400'> Forgot password? </Link>
                    </div>
                    <button className='bg-blue-600 text-white w-full py-3 my-3 hover:bg-blue-800 transition duration-150 
                    rounded' onClick={signFun}> 
                        Sign In 
                    </button>
                    <div className="flex items-center before:border-t before:flex-1 before:border-gray-300 after:border-t after:flex-1 after:border-gray-300">
                      <p className='mx-1 font-500'> OR </p> 
                    </div>
                    <GoogleAuth />
                </form>
            </div>
        </section>
    )
}
export default SignIn;