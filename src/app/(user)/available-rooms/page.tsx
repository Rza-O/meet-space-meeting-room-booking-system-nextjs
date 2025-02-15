"use client";
import LoadingSkeleton from '@/components/LoadingSkeleton';
import RoomCard from '@/components/RoomCard';
import { Room } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';

const AvailableRooms = () => {
   const { data: rooms, isLoading } = useQuery({
      queryKey: ['rooms'],
      queryFn: async () => {
         const { data } = await axios('/api/rooms');
         return data;
      },
   })
   if (isLoading) return <LoadingSkeleton />
   console.log(rooms);
   return (
      <div className='container mx-auto text-center space-y-5 mt-5 my-16'>
         <h2 className='text-5xl font-bold'>Featured Rooms</h2>
         <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 py-5 justify-items-center'>
            {rooms?.map((room: Room) => (
               <RoomCard key={room.id} room={room} />
            ))}
         </div>
      </div>
   );
};

export default AvailableRooms;