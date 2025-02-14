"use client";
import { useUser } from '@clerk/nextjs';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';

const SaveUserToDB = () => {
   const {isSignedIn} = useUser();

   // using mutation to save user to db
   const { mutate } = useMutation({
      mutationFn: async () => {
         const { data } = await axios.post('/api/auth/user');
         return data;
      },
      onError: (error) => {
         console.log("User Creation Failed:", error);
      }
   })

   useEffect(() => {
      if (isSignedIn) {
         mutate();
         
      }
   }, [isSignedIn, mutate]);

   return null;
};

export default SaveUserToDB;