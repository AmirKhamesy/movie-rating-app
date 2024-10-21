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
    <div >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-cinema-">
            Your Movie Lists
          </h1>
          <AddList />
        </div>
        <p className="text-gray-300 text-sm mb-4">
          Manage and rate your favorite movies in personalized lists.
        </p>
      </div>
      <Lists lists={lists} userId={session.user.id} />
    </div>
  );
};

export default RatePage;
