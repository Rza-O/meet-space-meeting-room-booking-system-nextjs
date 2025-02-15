import Image from 'next/image';
import React from 'react';
import UpdateButton from './ui/UpdateButton';
import DeleteButton from './ui/DeleteButton';



type Room = {
   id: string
   name: string
   imageUrl: string
   capacity: number
   amenities: string[]
}

type ManageRoomTableProps = {
   rooms: Room[];
};

const ManageRoomTable = ({ rooms }: ManageRoomTableProps) => {
   console.log(rooms)
   return (
      <div className="overflow-x-auto">
         <table className="table">
            {/* head */}
            <thead>
               <tr>

                  <th>Name</th>
                  <th>Amenities</th>
                  <th>Capacity</th>
                  <th>Actions</th>
               </tr>
            </thead>
            <tbody>
               {/* row 1 */}
               {
                  rooms.map((room: Room) => (
                     <tr key={room.id}>
                        <td>
                           <div className="flex items-center gap-3">
                              <div className="avatar">
                                 <div className="mask mask-squircle h-12 w-12">
                                    <Image
                                       width={48}
                                       height={48}
                                       unoptimized={true}
                                       src={room.imageUrl}
                                       alt="Avatar Tailwind CSS Component" />

                                 </div>
                              </div>
                              <div>
                                 <div className="font-bold">{room.name}</div>
                              </div>
                           </div>
                        </td>
                        <td>
                           {room.amenities.map((amenity: string, index: number) => (
                              <p key={index} className="badge">{amenity}</p>
                           ))}
                        </td>
                        <td>{room.capacity} Persons</td>
                        <th>
                           <UpdateButton />
                           <DeleteButton />
                        </th>
                     </tr>
                  ))
               }
            </tbody>
         </table>
      </div>
   );
};

export default ManageRoomTable;