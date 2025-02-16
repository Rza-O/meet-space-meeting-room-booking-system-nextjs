import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";


export async function DELETE(
	req: NextRequest,
	context: { params: { id: string } }
) {
	try {
		const user = await auth();
		if (!user) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		//Get booking ID from params
		const bookingId = context.params.id;

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
		if (booking.userId !== user.userId) {
			return NextResponse.json(
				{ message: "Unauthorized to delete this booking" },
				{ status: 403 }
			);
		}

		//Delete the booking
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
