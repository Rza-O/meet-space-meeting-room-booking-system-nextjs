import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
	try {
		const { name, capacity, amenities, imageUrl } = await req.json();
		const newRoom = await prisma.room.create({
			data: { name, capacity, amenities, imageUrl },
		});
		return NextResponse.json(newRoom, { status: 201 });
	} catch (error) {
		console.log("Error adding room:", error);
		return NextResponse.json(
			{ message: "Error adding room" },
			{ status: 500 }
		);
	}
};

export const GET = async () => {
	try {
		const rooms = await prisma.room.findMany();
		return NextResponse.json(rooms);
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ message: "Error fetching rooms" },
			{ status: 500 }
		);
	}
};

