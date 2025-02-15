import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (
	req: NextRequest,
	{ params }: { params: { id: string } }
) => {
	try {
		const roomId = params.id;
		const body = await req.json();
		// updating the room
		const updatedRoom = await prisma.room.update({
			where: { id: roomId },
			data: body,
		});
		return NextResponse.json(updatedRoom, { status: 200 });
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ message: "Error updating room" },
			{ status: 500 }
		);
	}
};

export const DELETE = async (
	req: NextRequest,
	{ params }: { params: { id: string } }
) => {
	try {
		const roomId = params.id;
		// deleting the room
		await prisma.room.delete({
			where: { id: roomId },
		});
		return NextResponse.json(
			{ message: "Room deleted successfully" },
			{ status: 200 }
		);
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ message: "Error deleting room" },
			{ status: 500 }
		);
	}
};
