export type BookingStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Cancelled";

export type Booking = {
  id: number;
  title: string;
  description?: string;
  roomId: number;
  roomName: string;
  userId: number;
  userName: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
};

export type CreateBookingRequest = {
  roomId: number;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
};