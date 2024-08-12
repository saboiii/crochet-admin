import { useEffect, useState } from "react";
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
    category: existingCategory,
    properties: existingProperties,
}) {
    const [title, setTitle] = useState(existingTitle || '');
    const [desc, setDesc] = useState(existingDesc || '');
    const [price, setPrice] = useState(existingPrice || '');
    const [images, setImages] = useState(existingImages || []);
    const [goToProducts, setGoToProducts] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState(existingCategory || '');
    const [productProperties, setProductProperties] = useState(existingProperties || {});
    const router = useRouter();
    let index = -1;

    useEffect(() => {
        axios.get("/api/categories").then(result => {
            setCategories(result.data);
        })
    }, []);

    async function saveProduct(ev) {
        ev.preventDefault();
        const data = { title, desc, price, images, category, properties: productProperties }
        if (_id) {
            await axios.put('/api/products', { ...data, _id });
        } else {
            await axios.post('/api/products', data);
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

    const propertiesToFill = [];
    if (categories.length > 0 && category) {
        let catInfo = categories.find(({ _id }) => _id === category);
        propertiesToFill.push(...catInfo.properties);
        while (catInfo?.parent?._id) {
            const parentCat = categories.find(({ _id }) => _id === catInfo.parent?._id);
            propertiesToFill.push(...parentCat.properties);
            catInfo = parentCat;
        }
    }

    function setProductProp(propName, value){
        setProductProperties(prev => {
            const newProductProps = {...prev};
            newProductProps[propName] = value;
            return newProductProps;
        });
    }

    return (
        <form onSubmit={saveProduct} className="flex-col w-[50vw] px-8">
            <label>Product Name</label>
            <input type="text" placeholder="Product Name" className="flex w-full my-2" value={title} onChange={ev => setTitle(ev.target.value)} />
            <label>Category</label>
            <select className="flex h-9 my-2 ml-0" value={category} onChange={ev => setCategory(ev.target.value)}>
                <option value="">No category selected.</option>
                {categories.length > 0 && categories.map(cat => (
                    <option value={cat._id}>{cat.name}</option>
                ))}
            </select>
            {propertiesToFill.length > 0 ? (<div className="bg-[#d1cff0] p-2 rounded-lg my-2 flex flex-wrap gap-2 justify-center w-full">
                {propertiesToFill.map(p => (
                    <div className="flex flex-row bg-[#B1AFFF] outline-[#8c89d0] outline-dashed p-2 rounded-lg">
                        <div className="bg-[#FFFED3] text-[#979778] p-2 rounded-lg flex">
                            {p.name}
                        </div>
                        <select className="ml-2 mr-0" value={productProperties[p.name]} onChange={ev => setProductProp(p.name, ev.target.value)}>
                            {p.values.map(v => (
                                <option value={v}>{v}</option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>):null}
            <label>Description</label>
            <textarea placeholder="Description" className="flex w-full my-2" value={desc} onChange={ev => setDesc(ev.target.value)}></textarea>
            <label>Images</label>
            <div className="flex flex-wrap w-full">
                <div className="flex mr-4 my-2">
                    <label className="flex cursor-pointer font-normal w-28 h-28 text-[#e8cabc] rounded-lg outline-dashed outline-2 outline-[#e8cabc] items-center justify-center hover:outline-[#f8ddbd] hover:text-[#f8ddbd] duration-100 ease-in-out">
                        <p className="mr-1">Upload</p>
                        <MdOutlineFileUpload className="text-xl" />
                        <input type="file" className="hidden" onChange={uploadImages}></input>
                    </label>
                </div>
                {isUploading && (
                    <div className="flex w-28 h-28 justify-center items-center">
                        <p>
                            <PulseLoader size={10} color={"#f8ddbd"} speedMultiplier={2} />
                        </p>
                    </div>
                )}
                <ReactSortable className="my-2 flex flex-wrap gap-4" list={images} setList={updateImagesOrder}>
                    {!!images?.length && images.map(link => (
                        <div key={link} className="w-28 h-28 hover:scale-[101%] duration-100 ease-in-out cursor-pointer">
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
            <button type="submit" className="button-1 flex my-2">Save</button>
        </form>
    );
}