import React from 'react';
import {MdLocationOn} from 'react-icons/md';
import {FaTrash} from 'react-icons/fa';
import {MdEdit} from 'react-icons/md';
import {Link} from 'react-router-dom';
import Moment from 'react-moment';

const ListingItem = ({listing,id,deleteItem,editItem})=>{

    return(
        <div className='shadow hover:shadow-xl transition-shadow duration-150 border'>
            <Link to={`/category/${listing.type}/${id}`} className='relative'>
                <img src={listing.imgUrls[0]} alt={listing.name} className='h-{170px} w-full object-cover hover:scale-101 
                transition-scale duration-200' loading="lazy"/>
                <Moment fromNow className='absolute top-2 left-2 bg-blue-400 text-white uppercase text-xs font-semibold rounded
                  p-2'> {listing.timestamp?.toDate()} </Moment>
            </Link>
            <div className='p-2'>
              <div className='flex items-center gap-2 my-2'> 
               <MdLocationOn className='text-green-400'/>
               <span className='font-semibold text-sm text-gray-500 truncate'> {listing.address}</span> 
              </div>
              <p className='font-semibold text-xl truncate'> {listing.name} </p>
              <p className='font-semibold text-blue-300 truncate'> 
                {listing.offer ? 
                  listing.discountedPrice
                //   making the comma (,) between money numbers
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g,",") 
                  : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g,",")
                } 
                {listing.type === "rent" && "/Month"}
              </p>
              <div className="flex items-center justify-between mt-2">
                <div className='flex items-center gap-2'>
                  <span className='font-bold text-xs'> {listing.beds === 1 ? "1 bed" : `${listing.beds} beds`} </span>
                  <span className='font-bold text-xs'> {listing.baths === 1 ? "1 bath" : `${listing.baths} baths`} </span>
                </div>
                <div className='flex items-center gap-2'>
                    {deleteItem && <FaTrash className='text-red-500 cursor-pointer' onClick={()=> deleteItem(listing.id)} /> }
                    {editItem && <MdEdit className='cursor-pointer' onClick={()=> editItem(listing.id)}  /> }
                </div>
              </div>
            </div>
            
        </div>
    )
}

export default ListingItem;