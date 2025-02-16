import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 
import { getAuth } from "@clerk/nextjs/server"; 
import { ObjectId } from "mongodb"; 

export async function DELETE(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { userId } = getAuth(req); 
		if (!userId) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}
		const { id } = await params;
		const bookingId = id;

		//Ensure bookingId is valid for MongoDB
		if (!ObjectId.isValid(bookingId)) {
			return NextResponse.json(
				{ message: "Invalid booking ID" },
				{ status: 400 }
			);
		}

		//Find the booking
		const booking = await prisma.booking.findUnique({
			where: { id: bookingId },
		});

		if (!booking) {
			return NextResponse.json(
				{ message: "Booking not found" },
				{ status: 404 }
			);
		}

		//Ensure the booking belongs to the logged-in user
		if (booking.userId !== userId) {
			return NextResponse.json(
				{ message: "Unauthorized to delete this booking" },
				{ status: 403 }
			);
		}

		//delete the booking
		await prisma.booking.delete({ where: { id: bookingId } });

		return NextResponse.json(
			{ message: "Booking deleted successfully" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Delete error:", error);
		return NextResponse.json(
			{ message: "Error deleting booking", error },
			{ status: 500 }
		);
	}
}
