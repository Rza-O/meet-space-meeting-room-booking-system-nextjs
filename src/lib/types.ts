export interface User {
	clerkId: string;
	email: string;
	role: "user" | "admin";
}

export type Room = {
		id: string
		name: string
		imageUrl: string
		capacity: number
		amenities: string[]
	}