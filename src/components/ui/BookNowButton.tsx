"use client";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import { Booking, Room } from "@/lib/types";
import { useUser } from "@clerk/nextjs";

type BookNowButtonProps = {
   room: Room;
};

const BookNowButton = ({ room }: BookNowButtonProps) => {
   const { user } = useUser();
   const userId = user?.id;
   const [isOpen, setIsOpen] = useState(false);
   const [selectedDate, setSelectedDate] = useState<Date | null>(null);
   const [selectedTime, setSelectedTime] = useState<string>("");
   const [description, setDescription] = useState<string>("");
   const queryClient = useQueryClient();

   const timeSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"];

   //Fetch existing bookings to prevent conflicts
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   const { data: existingBookings } = useQuery({
      queryKey: ["bookings", room.id],
      queryFn: async () => {
         const { data } = await axios.get(`/api/bookings?roomId=${room.id}`);
         return data;
      },
   });

   const isTimeSlotTaken = (date: Date, time: string, existingBookings?: Booking[]): boolean => {
      return existingBookings?.some((booking: Booking) =>
         new Date(booking.startTime).toDateString() === date.toDateString() &&
         new Date(booking.startTime).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
         }) === time
      ) ?? false;
   };

   const { mutate, isPending } = useMutation({
      mutationFn: async () => {
         if (!selectedDate || !selectedTime) {
            throw new Error("Please select a date and time.");
         }

         const startTime = new Date(`${selectedDate.toDateString()} ${selectedTime}`);
         const endTime = new Date(startTime);
         endTime.setMinutes(startTime.getMinutes() + 30);

         const bookingData = {
            roomId: room.id,
            userId,
            title: `Booking for ${room.name}`,
            description,
            startTime,
            endTime,
         };

         await axios.post("/api/bookings", bookingData);

         const storedBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
         storedBookings.push(bookingData);
         localStorage.setItem("bookings", JSON.stringify(storedBookings));

         return bookingData;
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["bookings"] });
         Swal.fire("Success!", "Your booking is confirmed!", "success");
         setIsOpen(false);
      },
      onError: (error) => {
         console.log(error)
         const errorMessage = axios.isAxiosError(error) && error.response ? error.response.data.message : error.message;
         Swal.fire("Error", errorMessage, "error");
      },
   });

   return (
      <>
         <button onClick={() => setIsOpen(true)} className="btn btn-primary">Book Now</button>

         {isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
               <div className="bg-primary-content p-6 rounded-lg shadow-lg w-96 relative">
                  {/* Close Button in the top-right corner */}
                  <button
                     onClick={() => setIsOpen(false)}
                     className="absolute top-2 right-2 btn btn-sm btn-circle btn-ghost"
                     aria-label="Close"
                  >
                     ✕
                  </button>

                  <h2 className="text-xl font-bold mb-4 text-center">Book {room.name}</h2>

                  {/* Date Picker */}
                  <div className="mb-4">
                     <label className="block text-gray-600 font-semibold">Select Date</label>
                     <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        minDate={new Date()}
                        className="input input-bordered w-full"
                     />
                  </div>

                  {/* Time Slots */}
                  <div className="mb-4">
                     <label className="block text-gray-600 font-semibold">Select Time</label>
                     <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map((time) => (
                           <button
                              key={time}
                              className={`btn ${selectedTime === time
                                    ? "btn-primary"
                                    : isTimeSlotTaken(selectedDate!, time)
                                       ? "btn-disabled"
                                       : "btn-outline"
                                 }`}
                              onClick={() => !isTimeSlotTaken(selectedDate!, time) && setSelectedTime(time)}
                              disabled={isTimeSlotTaken(selectedDate!, time)}
                           >
                              {time}
                           </button>
                        ))}
                     </div>
                  </div>

                  {/* Description Input */}
                  <div className="mb-4">
                     <label className="block text-gray-600 font-semibold">Additional Notes</label>
                     <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter any additional details..."
                        className="textarea textarea-bordered w-full"
                     />
                  </div>

                  {/* Submit & Close Buttons */}
                  <div className="flex justify-between">
                     <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="btn btn-outline"
                     >
                        Cancel
                     </button>
                     <button
                        type="submit"
                        disabled={isPending}
                        onClick={() => mutate()}
                        className="btn btn-primary"
                     >
                        {isPending ? "Booking..." : "Confirm Booking"}
                     </button>
                  </div>
               </div>
            </div>
         )}
      </>
   );
};

export default BookNowButton;
