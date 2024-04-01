import React from 'react';
import {FaLocation} from 'react-icons/fa';

const ListingItem = ({listing,id})=>{

    return(
        <div>
            <figure>
                <img src="" alt="" />
            </figure>
            <div> 
               <FaLocation/>
               <span> fsfldkfldfkll fldfl dfldlf</span> 
            </div>
            <p> {listing.name} </p>
            <p> 
                {listing.offer ? (listing.regularPrice - listing.dicountedPrice) : listing.regularPrice} 
                {listing.type ==="rent" && "/Month"}
            </p>
            <div className="flex justify-between items-center">
                <div>
                  <span> {listing.bed} </span>
                  <span> {listing.bath} </span>
                </div>
                <div>
                    <>
                    </>
                </div>
            </div>
        </div>
    )
}

export default ListingItem;