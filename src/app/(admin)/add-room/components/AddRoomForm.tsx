"use client"
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import {  useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Select from "react-select";
import { z } from 'zod';

const roomSchema = z.object({
   name: z.string().min(4, "Room name must be at least 4 characters long"),
   capacity: z.number().min(2, "Capacity must be at least 2"),
   amenities: z.array(z.string()).min(1, "At least one amenity is required"),
   imageUrl: z.string().url("Upload a valid image URL"),
});

type RoomFormData = z.infer<typeof roomSchema>;


const amenitiesOptions = [
   { value: "wifi", label: "Wi-Fi" },
   { value: "projector", label: "Projector" },
   { value: "whiteboard", label: "Whiteboard" },
   { value: "ac", label: "Air Conditioning" },
]

const AddRoomForm = () => {
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
   const [previewImage, setPreviewImage] = useState<string | null>(null);
   const [isUploading, setIsUploading] = useState<boolean>(false);
   const [isClient, setIsClient] = useState<boolean>(false);
   const [isFormSubmitting, setIsFormSubmitting] = useState<boolean>(false);
   useEffect(() => {
      setIsClient(true);
   }, []);

   const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, reset } = useForm<RoomFormData>({ resolver: zodResolver(roomSchema), defaultValues: { name: "", capacity: 2, amenities: [], imageUrl: "" } });

   // uploading room to the DB
   const { mutate } = useMutation({
      mutationFn: async (roomData: RoomFormData) => {
         const { data } = await axios.post('/api/rooms', roomData)
         return data;
      }
   })

   // upload image to ImgBB
   const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      const formData = new FormData();
      formData.append('image', file);

      try {
         const res = await axios.post(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, formData);

         const imageUrl = res.data.data.url;
         setPreviewImage(imageUrl);
         setValue('imageUrl', imageUrl);
      } catch (error) {
         console.error("Error uploading image:", error);
      } finally {
         setIsUploading(false);
      }

   }

   const onSubmit = (data: RoomFormData) => {
      setIsFormSubmitting(true);
      
      try {
         mutate(data);
         toast.success("Room added successfully!");
         setIsFormSubmitting(false);
         reset();
      } catch (error) {
         console.error("Error adding room:", error);
         toast.error("Failed to add room. Please try again.");
         setIsFormSubmitting(false);
      }
   };

   return (
      <div className="max-w-lg mx-auto  p-6 rounded-lg shadow-lg ">
         <h2 className="text-5xl font-bold text-center mb-4">Add a New Room</h2>

         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Room Name */}
            <div>
               <label className="block text-gray-600">Room Name</label>
               <input {...register("name")} type="text" placeholder="Enter room name" className="input input-bordered w-full" />
               {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            {/* Capacity */}
            <div>
               <label className="block text-gray-600">Capacity</label>
               <input {...register("capacity", { valueAsNumber: true })} type="number" className="input input-bordered w-full" />
               {errors.capacity && <p className="text-red-500 text-sm">{errors.capacity.message}</p>}
            </div>

            {/* Amenities */}
            <div>
               <label className="block text-gray-600">Amenities</label>
               {isClient && (
                  <Select
                     isMulti
                     required
                     options={amenitiesOptions}
                     className="basic-multi-select"
                     classNamePrefix="select"
                     onChange={(selected) => {
                        const values = selected.map((option) => option.value);
                        setSelectedAmenities(values);
                        setValue("amenities", values);
                     }}
                  />
               )}
               {errors.amenities && <p className="text-red-500 text-sm">{errors.amenities.message}</p>}
            </div>

            {/* Image Upload */}
            <div>
               <label className="block text-gray-600">Room Image</label>
               <input placeholder='Upload image' type="file" accept="image/*" onChange={handleImageUpload} className="file-input file-input-bordered w-full" />
               {isUploading && <p className="text-blue-500 text-sm">Uploading...</p>}
               {errors.imageUrl && <p className="text-red-500 text-sm">{errors.imageUrl.message}</p>}
            </div>

            {/* Image Preview */}
            {previewImage && (
               <div className="flex justify-center">
                  <Image width={160} height={160} unoptimized={true} objectFit='cover' src={previewImage} alt="Room Preview" className="w-32 h-32 rounded-lg  mt-2 shadow-md " />
               </div>
            )}

            {/* Submit Button */}
            <button type="submit" disabled={isFormSubmitting || isSubmitting} className="btn   w-full">
               {isFormSubmitting ? "Adding Room..." : "Add Room"}
            </button>
         </form>
      </div>
   );
};

export default AddRoomForm;