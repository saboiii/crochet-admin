import { useSession, signIn } from "next-auth/react"
import Navbar from "@/components/navbar/Navbar";

export default function Layout({ children }) {
  const { data: session } = useSession()
  if (!session) {
    return (
      <div className="min-h-screen min-w-screens">
        <button onClick={() => signIn('google')} className="bg-[#B1AFFF] p-2 text-white rounded-lg m-2">
          Login with Google
        </button>
      </div>
    )
  }
  return (
    <div className="flex flex-row min-h-screen min-w-screen ">
      <Navbar />
      <div className="flex p-10 flex-col">
        {children}
      </div>
    </div>
  );
}
