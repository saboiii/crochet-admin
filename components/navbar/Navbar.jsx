import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router';

const Navbar = () => {
    const inactiveLink = 'mx-2 mt-2 p-2';
    const activeLink = inactiveLink+' bg-[#FEFBD8] text-black rounded-t-xl';
    const router = useRouter();
    const {pathname} = router;
    return (
        <div className='flex bg-[#B1AFFF] text-white w-screen'>
            <div className='flex justify-between items-center h-full w-full'>
                <div>
                    <ul className='hidden md:flex'>
                        <Link href='/'>
                            <li className={pathname === '/' ? activeLink : inactiveLink}>Dashboard</li>
                        </Link>
                        <Link href='/orders'>
                            <li className={pathname.includes('/orders') ? activeLink : inactiveLink}>Orders</li>
                        </Link>
                        <Link href='/products'>
                            <li className={pathname.includes('/products') ? activeLink : inactiveLink}>Products</li>
                        </Link>
                        <Link href='/settings'>
                            <li className={pathname.includes('/settings') ? activeLink : inactiveLink}>Settings</li>
                        </Link>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Navbar