import Layout from "@/components/layout/Layout"
import { useSession } from "next-auth/react"
import Head from 'next/head';

export default function Home() {
  const { data: session } = useSession();
  return (
    <Layout>
      <Head>
        <title>Crochets | Home</title>
        <meta name="description" content="Admin home page for Crochet E-Commerce." />
      </Head>
      <p> Hello, {session?.user?.name}.</p>
    </Layout>
  )
}
