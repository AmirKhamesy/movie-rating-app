import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { LoginButton, LogoutButton } from "./auth";
import { User } from "./components/User";

const HomePage = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <h1 className="text-4xl">Home Page</h1>
      <LoginButton />
      <LogoutButton />
      <h2>Server Session</h2>
      <pre>{JSON.stringify(session)}</pre>
      <h2>Client Call</h2>
      <User />
    </div>
  );
};

export default HomePage;
