import React, { useState } from "react";
import Head from "next/head";
import Layout from "@/components/layout";
import Link from "next/link";
import { parseISO, format } from "date-fns";
import { GetStaticProps } from "next";
import { useQuery } from "@tanstack/react-query";

import { BaseJipData, getAllJipsPreambleData, getJipData } from "@/lib/jips";
import { getOwnersFromPreamble, PIONEER_MEMBER_LINK } from "@/lib/joystream";
import { JipId, saveJipToIndex } from "@/lib/files";
import index from "@/lib/index";

import styles from "@/styles/index.module.css";

export const getStaticProps: GetStaticProps = async () => {
  const jipsPreambleData = getAllJipsPreambleData();

  // TODO: Huh?
  const owners = await getOwnersFromPreamble(jipsPreambleData[0].preamble);

  for(const { jipId } of jipsPreambleData) {
    const jipData = await getJipData(jipId);

    index.add(jipId, jipData.rawContent);
  }

  index.export((key: string, data: string) => {
    // console.log(key, data);
    saveJipToIndex(key, data);
  });

  const props = JSON.parse(
    JSON.stringify({
      jipsPreambleData,
      owners
    })
  );

  return { props };
};

const JipItem = ({
  jipId,
  title,
  date,
  stage,
  owners
}: {
  jipId: JipId;
  title: string;
  date: string;
  stage: string;
  owners: Array<[number, string]>;
}) => (
  <div className={styles.jip}>
    <Link className={styles.jipTitle} href={`/${jipId}`}>
      {jipId}: {title}
    </Link>
    <div className={styles.info}>
      <time dateTime={date}>{format(parseISO(date), "LLLL d, yyyy")} </time> ~ Stage: {stage} ~
      Owners:{" "}
      {owners.map<React.ReactNode>(([joystreamId, handle], index) => (
        <React.Fragment key={joystreamId}>
          {index > 0 ? ", " : null}
          <a href={PIONEER_MEMBER_LINK(`${joystreamId}`)} target="_blank">
            {handle}
          </a>
        </React.Fragment>
      ))}
    </div>
  </div>
);

export default function Home({
  jipsPreambleData,
  owners
}: {
  jipsPreambleData: Array<BaseJipData>;
  owners: Array<[number, string]>;
}) {
  const [searchQuery, setSearchQuery] = useState("snorlax");
  const { isLoading, error, data } = useQuery({ queryKey: ['searchQuery', searchQuery], queryFn: async () => { 
    const res = await fetch(`api/search?searchQuery=${searchQuery}`);
    return res.json();
   }});

  if(!isLoading && !error) {
    console.log(data);
  }

  return (
    <Layout>
      <Head>
        <title>Joystream Improvement Proposal Portal</title>
        <meta
          name="description"
          content="Discover and consume JIP documents with ease using the JIP Document Portal."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <section className={styles.landing}>
      <input style={{ margin: "20px auto -20px", width: "350px", height: "30px"}} type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <div className={styles.jips}>
          {jipsPreambleData.map(({ jipId, preamble: { created: date, title, stage } }) => (
            <JipItem
              key={jipId}
              jipId={jipId}
              date={date}
              title={title}
              stage={stage}
              owners={owners}
            />
          ))}
        </div>
      </section>
    </Layout>
  );
}
