"use client";
import React from "react";
import {
  IconHome,
  IconCode,
  IconTarget,
} from "@tabler/icons-react";
import { FloatingNav } from "./ui/floating-navbar";
import { useAuth } from "@/lib/authContext";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/config";

export function Navbar() {
  const { user } = useAuth();

  const handleSignInOut = async () => {
    if (user) {
      await signOut(auth);
    } else {
      window.location.href = "/signup";
    }
  };

  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <IconHome className="h-5 w-5 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Problems",
      link: "/problems",
      icon: <IconTarget className="h-5 w-5 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Code-IDE",
      link: "/code-ide",
      icon: <IconCode className="h-5 w-5 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Notes",
      link: "/notes",
      icon: <IconCode className="h-5 w-5 text-neutral-500 dark:text-white" />,
    },
  ];

  return (
    <FloatingNav
      navItems={navItems}
      isLoggedIn={!!user}
      onSignInOut={handleSignInOut}
    />
  );
}