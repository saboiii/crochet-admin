import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineFileUpload } from "react-icons/md";
import { PulseLoader } from "react-spinners";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
    _id,
    title: existingTitle,
    desc: existingDesc,
    price: existingPrice,
    images: existingImages,
}) {
    const [title, setTitle] = useState(existingTitle || '');
    const [desc, setDesc] = useState(existingDesc || '');
    const [price, setPrice] = useState(existingPrice || '');
    const [images, setImages] = useState(existingImages || []);
    const [goToProducts, setGoToProducts] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();
    let index = -1;

    async function saveProduct(ev) {
        ev.preventDefault();
        const data = { title, desc, price, images }
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

    async function uploadImages(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {
            setIsUploading(true);
            const data = new FormData();
            for (const file of files) {
                data.append('file', file);
            }
            const res = await axios.post('/api/upload', data);
            setImages(oldImages => {
                return [...oldImages, ...res.data.links];
            });
            setIsUploading(false);
        }
    }

    function updateImagesOrder(images) {
        setImages(images);
    }

    function deleteImage({ link }) {
        setIsDeleting(true);
        const newImages = [...images];
        const index = newImages.findIndex(image => image === link);
        newImages.splice(index, 1);
        setImages(newImages);
        setIsDeleting(false);
    }

    return (
        <form onSubmit={saveProduct} className="flex-col w-screen px-8">
            <label>Product Name</label>
            <input type="text" placeholder="Product Name" className="flex w-1/2 my-2" value={title} onChange={ev => setTitle(ev.target.value)} />
            <label>Description</label>
            <textarea placeholder="Description" className="flex w-1/2 my-2" value={desc} onChange={ev => setDesc(ev.target.value)}></textarea>
            <label>Images</label>
            <div className="flex flex-wrap w-full">
                <div className="flex mr-4 my-2">
                    <label className="flex cursor-pointer font-normal w-32 h-32 text-[#e8cabc] rounded-lg outline-dashed outline-2 outline-[#e8cabc] items-center justify-center hover:outline-[#f8ddbd] hover:text-[#f8ddbd] duration-100 ease-in-out">
                        <p className="mr-1">Upload</p>
                        <MdOutlineFileUpload className="text-xl" />
                        <input type="file" className="hidden" onChange={uploadImages}></input>
                    </label>
                </div>
                {isUploading && (
                    <div className="flex w-32 h-32 justify-center items-center">
                        <p className="">
                            <PulseLoader size={10} color={"#f8ddbd"} speedMultiplier={2} />
                        </p>
                    </div>
                )}
                <ReactSortable className="my-2 flex flex-wrap gap-4" list={images} setList={updateImagesOrder}>
                    {!!images?.length && images.map(link => (
                        <div key={link} className="w-32 h-32 hover:scale-[101%] duration-100 ease-in-out cursor-pointer">
                            <div className="relative w-full h-full">
                                <img
                                    src={link}
                                    className="object-cover w-full h-full rounded-lg "
                                    alt="Product image."
                                />
                                {isDeleting && (
                                    <PulseLoader size={10} color={"#f8ddbd"} speedMultiplier={2} className="absolute top-1/2 right-12 z-20" />
                                )}
                                <RiDeleteBin6Line onClick={() => deleteImage({ link }, index)} className="text-[#FFFED3] absolute top-0 right-0 m-2 z-10" />
                            </div>
                        </div>
                    ))}
                </ReactSortable>
            </div>
            <label>Price (in SGD)</label>
            <input type="number" min="0.00" step="0.01" placeholder="Price" className="flex w-1/2 my-2" value={price} onChange={ev => setPrice(ev.target.value)} />
            <button type="submit" className="button-1 flex">Save</button>
        </form>
    );
}