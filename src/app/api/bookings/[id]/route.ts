import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { ObjectId } from "mongodb";

// Explicit type for route parameters
type RouteParams = {
	params: {
		id: string;
	};
};

export async function DELETE(
	request: NextRequest,
	context: RouteParams
): Promise<NextResponse> {
	try {
		const { userId } = getAuth(request);
		if (!userId) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		const bookingId = context.params.id;

		if (!ObjectId.isValid(bookingId)) {
			return NextResponse.json(
				{ message: "Invalid booking ID format" },
				{ status: 400 }
			);
		}

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

		await prisma.booking.delete({ where: { id: bookingId } });

		return NextResponse.json(
			{ message: "Booking deleted successfully" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("DELETE Error:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}
