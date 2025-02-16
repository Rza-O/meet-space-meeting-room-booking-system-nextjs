import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

interface NextRequestContext {
	params: {
		id: string;
	};
}

export async function DELETE(req: NextRequest, context: NextRequestContext) {
	try {
		const { userId } = await auth();
		// console.log(auth())
		if (!userId) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		//Get booking ID from params
		const { id } = context.params;
		const bookingId = id;

		//Find the booking
		const booking = await prisma.booking.findUnique({
			where: { id: bookingId },
		});

		console.log("Booking ID received:", bookingId);
		console.log("User ID:", userId);

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

		//Delete the booking
		await prisma.booking.delete({
			where: {
				id: bookingId,
			},
		});

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
