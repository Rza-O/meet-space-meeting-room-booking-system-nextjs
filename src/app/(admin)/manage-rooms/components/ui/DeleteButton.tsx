import React from 'react';
import { TiDeleteOutline } from "react-icons/ti";

const DeleteButton = () => {
   return (
      <button className="btn btn-ghost btn-lg"><TiDeleteOutline className='text-red-500' /></button>
   );
};

export default DeleteButton;