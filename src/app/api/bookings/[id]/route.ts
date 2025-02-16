import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === "DELETE") {
		try {
			const { userId } = await auth();
			if (!userId) {
				return res.status(401).json({ message: "Unauthorized" });
			}

			// Get booking ID from query
			const { id } = req.query;
			const bookingId = id as string;

			// Find the booking
			const booking = await prisma.booking.findUnique({
				where: { id: bookingId },
			});

			if (!booking) {
				return res.status(404).json({ message: "Booking not found" });
			}

			// Ensure the booking belongs to the logged-in user
			if (booking.userId !== userId) {
				return res
					.status(403)
					.json({ message: "Unauthorized to delete this booking" });
			}

			// Delete the booking
			await prisma.booking.delete({
				where: {
					id: bookingId,
				},
			});

			return res
				.status(200)
				.json({ message: "Booking deleted successfully" });
		} catch (error) {
			console.error("Delete error:", error);
			return res
				.status(500)
				.json({ message: "Error deleting booking", error });
		}
	} else {
		res.setHeader("Allow", ["DELETE"]);
		return res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
