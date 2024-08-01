import Layout from "@/components/layout/Layout";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";

export default function Products() {
    const [products, setProducts] = useState([]);
    const itemStyle = 'bg-[#FFE9D0] rounded-xl flex-col px-2 py-4 outline-dashed outline-[#f5cda0] outline-2';

    useEffect(() => {
        axios.get('/api/products').then(response => {
            setProducts(response.data);
        });
    }, []);

    return (
        <Layout className='flex h-screen w-screen'>
            <Head>
                <title>Crochets | Products</title>
                <meta name="description" content="Admin products page for Crochet E-Commerce." />
            </Head>
            <div className="flex-col">
                <Link href={'/products/new'} className="flex button-1 w-32 justify-center mb-4">Add Product</Link>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 z-10 w-full">
                    {products.map(product => (
                        <tr key={product._id}>
                            <div className={itemStyle}>
                                <p className="mx-4 my-2">{product.title}</p>
                                <Link href={'/products/edit/' + product._id} className="button-2 mx-4">
                                    Edit
                                </Link>
                                <Link href={'/products/delete/' + product._id} className="button-3 mx-4">
                                    Delete
                                </Link>
                            </div>
                        </tr>
                    ))}
                </div>
            </div>
        </Layout>
    );
}