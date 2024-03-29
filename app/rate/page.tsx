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
    headers: { Cookie: cookies().toString() }, //HACK: Send cookies to server
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
    <div className="max-w-4xl mx-auto mt-4">
      <div>
        <div className="my-5">
          <AddList />
        </div>
        <Lists lists={lists} userId={session.user.id} />
      </div>
    </div>
  );
};

export default RatePage;
