import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import LoginForm from "./components/LoginForm";
import HomeContent from "./components/HomeContent";

const HomePage = async () => {
  const session = await getServerSession(authOptions);

  if (!session) return <LoginForm />;

  const publicLists = await fetch(
    `${process.env.NEXT_PUBLIC_API}/api/publicList`,
    {
      cache: "no-store",
    }
  ).then((res) => res.json());

  return (
    <div className=" py-12">
      <div className="container mx-auto px-4">
        <HomeContent userName={session.user.name} publicLists={publicLists} />
      </div>
    </div>
  );
};

export default HomePage;
