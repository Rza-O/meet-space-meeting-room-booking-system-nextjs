"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa";
import { Booking } from "@/lib/types";
import LoadingSkeleton from "@/components/LoadingSkeleton";

const MyBookings = () => {
   const { user } = useUser();
   const queryClient = useQueryClient();
   const [currentPage, setCurrentPage] = useState(1);
   const bookingsPerPage = 5;

   // Fetch bookings with proper typing
   const { data: bookingsResponse, isLoading } = useQuery({
      queryKey: ["bookings", user?.id],
      queryFn: async () => {
         const { data } = await axios.get(`/api/bookings?userId=${user?.id}`);
         return data;
      },
      enabled: !!user?.id,
   });

   console.log(bookingsResponse)

   // Delete mutation with proper typing
   const { mutate: deleteBooking } = useMutation({
      mutationFn: async (bookingId: string) => {
         await axios.delete(`/api/bookings/${bookingId}`);
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["bookings", user?.id] });
         Swal.fire("Deleted!", "Your booking has been deleted.", "success");
      },
      onError: (error: Error) => {
         Swal.fire("Error", error.message, "error");
      },
   });

   // Fixed pagination logic
   const bookings = bookingsResponse?.bookings || [];
   const totalPages = Math.ceil(bookings.length / bookingsPerPage);
   const paginatedBookings = bookings.slice(
      (currentPage - 1) * bookingsPerPage,
      currentPage * bookingsPerPage
   );

   console.log(paginatedBookings)

   const handleDelete = (bookingId: string) => {
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
            deleteBooking(bookingId);
         }
      });
   };

   if (isLoading) return <LoadingSkeleton />;

   return (
      <div className="container mx-auto py-10">
         <h2 className="text-3xl font-bold text-center mb-6">My Bookings</h2>

         <div className="overflow-x-auto">
            <table className="table w-full">
               <thead>
                  <tr>
                     <th>Date</th>
                     <th>Time</th>
                     <th>Title</th>
                     <th>Action</th>
                  </tr>
               </thead>
               <tbody>
                  {paginatedBookings.map((booking: Booking) => (
                     <tr key={booking.id}>
                        <td>{new Date(booking.startTime).toLocaleDateString()}</td>
                        <td>
                           {new Date(booking.startTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit"
                           })} -
                           {new Date(booking.endTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit"
                           })}
                        </td>
                        <td>{booking.title}</td>
                        <td>
                           <button
                              onClick={() => handleDelete(booking.id)}
                              className="btn btn-error btn-sm"
                           >
                              <FaTrash />
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>

         <div className="flex justify-center mt-6">
            {Array.from({ length: totalPages }, (_, i) => (
               <button
                  key={i + 1}
                  className={`btn mx-1 ${currentPage === i + 1 ? "btn-primary" : "btn-outline"}`}
                  onClick={() => setCurrentPage(i + 1)}
               >
                  {i + 1}
               </button>
            ))}
         </div>
      </div>
   );
};

export default MyBookings;