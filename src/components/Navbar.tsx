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

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white fixed top-0 w-full ">
      <div className="container mx-auto flex flex-row justify-between items-center">
        <Link href="/" className="text-3xl font-bold">
          Spill
        </Link>

        {user ? (
          <>
            <span>Hey, {user.name}</span>
            <Button
              onClick={() => signOut()}
              className="w-full md:w-auto bg-slate-100 text-black"
              variant="outline"
            >
              Sign out
            </Button>
          </>
        ) : (
          <Link href={"/signin"}>
            <Button
              className="w-full md:w-auto bg-slate-100 text-black"
              variant="outline"
            >
              Sign in
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
