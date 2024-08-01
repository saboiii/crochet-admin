import Layout from "@/components/layout/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DeleteProductPage() {
    const router = useRouter();
    const [productInfo, setProductInfo] = useState(null);
    const { id } = router.query;

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/api/products?id=' + id).then(response => {
            setProductInfo(response.data);
        });
    }, [id]);

    function goBack() {
        router.push('/products');
    }

    async function deleteProduct(){
        await axios.delete('/api/products?id='+id);
        goBack();
    }

    return (
        <Layout>
            <div className="flex flex-row">
                <p>Are you sure you want to delete</p>
                <p className="text-[#dd9d54]">&nbsp;{productInfo?.title}</p>
                <p>? This action cannot be reversed.</p>
            </div>
            <div className="flex flex-row p-2">
                <button onClick={deleteProduct} className="button-1 w-16 justify-center mr-2">Yes</button>
                <button onClick={goBack} className="button-1 w-16 justify-center">No</button>
            </div>
        </Layout>
    )
}