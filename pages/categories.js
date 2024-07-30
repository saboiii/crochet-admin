import Layout from "@/components/layout/Layout";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Categories() {
    const [name, setName] = useState('');
    const [category, setCategory] = useState([]);
    const itemStyle = 'bg-[#FFE9D0] rounded-xl flex-col p-2';


    function fetchCategories() {
        axios.get('/api/categories').then(response => {
            setCategory(response.data);
        });
    }
    
    useEffect(() => {
        fetchCategories();
    }, []);

    async function saveCategory(ev) {
        ev.preventDefault();
        await axios.post('/api/categories', { name });
        setName('');
        fetchCategories();
    }


    return (
        <Layout>
            <div className="mx-8">
                <h1 className="my-2 flex">Categories</h1>
                <form onSubmit={saveCategory} className="flex gap-1 items-center">
                    <input type="text" placeholder={'Category Name'} className="h-9" value={name} onChange={ev => setName(ev.target.value)} />
                    <select>
                        <option value="0">No parent category.</option>
                    </select>
                    <button tupe="submit" className="button-1">Save</button>
                </form>
                <div className="grid grid-cols-3 gap-3 z-10 w-full">
                    {category.length > 0 && category.map(category => (
                        <tr key={category._id}>
                            <div className={itemStyle}>
                                <p className="mx-4 my-2">{category.name}</p>
                            </div>
                        </tr>
                    ))}
                </div>
            </div>
        </Layout>
    )
}