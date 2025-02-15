import React from 'react';
import { ClimbingBoxLoader } from 'react-spinners';

const LoadingSkeleton = () => {
   return (
      <div>
         <ClimbingBoxLoader size={200} />
      </div>
   );
};

export default LoadingSkeleton;