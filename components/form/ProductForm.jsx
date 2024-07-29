import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { MdOutlineFileUpload } from "react-icons/md";

export default function ProductForm({
    _id,
    title: existingTitle,
    desc: existingDesc,
    price: existingPrice,
    images,
}) {
    const [title, setTitle] = useState(existingTitle || '');
    const [desc, setDesc] = useState(existingDesc || '');
    const [price, setPrice] = useState(existingPrice || '');
    const [goToProducts, setGoToProducts] = useState(false);
    const router = useRouter();

    async function saveProduct(ev) {
        ev.preventDefault();
        const data = { title, desc, price }
        if (_id) {
            await axios.put('/api/products', { ...data, _id });
        } else {
            await axios.post('/api/products', data)
        }
        setGoToProducts(true);
    }

    if (goToProducts) {
        router.push('/products');
    }

    async function uploadImages(ev){
        const files = ev.target?.files;
        if(files?.length > 0){
            const data = new FormData();
            for (const file of files){
                data.append('file', file);
            }
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: data,
            })
            console.log(res);
        }
    }

    return (
        <form onSubmit={saveProduct} className="flex-col w-screen px-8">
            <label>Product Name</label>
            <input type="text" placeholder="Product Name" className="flex w-1/2 my-2" value={title} onChange={ev => setTitle(ev.target.value)} />
            <label>Description</label>
            <textarea placeholder="Description" className="flex w-1/2 my-2" value={desc} onChange={ev => setDesc(ev.target.value)}></textarea>
            <label>Images</label>
            <div className="my-2">
                <label className="flex cursor-pointer font-normal w-32 h-32 text-[#e8cabc] rounded-lg outline-dashed outline-2 outline-[#e8cabc] items-center justify-center my-2 hover:outline-[#f8ddbd] hover:text-[#f8ddbd] duration-100 ease-in-out">
                    <p className="mr-1">Upload</p>
                    <MdOutlineFileUpload className="text-xl"/>
                    <input type="file" className="hidden" onChange={uploadImages}></input>
                </label>
                {!images?.length && (
                    <div>No photos in this product.</div>
                )}
            </div>
            <label>Price (in SGD)</label>
            <input type="number" min="0.00" step="0.01" placeholder="Price" className="flex w-1/2 my-2" value={price} onChange={ev => setPrice(ev.target.value)} />
            <button type="submit" className="button-1 flex">Save</button>
        </form>
    );
}