"use client";

import { Booking } from "@/types/booking";

interface BookingCardProps {
  booking: Booking;
  onCancel: (id: number) => void;
}

const getBookingStatus = (status: number | string) => {
  switch (Number(status)) {
    case 0:
      return "Pending";
    case 1:
      return "Approved";
    case 2:
      return "Rejected";
    case 3:
      return "Cancelled";
    default:
      return "Unknown";
  }
};

export default function BookingCard({
  booking,
  onCancel,
}: BookingCardProps) {
  const status = Number(booking.status);

  const isPending = status === 0;
  const isApproved = status === 1;

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">
            {booking.title}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {booking.roomName}
          </p>
        </div>

        {/* STATUS */}
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            status === 0
              ? "bg-yellow-100 text-yellow-700"
              : status === 1
                ? "bg-green-100 text-green-700"
                : status === 2
                  ? "bg-red-100 text-red-700"
                  : status === 3
                    ? "bg-gray-100 text-gray-700"
                    : "bg-gray-100 text-gray-500"
          }`}
        >
          {getBookingStatus(booking.status)}
        </span>
      </div>

      {/* DESCRIPTION */}
      {booking.description && (
        <p className="mt-4 text-sm text-gray-600">
          {booking.description}
        </p>
      )}

      {/* SCHEDULE */}
      <div className="mt-5 space-y-2 text-sm">
        <div>
          <span className="font-medium">
            Start:
          </span>{" "}
          {new Date(
            booking.startTime
          ).toLocaleString()}
        </div>

        <div>
          <span className="font-medium">
            End:
          </span>{" "}
          {new Date(
            booking.endTime
          ).toLocaleString()}
        </div>
      </div>

      {/* CANCEL BUTTON */}
      {(isPending || isApproved) && (
        <div className="mt-5 border-t pt-4">
          <button
            type="button"
            onClick={() => onCancel(booking.id)}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
          >
            Cancel Booking
          </button>
        </div>
      )}
    </div>
  );
}