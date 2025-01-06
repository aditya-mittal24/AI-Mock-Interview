"use client"
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

function Header() {
    const path=usePathname();
    useEffect(()=>{
        console.log(path)
    },[]);
  return (
    <div className="flex py-4 px-6 items-center justify-between bg-secondary shadow-sm">
      <Image src={"/logo.svg"} width={80} height={40} alt="logo" />
      <ul className="hidden md:flex gap-6">
        <li className={`hover:text-violet-700 transition-all cursor-pointer ${path=='/dashboard'&&'text-violet-700'}`}>Dashboard</li>
        <li className={`hover:text-violet-700 transition-all cursor-pointer ${path=='/upgrade'&&'text-violet-700'}`}>Upgrade</li>
        <li className={`hover:text-violet-700 transition-all cursor-pointer ${path=='/questions'&&'text-violet-700'}`}>Questions</li>
        <li className={`hover:text-violet-700 transition-all cursor-pointer ${path=='/working'&&'text-violet-700'}`}>How it works?</li>
      </ul>
      <UserButton />
    </div>
  );
}

export default Header;
