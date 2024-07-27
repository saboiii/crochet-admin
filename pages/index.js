import Layout from "@/components/layout/Layout"
import { useSession } from "next-auth/react"

export default function Home() {
  const { data: session } = useSession();
  return <Layout>
    <p className="flex m-2"> Hello, {session?.user?.name}.</p>
    <button onClick={() => signOut()} className="bg-[#B1AFFF] p-2 flex m-2 text-white rounded-lg">Log Out</button>
  </Layout>
}
