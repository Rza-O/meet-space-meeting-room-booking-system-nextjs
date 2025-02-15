"use client"
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import ManageRoomsTable from './components/ManageRoomTable';
import LoadingSkeleton from '@/components/LoadingSkeleton';

const ManageRooms = () => {
   const { data: rooms, isLoading } = useQuery({
      queryKey: ['rooms'],
      queryFn: async () => {
         const {data} = await axios('/api/rooms');
         return data;
      },
   })

   if(isLoading) return <LoadingSkeleton />


   return (
      <div className='container mx-auto text-center space-y-5 mt-5 '>
         <h3 className='text-5xl font-bold'>Manage All Rooms</h3>
         <ManageRoomsTable rooms={rooms} />
      </div>
   );
};

export default ManageRooms;