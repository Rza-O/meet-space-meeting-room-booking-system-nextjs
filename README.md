# MeetSpace - Online Meeting Room Booking Platform

MeetSpace is an online meeting room booking system that allows users to browse available rooms, book them based on availability, and manage their bookings. The platform ensures seamless authentication, booking conflict prevention, and a user-friendly interface.

# Admin Credentials

For testing the admin functionalities, you can use the following dummy admin credentials:

-  Email: shahreza.dev@gmail.com
-  Password: HappyCoding01

#### Note: In production, ensure that admin credentials are managed securely and not hard-coded.

## 🚀 Features Implemented

### **🔑 Authentication**

-  User authentication powered by **Clerk**
-  Automatically saves user data to the database upon login
-  Role-based authentication with three levels: **Guest, User, Admin**

### **🏢 Room Management**

-  **List available rooms** with details including name, capacity, amenities, and images
-  **Add a new room** with:
   -  Name input
   -  Capacity selection
   -  Amenities selection via a multi-select dropdown
   -  Image upload via **ImgBB**, with real-time preview
-  **Edit room details** through a modal form
-  **Delete rooms** with a confirmation prompt using **SweetAlert2**

### **📅 Booking System**

-  **Book a room** with:
   -  **Date selection** using **React DatePicker**
   -  **Time selection** (9 AM - 12 PM in 30-minute intervals)
   -  Prevents **double bookings** for the same room at the same time
   -  Ensures **users can't book the same room at the same time**
-  **Store bookings in MongoDB** using **Prisma ORM**
-  **Save user bookings to local storage**
-  **Paginated My Bookings page** (5 bookings per page)
-  **Delete booking functionality** with confirmation prompt

### **🎨 UI & UX Enhancements**

-  Responsive **navigation bar** with **role-based menu items**
-  Beautiful **room cards** displaying amenities, images, and details
-  **Loading state handling** for API calls using React Query
-  **Floating Book Now button** to enhance UX for mobile & desktop users

---

## 🛠️ Setup Instructions

### **1️⃣ Clone the Repository**

```sh
git clone https://github.com/your-github-username/meet-space.git
cd meet-space
```

### **2️⃣ Install Dependencies**

```sh
npm install
```

### **3️⃣ Set Up Environment Variables**

Create a .env file in the root directory and add the following (replace the dummy values with your actual credentials):

```sh
DATABASE_URL="your-mongodb-connection-string"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-publishable-key"
CLERK_SECRET_KEY="your-clerk-secret-key"
NEXT_PUBLIC_IMGBB_API_KEY="your-imgbb-api-key"
```

### **4️⃣ Generate Prisma Client**

```sh
npx prisma generate
```

### **5️⃣ Start the Development Server**

```sh
npm run dev
```

Happy coding! 🚀
