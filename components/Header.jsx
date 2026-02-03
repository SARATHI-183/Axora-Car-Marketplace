
import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from '@clerk/nextjs';
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button';
import { ArrowLeft, CarFront, Heart, Layout } from 'lucide-react';
import { checkUser } from '@/lib/checkUser';

const Header = async({ isAdminPage=false }) => {
  const user = await checkUser();
  
  const isAdmin = user?.role === "ADMIN";

  return (
    <header className='fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b'>
      <nav className='mx-auto px-4 py-4 flex items-center justify-between'>
        <Link href={isAdmin ? "/admin" : "/"} className='flex'>
          <Image 
            src={"/logo.png"}
            alt="Axora Logo"
            height={60}
            width={200}
            className="h-12 w-auto object-contain"
          />

          {isAdminPage && (
            <span className='text-xs font-extralight'>Admin</span>
          )}
        </Link>

        <div className='flex items-center space-x-4'>
          {isAdminPage ? 
            <>
              <Link href="/" className='text-gray-600 hover:text-blue-600 flex items-center gap-2'>
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft size={18}/>
                  <span >back to Home</span>
                </Button>
              </Link>
            </> :
           (<SignedIn>
              <Link href={"/saved-cars"}>
                <Button>
                  <Heart size={18}/>
                  <span className="hidden md:inline">Saved Cars</span>
                </Button>
              </Link>

              {!isAdmin ? (
                <Link href={"/reservation"}
                className='text-gray-600 hover:text-blue-600 flex items-center gap-2'
                >
                  <Button variant="outline">
                    <CarFront size={18}/>
                    <span className="hidden md:inline">My Reservations</span>
                  </Button>
              </Link>
              ) : (
                <Link href={"/admin"}
                  className='text-gray-600 hover:text-blue-600 flex items-center gap-2'
                >
                  <Button variant="outline">
                    <Layout size={18}/>
                    <span className="hidden md:inline">Admin Portal</span>
                  </Button>
                </Link>
              )}
            </SignedIn>
          )}

          <SignedOut>
            <SignInButton forceRedirectUrl='/'>
              <Button variant="outline">Login</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  )
}

export default Header