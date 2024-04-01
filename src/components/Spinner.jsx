import React from 'react';
import spinner from '../assets/spinner.svg'; 

const Spinner = () => {
  return (
    <div className="h-lvh flex justify-center items-center bg-black bg-opacity-50 fiexd bottom-0 top-0 left-0 right-0 z-50 ">
        <figure>
            <img src={spinner} alt="Loading..." className="h-12"/>
        </figure>
    </div>
  )
}

export default Spinner