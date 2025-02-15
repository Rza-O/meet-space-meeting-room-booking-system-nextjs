import React from 'react';
import { ClimbingBoxLoader } from 'react-spinners';

const LoadingSkeleton = () => {
   return (
      <div className='flex justify-center items-center h-screen'>
         <ClimbingBoxLoader size={50} />
      </div>
   );
};

export default LoadingSkeleton;