import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ensure correct import
import { getAuth } from "@clerk/nextjs/server";

// Explicit type for route parameters
type RouteParams = {
	params: { id: string };
};

export async function DELETE(
	request: NextRequest,
	{ params }: RouteParams
): Promise<NextResponse> {
	try {

		// Get authenticated user
		const { userId } = getAuth(request);
		if (!userId) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		// Extract booking ID from params
		const bookingId = params.id;
		if (!bookingId) {
			return NextResponse.json(
				{ message: "Booking ID is required" },
				{ status: 400 }
			);
		}

		// Ensure booking exists
		const booking = await prisma.booking.findUnique({
			where: { id: bookingId },
		});

		if (!booking) {
			return NextResponse.json(
				{ message: "Booking not found" },
				{ status: 404 }
			);
		}

		if (booking.userId !== userId) {
			return NextResponse.json(
				{ message: "Unauthorized access" },
				{ status: 403 }
			);
		}

		// Delete the booking
		await prisma.booking.delete({
			where: { id: bookingId },
		});

		return NextResponse.json(
			{ message: "Booking deleted successfully" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("DELETE Error:", error);
		return NextResponse.json(
			{ message: "Internal server error"},
			{ status: 500 }
		);
	}
}
