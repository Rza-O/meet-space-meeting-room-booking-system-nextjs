"use client";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import toast from 'react-hot-toast';
import { TiDeleteOutline } from "react-icons/ti";
import Swal from 'sweetalert2';

type DeleteButtonProps = {
   roomId: string
};

const DeleteButton = ({ roomId }: DeleteButtonProps) => {
   const queryClient = useQueryClient();

   const { mutate } = useMutation({
      mutationFn: async () => {
         const {data} =  await axios.delete(`/api/rooms/${roomId}`);
         return data;
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['rooms'] });
         toast.success('Room deleted successfully!');
      }
   })

   const handleDelete = () => {
      Swal.fire({
         title: "Are you sure?",
         text: "You won't be able to revert this!",
         icon: "warning",
         showCancelButton: true,
         confirmButtonColor: "#3085d6",
         cancelButtonColor: "#d33",
         confirmButtonText: "Yes, delete it!",
      }).then((result) => {
         if (result.isConfirmed) {
            // delete the room
            mutate();
         }
      });
   }

   return (
      <button onClick={handleDelete} className="btn btn-ghost btn-lg"><TiDeleteOutline className='text-red-500' /></button>
   );
};

export default DeleteButton;