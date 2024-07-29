import Layout from "@/components/layout/Layout";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Products() {
    const [products, setProducts] = useState([]);
    const itemStyle = 'bg-[#FFE9D0] rounded-xl flex-col p-2';

    useEffect(() => {
        axios.get('/api/products').then(response => {
            setProducts(response.data);
        });
    }, []);

    return (
        <Layout className='flex h-screen w-screen'>
            <div className="flex-col">
                <Link href={'/products/new'} className="flex button-1 w-32 justify-center">Add Product</Link>
                <div className="grid grid-cols-3 gap-3 z-10 w-full">
                    {products.map(product => (
                        <div className={itemStyle}>
                            <p className="mx-4 my-2">{product.title}</p>
                            <Link href={'/products/edit/' + product._id} className="button-2">
                                Edit
                            </Link>
                            <Link href={'/products/delete/' + product._id} className="button-3">
                                Delete
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}