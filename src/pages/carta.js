import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <style>{`
          html, body, #__next, #__next > div {
            height: 100%;
            margin: 0;
            padding: 0;
          }
        `}</style>
      </Head>
      <iframe
        src="https://drive.google.com/file/d/1egH1yiBLTdfICeCMP_Zr5qJ5H-kQjKHI/preview"
        width="100%"
        height="100%"
        title="Makeba Ticket"
        style={{border: "none"}}
      />
    </>
  );
}