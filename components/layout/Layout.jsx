import { useSession, signIn } from "next-auth/react"
import Navbar from "@/components/navbar/Navbar";

export default function Layout({ children }) {
  const { data: session } = useSession()
  if (!session) {
    return (
      <div className="min-h-screen min-w-screen bg-[#FEFBD8]">
        <button onClick={() => signIn('google')} className="bg-[#B1AFFF] p-2 text-white rounded-lg m-2">
          Login with Google
        </button>
      </div>
    )
  }
  return (
    <div className="min-h-screen min-w-screen bg-[#FEFBD8]">
      <Navbar />
      <div className="flex p-4 flex-col">
        {children}
      </div>
    </div>
  );
}
