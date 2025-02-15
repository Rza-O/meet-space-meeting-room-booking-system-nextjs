"use client";
import { useState } from 'react';
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
   });

   //  State for selected amenities
   const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

   //  Amenities list
   const amenitiesList = ["wifi", "projector", "whiteboard", "ac"];

   //  Handle checkbox change
   const handleCheckboxChange = (amenity: string) => {
      setSelectedAmenities((prev) =>
         prev.includes(amenity)
            ? prev.filter((item) => item !== amenity) 
            : [...prev, amenity] 
      );
   };

   // Filter rooms based on selected amenities
   const filteredRooms = rooms?.filter((room: Room) =>
      selectedAmenities.length === 0 ||
      selectedAmenities.every((amenity) => room.amenities.includes(amenity))
   );

   if (isLoading) return <LoadingSkeleton />;

   return (
      <div className='text-center '>
         <h2 className='text-5xl font-bold'>Available Rooms</h2>
         <div className='container mx-auto flex flex-col md:flex-row mt-5 my-16 gap-8'>
         
            {/*  Sidebar for filters */}
            <div className='w-full md:w-1/4 bg-base-200 shadow-lg p-5 rounded-lg mr-4'>
               <h2 className='text-xl font-bold mb-3'>Filter by Amenities</h2>
               <div className="space-y-2">
                  {amenitiesList.map((amenity) => (
                     <label key={amenity} className="flex items-center space-x-2">
                        <input
                           type="checkbox"
                           value={amenity}
                           checked={selectedAmenities.includes(amenity)}
                           onChange={() => handleCheckboxChange(amenity)}
                           className="checkbox checkbox-primary"
                        />
                        <span className="text-white capitalize">{amenity}</span>
                     </label>
                  ))}
               </div>
            </div>
            {/*  Rooms Grid */}
            <div className='w-full md:w-3/4 text-center space-y-5'>
         
               <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 py-5 justify-items-center'>
                  {filteredRooms?.length > 0 ? (
                     filteredRooms.map((room: Room) => (
                        <RoomCard key={room.id} room={room} />
                     ))
                  ) : (
                     <p className="text-gray-500 text-lg">No rooms match the selected filters.</p>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
};

export default AvailableRooms;
