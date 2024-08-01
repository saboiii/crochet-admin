import Layout from "@/components/layout/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { withSwal } from 'react-sweetalert2';
import { ImCross } from "react-icons/im";
import Head from "next/head";

function Categories({ swal }) {
    const [name, setName] = useState('');
    const [category, setCategory] = useState([]);
    const [editedCategory, setEditedCategory] = useState(null);
    const [parentCategory, setParentCategory] = useState('');
    const [properties, setProperties] = useState([]);
    const itemStyle = 'bg-[#FFE9D0] rounded-xl flex-col p-2 overflow-hidden h-full justify-between flex outline-dashed outline-[#f5cda0] outline-2';

    useEffect(() => {
        fetchCategories();
    }, []);

    function fetchCategories() {
        axios.get('/api/categories').then(response => {
            setCategory(response.data);
        });
    }
    async function saveCategory(ev) {
        ev.preventDefault();
        const data = {
            name,
            parentCategory,
            properties: properties.map(p => ({
                name: p.name,
                values: p.values.split(','),
            })),
        };
        if (editedCategory) {
            data._id = editedCategory._id;
            await axios.put('/api/categories', data);
            setEditedCategory(null);
        } else {
            await axios.post('/api/categories', data);
        }
        setName('');
        setParentCategory('');
        setProperties('');
        fetchCategories();
    }

    function editCategory(category) {
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
        setProperties(category.properties.map(({ name, values }) => ({
            name,
            values: values.join(','),
        })));
    }

    function deleteCategory(category) {
        swal.fire({
            title: `<h1 class="text-xl">Delete ${category.name}</h1>`,
            html: `
                <p class="text-base">Are you sure you want to delete this?</p>
            `,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, delete this.',
            confirmButtonColor: '#EE4E4E',
            padding: "2em",
        }).then(async result => {
            if (result.isConfirmed) {
                const { _id } = category;
                await axios.delete('/api/categories?_id=' + _id);
                fetchCategories();
            }
        });
    }

    function addProperty() {
        setProperties(prev => {
            return [...prev, { name: '', values: '' }];
        });
    }

    function handlePropertyNameChange(index, property, newName) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties;
        });
    }

    function handlePropertyValuesChange(index, property, newValues) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].values = newValues;
            return properties;
        });
    }

    function removeProperty(indexToRemove) {
        setProperties(prev => {
            return [...prev].filter((p, pIndex) => {
                return pIndex !== indexToRemove;
            });
        });
    }

    return (
        <Layout>
            <Head>
                <title>Crochets | Categories</title>
                <meta name="description" content="Admin categories page for Crochet E-Commerce." />
            </Head>
            <div className="mx-8">
                <h1 className="my-2 flex">Categories</h1>
                <form onSubmit={saveCategory} className="flex flex-col gap-1 bg-[#d1cff0] p-4 mb-4 rounded-lg">
                    <label>{editedCategory ? `Edit Category "${editedCategory.name}"` : 'Create Category'}</label>
                    <div className="flex flex-col md:flex-row">
                        <input type="text" placeholder={'Category Name'} className="h-9 my-2" value={name} onChange={ev => setName(ev.target.value)} />
                        <select onChange={ev => setParentCategory(ev.target.value)} value={parentCategory} className="h-9 my-2">
                            <option value="">No parent category.</option>
                            {category.length > 0 && category.map(category => (
                                <option key={category._id} value={category._id}>{
                                    category.name
                                }</option>
                            ))}
                        </select>
                        <button type='button' onClick={addProperty} className="button-1 justify-center h-full mt-2 md:mr-2">Add New Property</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:mb-2">
                        {properties.length > 0 && properties.map((property, index) => (
                            <div className="bg-[#B1AFFF] p-4 flex flex-wrap gap-2 rounded-lg overflow-hidden">
                                <div className="flex pb-2 w-full justify-end">
                                    <ImCross type="button" onClick={() => removeProperty(index)} className="text-[#6462b4] hover:scale-110 duration-100 ease-in-out" size={8} />
                                </div>
                                <input type="text" value={property.name} onChange={ev => handlePropertyNameChange(index, property, ev.target.value)} placeholder="Property Name (Ex: Color)" className="w-full" />
                                <input type="text" value={property.values} onChange={ev => handlePropertyValuesChange(index, property, ev.target.value)} placeholder="Values (Separated by commas)" className="w-full" />
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col md:flex-row gap-2">
                        {editedCategory && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditedCategory(null);
                                    setName('');
                                    setParentCategory('');
                                    setProperties([]);
                                }}
                                className="button-1 md:w-20 justify-center">Cancel</button>
                        )}
                        <button type="submit" className="button-1 md:w-20 justify-center">Save</button>
                    </div>
                </form>

                {!editedCategory && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 z-10 w-full">
                        {category.length > 0 && category.map(category => (
                            <div key={category._id}>
                                <div className={itemStyle}>
                                    <div className="flex-row flex justify-between mx-4 my-2">
                                        <p>{category.name}</p>
                                        <div className="parentCategory">{category.parent?.name}</div>
                                    </div>
                                    <div className="mx-4">
                                        <button onClick={() => editCategory(category)} className="button-2 w-full">
                                            Edit
                                        </button>
                                        <button onClick={() => deleteCategory(category)} className="button-3 w-full">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}


            </div>
        </Layout>
    )
}

export default withSwal(({ swal }, ref) => (
    <Categories swal={swal} />
))