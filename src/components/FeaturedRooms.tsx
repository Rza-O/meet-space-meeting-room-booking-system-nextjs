"use client";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import RoomCard from './RoomCard';
import { Room } from '@/lib/types';

const FeaturedRooms = () => {

   const { data: featuredRooms } = useQuery({
      queryKey: ['featured-rooms'],
      queryFn: async () => {
         const { data } = await axios('/api/featured');
         return data;
      },
   })

   console.log(featuredRooms)

   return (
      <div className='container mx-auto text-center space-y-5 mt-5 my-16'>
         <h2 className='text-5xl font-bold'>Featured Rooms</h2>
         <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-5 justify-items-center'>
            {featuredRooms?.map((room: Room) => (
               <RoomCard key={room.id} room={room} />
            ))}
         </div>
      </div>
   );
};

export default FeaturedRooms;