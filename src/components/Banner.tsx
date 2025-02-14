"use client";
import Image from 'next/image';
import React from 'react';


const Banner = () => {
   fetch('/api/auth/user', {
      method: 'GET',
      headers: {
         'Content-Type': 'application/json',
      },
   })
      .then((response) => response.json())
   .then((data) => console.log(data))
   return (
      <div className='relative'>
         {/* Banner Image */}
         <div className='relative w-full h-[500px] sm:h-[400px] lg:h-[500px] xl:h-[600px] 2xl:h-[700px]'>   
            <Image
               src={'/banner.jpg'} // Path to your image
               alt="Banner"
               layout="fill" // Makes the image take up full width and height of its container
               objectFit="cover" // Makes the image maintain its aspect ratio while filling the container
               priority // Optional: Makes this image load faster
            />
         </div>
         {/* Overlay */}
         <div className='absolute inset-0 bg-black bg-opacity-50 '></div> 
         {/* Banner Content */}
         <div className='absolute inset-0 flex flex-col items-center justify-center text-white space-y-5 text-center w-11/12 mx-auto'>
            <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold'>Meet in Style, Book in Seconds</h1>
            <p className='text-sm sm:text-base md:text-lg lg:text-xl'>Quickly find and book available rooms for your meetings, conferences, or team collaborations.</p>
            <button className='text-sm sm:text-base text-white btn lg:btn-lg transition-colors duration-300'>Book Your Next Meeting Now</button>
         </div>
      </div>
   );
};

export default Banner;