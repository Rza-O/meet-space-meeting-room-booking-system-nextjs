import { Room } from '@/lib/types';
import Image from 'next/image';
import React from 'react';
import BookNowButton from './ui/BookNowButton';

type RoomCardProps = {
   room: Room
};

const RoomCard = ({ room }: RoomCardProps) => {
   return (
      <div className="card bg-base-100 w-96 shadow-xl">
         <figure className="px-10 pt-10 relative h-48 w-full">
            <Image
               fill
               src={room.imageUrl}
               sizes="(max-width: 768px) 100vw, 33vw" 
               alt="Shoes"
               className="rounded-xl object-cover" />
         </figure>
         <div className="card-body items-center text-center gap-4">
            <h2 className="card-title">{ room.name}</h2>
            <div className='space-x-4'>
               {
                  room?.amenities.map((amenity, index) => (
                     <span key={index} className="badge badge-accent">{amenity}</span>
                  ))
               }
            </div>
            <div className="card-actions">
               <BookNowButton room={room} />
            </div>
         </div>
      </div>
   );
};

export default RoomCard;