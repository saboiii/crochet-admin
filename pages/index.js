import Layout from "@/components/layout/Layout"
import { useSession } from "next-auth/react"

export default function Home() {
  const { data: session } = useSession();
  return (
    <Layout>
      <p> Hello, {session?.user?.name}.</p>
    </Layout>
  )
}
