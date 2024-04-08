import React, { useEffect, useState } from 'react';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import {ref,uploadBytesResumable,getDownloadURL} from 'firebase/storage';
import {auth, db, storage} from '../firebase/firebaseConnect';
import {v4 as uuidv4} from "uuid";
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useNavigate , useParams} from 'react-router-dom';

const EditListing = () => {
  const navigate = useNavigate();
  const [geoLocationEnabled,setGeolocationEnabled] = useState(false);
  const [loading , setLoading] = useState(false);
  const [listings , setListings] = useState([]);
    const [formData , setFormData] = useState({
        type : "rent",
        name : "",
        baths : 1,
        beds : 1,
        parkingSpot : false,
        furnished : false,
        address : "",
        description: "",
        offer: false,
        regularPrice: 200,
        discountedPrice : 1,
        latitude: 0,
        longitude: 0,
        images: [],
    })
    const {type,name,baths,beds,parkingSpot,furnished,address,description,offer,
          regularPrice,discountedPrice,latitude,longitude,images} = formData;

    const params = useParams();

    useEffect(()=>{
      // problem of listings is empty array
      if(listings && listings.userRef !== auth.currentUser.uid){
        toast.error("you can't edit this listing");
        console.log(auth.currentUser.uid)
        console.log(listings)
        console.log(formData)
        navigate("/")
      }
    
    
    },[auth.currentUser.uid,navigate,listings])

    useEffect(()=>{
        setLoading(true);
        async function fetchListing(){
            const docRef = doc(db,"listings",params.listingId);
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()){
                setListings(docSnap.data());
                setFormData({...docSnap.data()});
                setLoading(false)
            }else{
                navigate("/");
            }
        }
        fetchListing();
    },[params.listingId])
    
    
    const hundleChange = (e)=>{
        e.preventDefault();
        let boolean = null;
        if(e.target.value === "true"){
          boolean = true;
        }else if(e.target.value === "false"){
          boolean = false;
        }
        if(e.target.files){
          setFormData((prevState)=>({
            ...prevState,
            images: e.target.files
          }))
        }else if(!e.target.files){
          setFormData((prevState)=>({
            ...prevState,
            [e.target.id] : boolean ?? e.target.value
          }))
        }
        
    }

    const updateList = async (e)=>{
      e.preventDefault();
      setLoading(true);
      if(+discountedPrice >= +regularPrice){
        setLoading(false);
        toast.error("Discounted Price must be lower than Regular Price");
        return;
      }
      if(images.length > 6){
        setLoading(false);
        toast.error("Maximum number of images are 6");
        return;
      }
      let geoLocation = {};
      let location;
      if(geoLocationEnabled){
        const response = await fetch(`https://maps.googleapis.com/maps/api/
        geocode/json?address=${address}&key=${process.env.REACT_APP_API_KEY}`)
        const data = await response.json();
        geoLocation.lat = data.results[0]?.geometry.location.lat ?? 0
        geoLocation.lng = data.results[0]?.geometry.location.lng ?? 0

        location = data.status === "ZERO_RESULTS" && undefined;
        if(location === undefined){
          setLoading(false);
          toast.error("please enter a correct address");
          return
        }
      }else{
        geoLocation.lat = latitude
        geoLocation.lng = longitude
      }

      const storeImg = async (img)=>{
        return new Promise((resolve,reject)=>{
          const fileName = `${auth.currentUser.uid}-${img.name}-${uuidv4()}`
          const storageRef = ref(storage,fileName);
          const uploadTask = uploadBytesResumable(storageRef,img);
          uploadTask.on('state_changed', 
           (snapshot) => {
              
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
              switch (snapshot.state) {
                    case 'paused':
                      console.log('Upload is paused');
                      break;
                    case 'running':
                      console.log('Upload is running');
                      break;
              }
           }, 
           (error) => {
              reject(error)
           }, 
           () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                  resolve(downloadURL);
              });
              setLoading(false);
           }
         );
        })   
      }

      const imgUrls = await Promise.all(
        [...images]
        .map((img)=> storeImg(img)))
        .catch((error)=>{
          setLoading(false);
          toast.error("images are not uploaded");
          return;
        }
      )

      const formDataCopy = {
        ...formData,
        imgUrls,
        geoLocation,
        timestamp: serverTimestamp(),
        userRef: auth.currentUser.uid,
      }
      delete formDataCopy.images;
      delete formDataCopy.latitude;
      delete formDataCopy.longitude;
      !formDataCopy.offer && delete formDataCopy.discountedPrice;
      const docRef = doc(db,"listings",params.listingId);
      await updateDoc(docRef,
        {...formDataCopy,
        geoLocation:{lat: 0,lng: 0}
        ,});
     
      setLoading(false);
      toast.success("listing updated");
      navigate(`/category/${formDataCopy.type}/${docRef.id}`);
    }

    
    if(loading){
      return <Spinner />
    }

  return (
    <section className="bg-green-50 w-full px-3">
        <h2 className="text-center py-6 text-2xl font-bold"> Edit a Listing </h2>
        <form onSubmit={updateList} className='max-w-4xl mx-auto md:w-50%'>
          <div className='mb-3'>
            <p className="font-semibold"> Sell/Rent </p>
            <div className='flex justify-between items-center gap-4 mt-1'>
                <button className={`w-full  py-2 ${type === "rent" ? "bg-white" : "bg-slate-600 text-white"}`} value="sell" 
                 onClick={hundleChange} id="type" > SELL </button>
                <button className={`w-full  py-2 ${type === "sell" ? "bg-white" : "bg-slate-600 text-white"}`} value="rent" 
                 onClick={hundleChange}id="type"> RENT </button>
            </div>
          </div>
          <div  className='mb-3'>
            <p className="font-semibold"> Name </p>
            <input type="text" id="name" placeholder='Name' value={name} className='w-full bg-white mt-1 p-2' maxLength="25" 
             minLength="3" onChange={hundleChange} required/>
          </div>
          <div className="flex justify-start items-center gap-4 mb-3">
            <div>
                <p className="font-semibold"> Beds </p>
                <input type="number" id="beds" min="1" max="50" value={beds} onChange={hundleChange} className='mt-1 p-2'/>
            </div>
            <div>
                <p className="font-semibold"> Baths </p>
                <input type="number" id="baths" min="1" max="50" value={baths} required onChange={hundleChange} className='mt-1 p-2'/>
            </div>
          </div>
          <div className='mb-3'>
            <p className="font-semibold"> Parking spot </p>
            <div className="flex justify-between items-center gap-4 mt-1">
                <button value={true} id="parkingSpot" className={`w-full py-2 ${ parkingSpot ? "bg-slate-600 text-white" : "bg-white"}`}
                  onClick={hundleChange}> YES </button>
                <button value={false} id="parkingSpot" className={`w-full py-2 ${ !parkingSpot ? "bg-slate-600 text-white" : "bg-white"}`}
                onClick={hundleChange}> NO </button>
            </div>
          </div>
          <div className='mb-3'>
            <p className="font-semibold"> Furnished </p>
            <div className="flex justify-between items-center gap-4 mt-1">
                <button value={true} id="furnished" className={`w-full py-2 ${ furnished ? "bg-slate-600 text-white" : "bg-white"}`}
                onClick={hundleChange}> YES </button>
                <button value={false} id="furnished" className={`w-full py-2 ${ !furnished ? "bg-slate-600 text-white" : "bg-white"}`}
                 onClick={hundleChange}> NO </button>
            </div>
          </div>
          <div className='mb-3'>
            <p className="font-semibold"> Address </p>
            <textarea id="address" value={address} cols="10" rows="5" placeholder='Address' className='resize-none w-full p-2 mt-1' 
             onChange={hundleChange}></textarea>
          </div>
          {
            geoLocationEnabled && (
              <div className="flex justify-start items-center gap-4 mb-3">
                <div>
                  <p className="font-semibold"> Latitude </p>
                  <input type="number" id="latitude" value={latitude} onChange={hundleChange} min="-90" max="90" required
                   className="p-2 mt-1"/>
                </div>
                <div>
                  <p className="font-semibold"> Longitude </p>
                  <input type="number" id="longitude" value={longitude} onChange={hundleChange} min="-180" max="180" required
                   className="p-2 mt-1" />
                </div>
              </div>
            )
          }
          <div className='mb-3'>
            <p className="font-semibold"> Description </p>
            <textarea id="description" value={description} cols="10" rows="5" placeholder='Description' className='resize-none w-full 
             p-2 mt-1'onChange={hundleChange}></textarea>
          </div>
          <div className='mb-3'>
            <p className="font-semibold"> Offer </p>
            <div className="flex justify-between items-center gap-4 mt-1">
                <button value={true} id="offer" className={`w-full  py-2 ${offer ? "bg-slate-600 text-white" : "bg-white"}`} 
                  onClick={hundleChange}> YES </button>
                <button value={false} id="offer" className={`w-full  py-2 ${!offer ? "bg-slate-600 text-white" : "bg-white"}`} 
                  onClick={hundleChange}> NO </button>
            </div>
          </div>
          <div className='mb-3'>
            <p className="font-semibold"> Regular Price </p>
            <div>
              <input type="number" id="regularPrice" value={regularPrice} min="10" className='mt-1 p-2' onChange={hundleChange}/>
              {type === "rent" && 
                  <span className="bg-slate-200 p-1 ml-4 rounded"> $/Month </span>  
              }
            </div>
          </div>
          {offer &&
            <div className='mb-3'>
              <p className="font-semibold"> Discounted Price </p>
              <input type="number" id="discountedPrice" value={discountedPrice} className='mt-1 p-2 w-full' onChange={hundleChange}/>
            </div>
          }
          <div className='mb-5'>
            <p className="font-semibold"> Images </p>
            <p className='text-gray-500'> The first image will be the cover (max 6) </p>
            <input type="file" name="" id="images" required multiple accept='.jpg,.png,.jpeg'  className='w-full bg-white mt-1 p-2'
             onChange={hundleChange} />
          </div>
          <button className="w-full bg-blue-500 hover:bg-blue-700 transition duration-150 text-white p-2 mb-3" type="submit"
           > Edit List </button>
        </form>    
    </section>
  )
}

export default EditListing;