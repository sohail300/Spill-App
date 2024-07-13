"use client";

import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();

  let user = null;

  if (session !== null) {
    user = session?.user;
  }

  console.log(session);

  async function handleLogout() {
    const response = await signOut();
    console.log(response);
  }

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white fixed top-0 w-full z-10">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <div className="flex justify-between items-center w-full sm:w-auto mb-4 sm:mb-0">
          <Link href="/" className="text-2xl md:text-3xl font-bold">
            Spill
          </Link>
          {user && <span className="text-sm sm:hidden">Hey, {user.name}</span>}
        </div>

        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          {user ? (
            <>
              <span className="hidden sm:inline text-sm">Hey, {user.name}</span>
              <Button
                onClick={() => handleLogout()}
                className="w-full sm:w-auto bg-slate-100 text-black"
                variant="outline"
              >
                Sign out
              </Button>
            </>
          ) : (
            <Link href="/signin" className="w-full sm:w-auto">
              <Button
                className="w-full bg-slate-100 text-black"
                variant="outline"
              >
                Sign in
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
