"use client";
import React, { useState } from "react";
import {
  IconHome,
  IconCode,
  IconTarget,
} from "@tabler/icons-react";
import { FloatingNav } from "./ui/floating-navbar";

export function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleSignInOut = () => {
    setIsLoggedIn(!isLoggedIn);
    if (!isLoggedIn) {
      console.log("User signed in");
    } else {
      console.log("User signed out");
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
  ];

  return (
    <FloatingNav
      navItems={navItems}
      isLoggedIn={isLoggedIn}
      onSignInOut={handleSignInOut}
    />
  );
}