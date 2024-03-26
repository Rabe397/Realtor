import React,{useState} from 'react';
import key from '../assets/photo-1564767609342-620cb19b2357.jpg';
import { Link , useNavigate} from 'react-router-dom';
import {FaEye,FaEyeSlash} from 'react-icons/fa';
import { createUserWithEmailAndPassword , updateProfile} from "firebase/auth";
import {serverTimestamp , setDoc , doc} from 'firebase/firestore';
import {auth , db} from '../firebase/firebaseConnect';
import GoogleAuth from '../components/GoogleAuth';
import { ToastContainer, toast } from 'react-toastify';

const SignUp = ()=>{
    const navigate = useNavigate();
    const [showPass , setShowPass] = useState(false)
    const [formData,setFormData] = useState({
        email: "",
        password: "",
        name: "",
    })
    const {email,password,name} = formData;

    const handleChange = (e)=>{
        e.preventDefault();
        setFormData((prevState)=>({
            ...prevState,
            [e.target.id]: e.target.value,
        }));
    }

    const createUser = async (e)=>{
        e.preventDefault();
        try{
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            updateProfile(auth.currentUser,{
                displayName : name,
            })
            const user = userCredential.user;
            const formDataCopy = {...formData};
            delete formDataCopy.password;
            formDataCopy.timestamp = serverTimestamp();

            await setDoc(doc(db,"users",user.uid), formDataCopy);
            console.log(user);
            navigate("/");
        }
        catch(error){
            toast.error(`${error}`);
        }
        
        
    }

    return(
        <>
          <section className="bg-green-50 min-h-screen">
            <h2 className='text-center py-4 text-2xl'> Sign Up </h2>
            <div className="w-full mx-auto flex justify-center items-center flex-wrap gap-7 px-8 my-9">
                <figure className='w-full lg:w-[50%] lg:mx-auto md:w-[67%] mb-12 md:mb-6'> 
                    <img src={key} alt="key" className='w-full rounded'/>
                </figure>
                <form action="" className='w-full md:w-[67%] lg:w-[40%]'>
                    <input type="text" name="" id="name" value={name} onChange={handleChange} placeholder='Full Name' 
                     className='w-full p-3 outline-none bg-white'
                    />
                    <input type="email" name="" id="email" value={email} onChange={handleChange} placeholder='Email address' 
                     className='w-full p-3 outline-none bg-white my-3'
                    />
                    <div className='relative'>
                      <input type={showPass? "text" : "password"} name="" id="password" value={password} onChange={handleChange} 
                       placeholder='Password' className='w-full p-3 outline-none bg-white mb-3'
                      />
                      {showPass ? <FaEye onClick={()=> setShowPass(!showPass)}
                      className="absolute right-3 top-4"/> : <FaEyeSlash onClick={()=> setShowPass(!showPass)} 
                      className="absolute right-3 top-4"/>}
                    </div>
                    <div className="flex justify-between items-center">
                        <div>
                            <span> Have an account? </span>
                            <Link to='/sign-in' className='text-blue-400'> Sign In </Link>
                        </div>
                        <Link to='/forgot-password' className='text-red-400'> Forgot password? </Link>
                    </div>
                    <button className='bg-blue-600 text-white w-full py-3 my-3 hover:bg-blue-800 transition 
                      rounded' onClick={createUser}> Sign Up 
                    </button>
                    <div className="flex items-center before:border-t before:flex-1 before:border-gray-300 after:border-t 
                      after:flex-1 after:border-gray-300"
                    >
                      <p className='mx-1 font-500'> OR </p> 
                    </div>
                    <GoogleAuth />
                </form>
            </div>
        </section>
        </>
    )
}
export default SignUp;