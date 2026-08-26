import Link from "next/link";
import { Room } from "@/types/room";

type Props = {
  room: Room;
};

export default function RoomCard({ room }: Props) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <h2 className="text-lg font-semibold">{room.name}</h2>
      </div>

      <div className="mt-4 space-y-2 text-sm text-gray-600">
        <p>Capacity: {room.capacity} people</p>
      </div>

      <Link href={`/bookings/create?roomId=${room.id}`} className="mt-5 block rounded-lg bg-primary px-4 py-2 text-center text-sm text-white hover:bg-primary-dark">
        Book This Room
      </Link>
    </div>
  );
}
