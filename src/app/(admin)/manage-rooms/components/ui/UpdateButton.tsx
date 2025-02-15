"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";
import Swal from "sweetalert2";
import { CiEdit } from "react-icons/ci";
import Select from "react-select";
import { Room } from "@/lib/types";
import Image from "next/image";

type UpdateButtonProps = {
   room: Room;
};

const roomSchema = z.object({
   name: z.string().min(4, "Room name must be at least 4 characters long"),
   capacity: z.number().min(1, "Capacity must be at least 1"),
   amenities: z.array(z.string()).min(1, "At least one amenity is required"),
   imageUrl: z.string().url("Upload a valid image URL"),
});

const amenitiesOptions = [
   { value: "wifi", label: "Wi-Fi" },
   { value: "projector", label: "Projector" },
   { value: "whiteboard", label: "Whiteboard" },
   { value: "ac", label: "Air Conditioning" },
];

const UpdateButton = ({ room }: UpdateButtonProps) => {
   const [isOpen, setIsOpen] = useState(false);
   const [previewImage, setPreviewImage] = useState(room?.imageUrl || "");
   const [isUploading, setIsUploading] = useState(false);
   const queryClient = useQueryClient();


   const defaultAmenities = room.amenities || [];

   const { register, handleSubmit, setValue, formState: { errors } } = useForm({
      resolver: zodResolver(roomSchema),
      defaultValues: {
         id: room.id,
         name: room.name,
         capacity: room.capacity,
         amenities: defaultAmenities,
         imageUrl: room.imageUrl,
      },
   });

   const { mutate, isPending } = useMutation({
      mutationFn: async (updatedRoom: Room) => {
         return await axios.patch(`/api/rooms/${room.id}`, updatedRoom);
      },
      onSuccess: () => {
         queryClient.invalidateQueries({queryKey: ["rooms"]});
         Swal.fire("Updated!", "Room details have been updated.", "success");
         setIsOpen(false);
      },
   });

   const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      const formData = new FormData();
      formData.append("image", file);

      try {
         const res = await axios.post(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, formData);
         const imageUrl = res.data.data.url;

         setPreviewImage(imageUrl);
         setValue("imageUrl", imageUrl);
      } catch (error) {
         console.error("Error uploading image:", error);
      } finally {
         setIsUploading(false);
      }
   };

   const onSubmit = (data: Room) => {
      mutate(data);
   };


   return (
      <>
         <button onClick={() => setIsOpen(true)} className="btn btn-ghost btn-lg">
            <CiEdit />
         </button>

         {isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
               <div className="bg-black p-6 rounded-2xl shadow-lg w-96">
                  <h2 className="text-xl font-bold mb-4">Update Room</h2>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                     {/* Room Name */}
                     <div>
                        <label className="block text-gray-600">Room Name</label>
                        <input {...register("name")} type="text" className="input input-bordered w-full" />
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
                        <Select
                           isMulti
                           options={amenitiesOptions}
                           defaultValue={defaultAmenities.map((a) => ({ value: a, label: a }))}
                           onChange={(selected) => {
                              const values = selected.map((option) => option.value);
                              setValue("amenities", values);
                           }}
                        />
                        {errors.amenities && <p className="text-red-500 text-sm">{errors.amenities.message}</p>}
                     </div>

                     {/* Image Upload */}
                     <div>
                        <label className="block text-gray-600">Current Image</label>
                        <div className="flex justify-center">
                           <Image width={43} height={43} unoptimized src={previewImage} alt="Room Preview" className="w-32 h-32 rounded-lg object-cover mt-2 shadow-md" />
                        </div>
                     </div>

                     {/* Image Upload Input */}
                     <div>
                        <label className="block text-gray-600">Upload New Image</label>
                        <input
                           type="file"
                           accept="image/*"
                           onChange={handleImageUpload}
                           className="file-input file-input-bordered w-full"
                           title="Upload New Image"
                        />
                        {isUploading && <p className="text-blue-500 text-sm">Uploading...</p>}
                     </div>

                     {/* Submit & Close Buttons */}
                     <div className="flex justify-between">
                        <button type="button" onClick={() => setIsOpen(false)} className="btn btn-ghost">
                           Close
                        </button>
                        <button type="submit" disabled={isPending} className="btn btn-primary">
                           {isPending ? "Updating..." : "Update"}
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}
      </>
   );
};

export default UpdateButton;
