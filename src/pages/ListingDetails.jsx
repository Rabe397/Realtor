import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebaseConnect';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import Spinner from '../components/Spinner';
import {Swiper , SwiperSlide} from 'swiper/react';
import { EffectFade, Autoplay , Navigation , Pagination} from 'swiper/modules';
import SwiperCore from 'swiper';
import "swiper/css/bundle";
import {FaShare , FaBed , FaBath , FaParking , FaChair} from 'react-icons/fa';
import {MdLocationOn} from 'react-icons/md';

const ListingDetails = ()=>{

    const [listings , setListings] = useState([]);
    const [loading , setLoading] = useState(true);
    const [showShared , setShowShared] = useState(false);
    SwiperCore.use([Autoplay , Navigation , Pagination]);
    const params = useParams();

    useEffect(()=>{
        
        async function fetchListing(){
            const docRef = doc(db,"listings",params.listingId);
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()){
                setListings(docSnap.data());
                console.log(listings) 
                setLoading(false);
            }
        }
        fetchListing();
    },[params.listingId])

    if(loading){
        return <Spinner />
    }

    return(
        <section className='bg-green-200 min-h-[93vh]'>
          <main>
            <Swiper slidesPerView={1} navigation pagination={{type:"progressbar"}} effect="fade" modules={[EffectFade]} 
             autoplay={{delay:3000}}>
                {listings.imgUrls.length > 1 ?
                 listings.imgUrls.map((img,index)=>(
                    <SwiperSlide key={index}>
                        <img src={img} className="w-full overflow-hidden h-[300px]" />
                    </SwiperSlide>))
                  :
                   <SwiperSlide>
                        <img src={listings.imgUrls[0]}  className="w-full overflow-hidden h-[300px]"/>
                    </SwiperSlide>
                } 
            </Swiper>
            <div className='fixed top-[100px] right-[3%] z-10 bg-white cursor-pointer border-2 border-gray-400 rounded-full
            w-12 h-12 flex justify-center items-center' onClick={()=> {navigator.clipboard.writeText(window.location.href) ;
             setShowShared(true) ; setTimeout(() => {
                setShowShared(false)
             }, 2000);}}>
                <FaShare className='text-lg'/>
            </div>
            {showShared && (<p className='absolute top-[150px] right-[6%] bg-white border-2 z-10 p-1 rounded'> Link copied </p>) }
            
          </main>
          <div className='max-w-7xl mx-auto flex justify-center items-center flex-col md:flex-row gap-3 mt-5 bg-white border-1 p-2'>
            <div>
                { listings &&(
                    <>
                      <div className="text-2xl font-bold text-blue-400"> 
                        <span> {listings.name} - 
                         $ {listings.offer ?  
                          listings.discountedPrice.toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g,",")  : 
                          listings.regularPrice.toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g,",") } { listings.type === "rent" && "/Month"} 
                        </span>
                      </div>
                      <div className='flex items-center my-3'>
                        <MdLocationOn className='text-green-400'/>
                        <span className='font-semibold text-sm text-gray-500 truncate'> {listings.address}</span> 
                      </div>
                      <div className="flex gap-2 items-center">
                        <p className='p-2 bg-red-400 text-white rounded text-center w-full max-w-[200px]'>For
                          {
                           listings.type === "rent" ? " Rent" : " Sale"
                          }
                        </p>
                        {
                            listings.offer && (
                                <p className='p-2 bg-green-500 text-white rounded text-center w-full max-w-[200px]'> ${(+listings.regularPrice) - 
                                    (+listings.discountedPrice)} discount</p>
                            )
                        }

                      </div>
                      
                      <p className='my-3'> <span className='font-semibold'> Description- </span> {listings.description} </p>
                      <div className='flex items-center gap-3'>
                        <div className='flex items-center gap-1'>
                          <FaBed/>
                          <p> {listings.beds === 1 ? "1 Bed" : `${listings.beds} Beds`}</p>
                        </div>
                        <div className='flex items-center gap-1'>
                           <FaBath/>
                           <p> {listings.baths === 1 ? "1 Bath" : `${listings.baths} Baths`}</p>
                        </div>
                        <div className='flex items-center gap-1'>
                            <FaParking/>
                            <p> {listings.parking ? "Parking" : "No parking"} </p>
                        </div>
                        <div className='flex items-center gap-1'>
                            <FaChair/>
                            <p> {listings.furnished ? "Furnished" : "Not furnished"} </p>
                        </div>
                      </div>
                    </>   
                )}
            </div>
            <div className="w-full">

            </div>
          </div>
        </section>
    )
}

export default ListingDetails;