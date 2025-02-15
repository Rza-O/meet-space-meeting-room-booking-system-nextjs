import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async () => { 
   try {
      const rooms = await prisma.room.findMany({
         take: 3,
         orderBy: { createdAt: 'desc' }
      });
		return NextResponse.json(rooms);
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ message: "Error fetching rooms" },
			{ status: 500 }
		);
	}
};