"use client";
import { SignedOut, SignInButton, UserButton, useUser } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import React from 'react';

const Navbar = () => {
   // checking if user is signed in
   const { isSignedIn } = useUser();

   // checking user role to optional chain navLinks based on user role
   const { data } = useQuery<{ role: string }>({
      queryKey: ['user-role'],
      queryFn: async () => {
         const { data } = await axios.get('/api/auth/user');
         return data;
      },
      enabled: isSignedIn
   })

   const role = data?.role;
   console.log("from navbar-> ", role);

   const guestNav: React.JSX.Element = (
      <>
         {/* <li><Link href="/">Home</Link></li> */}
      </>
   );

   const userNav: React.JSX.Element = (
      <>
         <li><Link href="/">Home</Link></li>
         <li><Link href="/available-rooms">Available Rooms</Link></li>
         <li><Link href="/my-bookings">My Bookings</Link></li>
      </>
   );
   const adminNav: React.JSX.Element = (
      <>
         <li><Link href="/">Home</Link></li>
         <li><Link href="/add-room">Add room</Link></li>
         <li><Link href="/manage-rooms">Manage Room</Link></li>
      </>
   );

   return (
      <div>
         <div className="navbar bg-base-100 text-white w-11/12 mx-auto">
            <div className="navbar-start">
               <div className="dropdown">
                  <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden" aria-label="Menu">
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth="2"
                           d="M4 6h16M4 12h8m-8 6h16" />
                     </svg>
                  </div>
                  <ul
                     tabIndex={0}
                     className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                     {!isSignedIn ? guestNav : role === 'admin' ? adminNav : userNav}
                  </ul>
               </div>
               <Link href='/' className="font-bold text-xl">MeetSpace</Link>
            </div>
            <div className="navbar-center hidden lg:flex">
               <ul className="menu menu-horizontal px-1">
                  {!isSignedIn ? guestNav : role === 'admin' ? adminNav : userNav}
               </ul>
            </div>
            <div className="navbar-end">
               <SignedOut>
                  <SignInButton mode='modal' />
               </SignedOut>
               <SignInButton>
                  <UserButton></UserButton>
               </SignInButton>
            </div>
         </div>
      </div>
   );
};

export default Navbar;