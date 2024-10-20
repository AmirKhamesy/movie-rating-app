import AddList from "../components/AddList";
import { cookies } from "next/headers";
import Lists from "../components/Lists";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { Prisma } from "@prisma/client";

async function fetchLists() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/lists`, {
    credentials: "include",
    next: { revalidate: 0 },
    headers: { Cookie: cookies().toString() },
  });

  if (!res.ok) {
    throw new Error("Failed to get lists");
  }
  return res.json();
}

const RatePage = async () => {
  const session = await getServerSession(authOptions);
  const lists: Prisma.ListSelect = await fetchLists();

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Your Movie Lists</h1>
        <AddList />
      </div>
      <Lists lists={lists} userId={session.user.id} />
    </div>
  );
};

export default RatePage;
