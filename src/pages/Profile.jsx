import React, { useEffect, useState } from 'react';
import ListingItem from '../components/ListingItem';
import { auth, db } from '../firebase/firebaseConnect';
import {FcHome} from 'react-icons/fc';
import { signOut, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { toast } from 'react-toastify';

const Profile = ()=>{
    const navigate = useNavigate();
    const [listings,setListings] = useState([]);
    const [loading,setLoading] = useState(false);
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

    const go = ()=>{
        navigate("/create-listing");
    }

    useEffect(() => {
      async function fetchUserListings(){
        const listingRef = collection(db,"listings");
        const q = query(listingRef,where("userRef","==",auth.currentUser.uid), orderBy("timestamp","desc"))
        const querySnap = await getDocs(q);
        let listings = [];
        querySnap.forEach((doc)=>{
            return listings.push({
                id : doc.id,
                data: doc.data(),
            })
        })
        setListings(listings);
        setLoading(false);
      }
      fetchUserListings();
    },[auth.currentUser.uid])
    
    return(
        <>
          <section className="bg-green-50 mx-auto w-full px-3 flex flex-col justify-center items-center">
          <div className="max-w-6xl md:w-[50%]">
          <h2 className="text-center text-2xl my-10 font-bold"> My Profile </h2>
          <form>
            <input type="text" id="name" value={name} className={`w-full bg-white border p-2 mb-2 text-xl rounded 
             ${edit && "bg-red-100"}`} disabled={!edit} onChange={changeInput}/>
            <input type="email" id="email" value={email} className="w-full bg-white border p-2 mb-2 text-xl rounded" disabled />
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
          </form>
          <button className="w-full bg-blue-500 hover:bg-blue-700 transition duration-150 flex justify-center items-center py-2"
            onClick={go}>
              <FcHome className="text-2xl rounded-full bg-white"/>
              <p className='text-white ml-3'> SELL OR RENT YOUR HOME </p>
          </button>
          </div>  
        </section>
        <section className="bg-green-50">
            {(!loading && listings.length > 0) && (
                <div className="max-w-6xl px-3 pt-6 mx-auto">
                  <h2 className="text-center text-2xl font-semibold"> My Listing </h2>
                  <div>
                    {listings.map((listing)=>(
                        <ListingItem key={listing.id} id={listing.id} listing={listing.data} />
                    ))}
                  </div>
                </div>
                

            )}
        </section>
        </>
        
    )
}
export default Profile;