import React from 'react'
import Link from 'next/link'
import { signOut } from "next-auth/react"
import { useRouter } from 'next/router';

const Navbar = () => {
    const inactiveLink = 'mx-2 mt-2 p-2';
    const activeLink = inactiveLink+' bg-[#FEFBD8] rounded-t-xl';
    const router = useRouter();
    const {pathname} = router;
    return (
        <div className='bg-[#B1AFFF] w-screen'>
            <div className='flex justify-between items-center mx-2'>
                <div className='flex'>
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
                        <Link href='/categories'>
                            <li className={pathname.includes('/categories') ? activeLink : inactiveLink}>Categories</li>
                        </Link>
                        <Link href='/settings'>
                            <li className={pathname.includes('/settings') ? activeLink : inactiveLink}>Settings</li>
                        </Link>
                    </ul>
                </div>
                <button onClick={() => signOut()} className="flex p-2 mx-2">Log Out</button>
            </div>
        </div>
    )
}

export default Navbar