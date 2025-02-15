export interface User {
	clerkId: string;
	email: string;
	role: "user" | "admin";
}

export type Room = {
	id: string;
	name: string;
	imageUrl: string;
	capacity: number;
	amenities: string[];
};

export type Booking = {
	id: string;
	roomId: string;
	userId: string;
	title: string;
	description?: string;
	startTime: string;
	endTime: string;
	createdAt: Date;
	updatedAt: Date;
};
