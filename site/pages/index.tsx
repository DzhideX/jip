import React from "react";
import Head from "next/head";
import Layout from "@/components/layout";
import Link from "next/link";
import { parseISO, format } from "date-fns";
import { GetStaticProps } from "next";

import { BaseJipData, getAllJipsPreambleData, getJipData } from "@/lib/jips";
import { getOwnersFromPreamble, PIONEER_MEMBER_LINK } from "@/lib/joystream";
import { JipId, saveJipToIndex } from "@/lib/files";
import index from "@/lib/index";

import styles from "@/styles/index.module.css";

export const getStaticProps: GetStaticProps = async () => {
  const jipsPreambleData = getAllJipsPreambleData();

  // TODO: Does this make sense?
  const owners = await getOwnersFromPreamble(jipsPreambleData[0].preamble);

  for(const { jipId } of jipsPreambleData) {
    const jipData = await getJipData(jipId);

    index.add(jipId, jipData.rawContent);
  }

  index.export((key: string, data: string) => {
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
