import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const POST = async () => {
	try {
		const user = await currentUser();
		// If no user return a 401 Unauthorized response
		if (!user) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}
		// Check if the user already exists in the database
		let existingUser = await prisma.user.findUnique({
			where: {
				clerkId: user.id,
			},
		});
		// If the user does not exist in the database, create a new user
		if (!existingUser) {
			existingUser = await prisma.user.create({
				data: {
					clerkId: user.id,
					email: user.emailAddresses[0].emailAddress!,
					role: "user",
				},
			});
		}
		// Return the user data
		return NextResponse.json(existingUser);
	} catch (error) {
		console.log("Error checking user:", error);
		return NextResponse.json({ message: "Error checking user" },{ status: 500 });
	}
};

export const GET = async () => {
   try {
      const user = await currentUser();
      const email = user?.emailAddresses[0].emailAddress;
		// console.log("User here-> ", user?.emailAddresses[0].emailAddress);

		// If no user return a 401 Unauthorized response
      if (!user) {
			return NextResponse.json({message: "Please Sign in!"});
		}

		// If no user email return a 401 Unauthorized response
		if (!email) {
			return NextResponse.json({message: "User Email not found! Please Login again"}, {status: 404});
		}

		// Check if the user already exists in the database
		const existingUser = await prisma.user.findUnique({
			where: { email },
			select: {role : true}
		})

		// If the user does not exist in the database return a 404 response
		if (!existingUser) {
			return NextResponse.json({message: "User not found please login!"}, {status: 404});
		}

		// Return the user role
		return NextResponse.json({ role: existingUser.role });
		
   } catch (error) {
      console.log("Error fetching User:", error);
      return NextResponse.json({message: "Server Error"}, {status: 500});
   }
};
