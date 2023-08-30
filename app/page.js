import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { LogoutButton } from "./auth";
import { redirect } from "next/navigation";

const HomePage = async () => {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/api/auth/signin");

  return (
    <div className="flex justify-between">
      <h1 className="text-4xl">Hello {session?.user?.name}</h1>
      <LogoutButton />
    </div>
  );
};

export default HomePage;
