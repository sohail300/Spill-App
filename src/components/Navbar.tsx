"use client";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { data: session } = useSession();

  const user: User = session?.user;

  const router = useRouter();

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link href="#" className="text-3xl font-bold mb-4 md:mb-0">
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
          <>
            <Button
              className="w-full md:w-auto bg-slate-100 text-black"
              variant="outline"
              onClick={() => router.push("/signin")}
            >
              Sign in
            </Button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
