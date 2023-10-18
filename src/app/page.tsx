import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs";

export default async function Home() {
  const user = await currentUser();

  if (!user) return <div>Not logged in</div>;

  return (
    <div>
      <p>Hello {user?.firstName}</p>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}
