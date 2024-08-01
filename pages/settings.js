import Layout from "@/components/layout/Layout";
import axios from "axios";
import Head from "next/head";
import { useEffect, useState } from "react";
import { IoPersonAddSharp } from "react-icons/io5";
import { IoPersonRemoveSharp } from "react-icons/io5";

export default function Settings() {
    const [whitelistedEmail, setWhitelistedEmail] = useState('');
    const [whitelistedEmails, setWhitelistedEmails] = useState([]);

    useEffect(() => {
        fetchWhitelistedEmails();
    }, []);

    function fetchWhitelistedEmails() {
        axios.get('/api/whitelistedemails').then(response => {
            setWhitelistedEmails(response.data);
        });
    }

    async function doWhitelist(ev) {
        ev.preventDefault();
        const data = { whitelistedEmail };
        if(data?.whitelistedEmail){
            await axios.post('/api/whitelistedemails', data);
            setWhitelistedEmail('');
            fetchWhitelistedEmails();
        } else{
            throw 'No email submitted.';
        }
        
    }
    
    async function removeWhitelistedEmail(indexToRemove){
        const { _id } = whitelistedEmails[indexToRemove];
        await axios.delete('/api/whitelistedemails?_id=' + _id);
        fetchWhitelistedEmails();
    }

    return (
        <Layout>
            <Head>
                <title>Crochets | Home</title>
                <meta name="description" content="Admin settings page for Crochet E-Commerce." />
            </Head>
            <div>
                <form className="flex flex-col" onSubmit={doWhitelist}>
                    <label>Whitelist Email</label>
                    <div className="flex flex-row my-2">
                        <input type="email" placeholder="Email" value={whitelistedEmail} onChange={ev => setWhitelistedEmail(ev.target.value)} />
                        <button type="submit" className="button-1 mx-2 items-center" >
                            <IoPersonAddSharp className="mr-2"/>
                            Add Admin
                        </button>
                    </div>
                    <div className="grid grid-cols-1 bg-[#FFE9D0] md:w-1/2 py-2 px-4 rounded-lg">
                        {whitelistedEmails.map((email, index) => (
                            <div className="w-full bg-[#FFFED3] px-4 py-2 rounded-lg my-2 text-[#f2bd81] flex-row flex items-center justify-between">
                                <div className="p-2">
                                <p className="text-[#87d4f8] font-bold">APPROVED ADMIN</p>
                                "{email.whitelistedEmail}"
                                </div>
                                <button className="button-2" type="button" onClick={() => removeWhitelistedEmail(index)}>
                                    <IoPersonRemoveSharp />
                                </button>
                            </div>
                        ))}
                    </div>
                </form>
            </div>
        </Layout>
    );
}