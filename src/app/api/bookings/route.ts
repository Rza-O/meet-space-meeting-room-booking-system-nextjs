import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";

export async function GET() {
	try {
		const user = await currentUser();
		if (!user) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		const bookings = await prisma.booking.findMany({
			where: { userId: user.id },
			include: { room: true },
			orderBy: { startTime: "asc" },
		});

		return NextResponse.json({ bookings });
	} catch (error) {
		console.error("Fetch error:", error);
		return NextResponse.json(
			{ message: "Error fetching bookings" },
			{ status: 500 }
		);
	}
}

// Define booking validation schema
const bookingSchema = z.object({
	roomId: z.string(),
	title: z.string(),
	description: z.string().optional(),
	startTime: z.string(),
	endTime: z.string(),
});

export async function POST(req: NextRequest) {
	try {
		const user = await currentUser();
		if (!user) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		// Parse and validate request data
		const body = await req.json();
		const parsedData = bookingSchema.parse(body);
		const { roomId, title, description, startTime, endTime } = parsedData;

		const start = new Date(startTime);
		const end = new Date(endTime);

		// Check if the **same user** has already booked this room at this time
		const existingUserBooking = await prisma.booking.findFirst({
			where: {
				roomId,
				userId: user.id,
				startTime: { gte: start, lt: end },
				endTime: { gt: start, lte: end },
			},
		});

		if (existingUserBooking) {
			return NextResponse.json(
				{ message: "You have already booked this room" },
				{ status: 400 }
			);
		}

		//  Check if **any user** has already booked this room at this time
		const existingBooking = await prisma.booking.findFirst({
			where: {
				roomId,
				OR: [
					{ startTime: { gte: start, lt: end } },
					{ endTime: { gt: start, lte: end } },
				],
			},
		});

		if (existingBooking) {
			return NextResponse.json(
				{ message: "This room is already booked" },
				{ status: 400 }
			);
		}

		//  Create new booking if no conflicts exist
		const newBooking = await prisma.booking.create({
			data: {
				roomId,
				userId: user.id,
				title,
				description,
				startTime: start,
				endTime: end,
			},
		});

		return NextResponse.json(newBooking, { status: 201 });
	} catch (error) {
		console.error("Booking error:", error);
		return NextResponse.json(
			{ message: "Error processing booking", error },
			{ status: 500 }
		);
	}
}
