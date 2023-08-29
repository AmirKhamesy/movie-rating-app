import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { LoginButton, LogoutButton } from "./auth";

const HomePage = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div>
      {session ? (
        <>
          <h1 className="text-4xl">Hello {session?.user?.name}</h1>
          <LogoutButton />
        </>
      ) : (
        <LoginButton />
      )}
    </div>
  );
};

export default HomePage;
