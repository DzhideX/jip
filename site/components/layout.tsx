import Head from "next/head";
import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { useDebounce } from "@/util/useDebounce";
import { JipId } from "@/lib/files";

import styles from "@/styles/layout.module.css";

const SearchDropdown = ({ jipIds, clearSearch }: { jipIds: Array<JipId>, clearSearch: () => void }) => (
  <div className={styles.searchDropdown}>
    {jipIds.map((jipId) => <Link href={`/${jipId}`} key={jipId} onClick={() => clearSearch()}><div className={styles.searchDropdownItem} >{jipId}</div></Link>)}
  </div>
)

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce<React.ChangeEvent<HTMLInputElement>>((e) => setSearchQuery(e.target.value), 400);

  const { isLoading, error, data } = useQuery<{ results: Array<JipId> }>({ queryKey: ['searchQuery', searchQuery], queryFn: async () => {
    const res = await fetch(`api/search?searchQuery=${searchQuery}`);
    return res.json();
   }});

  return (
    <div className={styles.searchWrapper}>
      <input type="text" className={styles.search} onChange={debouncedSearch} placeholder="Search.." />
      {/* {isLoading && <div>Loading...</div>} */}
      {!isLoading && !error && data?.results && data.results.length > 0 && <SearchDropdown jipIds={data.results} clearSearch={() => setSearchQuery("")} />}
    </div>
  )
}

export default function Layout({ children }: { children: React.ReactNode }) {

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
        <Search />
      </header>
      <main>{children}</main>
    </div>
  );
}
