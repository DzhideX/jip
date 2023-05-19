import Head from "next/head";
import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { useDebounce } from "@/util/useDebounce";

import styles from "@/styles/layout.module.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce<React.ChangeEvent<HTMLInputElement>>((e) => setSearchQuery(e.target.value), 400);

  const { isLoading, error, data } = useQuery({ queryKey: ['searchQuery', searchQuery], queryFn: async () => {
    const res = await fetch(`api/search?searchQuery=${searchQuery}`);
    return res.json();
   }});

  if(!isLoading && !error && data) {
    console.log(data);
  }

  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/joystream-icon.png" />
        <meta name="og:title" content="Joystream Improvement Proposal Portal" />
      </Head>
      <header className={styles.header}>
        <Link href="/" className={styles.heading}>
          Joystream Improvement Proposal Portal
        </Link>
        <input type="text" className={styles.input} onChange={debouncedSearch} placeholder="Search.." />
      </header>
      <main>{children}</main>
    </div>
  );
}
