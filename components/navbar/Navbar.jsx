import React, { useState } from 'react';
import Link from 'next/link'
import { useSession, signOut } from "next-auth/react"
import { useRouter } from 'next/router';
import { MdOutlineDashboard, MdOutlineLocalShipping, MdOutlineShoppingBag, MdOutlineEdit, MdOutlineSettings } from "react-icons/md";
import { FaChevronRight } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa";

const Navbar = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const iconsStyle = 'mx-4 hover:text-[#ffa7a7] ease-in-out duration-100';
    const [sideMenuOpened, setSideMenuOpened] = useState(false);
    const { pathname } = router;
    const linkPositions = {
        '/orders': 'top-12',
        '/products': 'top-24',
        '/categories': 'top-36',
        '/settings': 'top-48'
    };
    const links = [
        {
            name: "Dashboard",
            main: "/",
            icon: MdOutlineDashboard,
            addLinks: [
                { name: "Overall Revenue", link: "/" },
                { name: "Performance", link: "/" },
                { name: "Conversion Rate", link: "/" }
            ]
        },
        {
            name: "Orders",
            main: "/orders",
            icon: MdOutlineLocalShipping,
            addLinks: [
                { name: "Order Status", link: "/" },
                { name: "Returns & Refunds", link: "/" }
            ]
        },
        {
            name: "Products",
            main: "/products",
            icon: MdOutlineShoppingBag,
            addLinks: [
                { name: "Add Product", link: "/products/new" },
                { name: "Inventory Levels", link: "/" }
            ]
        },
        {
            name: "Categories",
            main: "/categories",
            icon: MdOutlineEdit,
            addLinks: [
                { name: "Popular Categories", link: "/" }
            ]
        },
        {
            name: "Settings",
            main: "/settings",
            icon: MdOutlineSettings,
            addLinks: [
                { name: "Profile", link: "/" },
                { name: "Admin Settings", link: "/" }
            ]
        }
    ];


    async function logout() {
        await router.push('/');
        await signOut();
    }

    const getPositionMain = () => {
        const keys = Object.keys(linkPositions);
        for (const key of keys) {
            if (pathname === '/') {
                return '0';
            } else if (pathname.includes(key)) {
                return linkPositions[key];
            }
        }

    };

    function handleSideMenu() {
        setSideMenuOpened(!sideMenuOpened);
    }

    return (
        <div>
            <div>

            </div>
            <div className={sideMenuOpened ? 'flex w-[24vw] bg-[#fbf2eb] shadow-lg shadow-black/20' : 'hidden md:flex'}>
                <div className='flex flex-col justify-between items-center bg-[#160907] h-screen py-3 text-[#FFC5C5] z-20'>
                    <div className='flex flex-row w-full'>
                        <div className='flex flex-col w-full mt-24 z-10 items-center'>
                            {links.map(link => (
                                <Link href={link.main} className="navbar-link">
                                    {<link.icon size={20} className={iconsStyle} />}
                                </Link>
                            ))}
                        </div>
                        <div className='relative mt-24 z-20'>
                            <div className={`absolute h-12 px-[1.5px] ${getPositionMain()} transition ease-in-out duration-500`}>
                                <div className='bg-[#FFC5C5] px-[1.5px] mr-[3px] h-9 rounded-full absolute top-[6px] right-0' />
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col '>
                        <div className={sideMenuOpened ? "hidden" : "cursor-pointer relative justify-center w-full h-8 rounded-full mb-3 items-center group"} onClick={() => handleSideMenu()}>
                            <FaChevronRight size={16} className="absolute z-20 left-[8px] top-[12px] group-hover:text-black" />
                            <div className="absolute left-[-4px] top-0 w-32 py-[10px] pl-4 text-[#28120e] bg-[#fbf2eb] shadow-sm rounded-full text-center hidden group-hover:block group-hover:text-black">
                                Expand
                            </div>
                        </div>
                        <div onClick={() => logout()} className='relative rounded-full w-8 h-8 mb-2 group cursor-pointer'>
                            <img
                                src={session?.user?.image}
                                alt="User Avatar"
                                className="object-cover w-full h-full rounded-full absolute right-[-5px] z-20 m-1"
                            />
                            <div className='hidden group-hover:block absolute text-[#28120e] bg-[#fbf2eb] shadow-sm shadow-[#28120e]/20 rounded-full top-0 h-10 left-[-4px] w-32 z-0  text-center justify-center py-[10px] pl-4'>
                                Log Out
                            </div>
                        </div>
                    </div>
                </div>
                <div className={sideMenuOpened ? 'px-8 py-16 transition flex flex-col justify-between w-full overflow-hidden' : 'hidden'}>
                    <div className='flex flex-col'>
                        <h1 className=' mb-2'>Admin</h1>
                        <div className={`absolute h-5 px-[1px] top-0 z-20`}>
                            <div className='bg-[#FFC5C5] px-[1px] h-4 rounded-full absolute right-0 top-[132px]' />
                        </div>
                        {links.map((link) => (
                            <div key={link.name}>
                                <Link href={link.main} className="sidemenu-link">{link.name}</Link>
                                {link.addLinks && (
                                    <div className="flex flex-row gap-2 my-4">
                                        <div className="relative px-[1px] bg-[#f7e2e2] rounded-full" />
                                        <div className="flex flex-col px-2 justify-center align-middle gap-2">
                                            {link.addLinks.map((subLink) => (
                                                <Link key={subLink.name} href={subLink.link} className="flex text-xs">
                                                    {subLink.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className='p-8'>
                        <div className='flex flex-row justify-center py-2 rounded-full overflow-hidden items-center bg-[#FFC5C5] group-hover:bg-[#f9baba] ease-in-out duration-200 w-full hover:scale-[101.5%] cursor-pointer group' onClick={() => handleSideMenu()}>
                            <FaChevronLeft className='mr-4' />
                            Collapse
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar