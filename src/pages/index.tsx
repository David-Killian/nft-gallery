import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { time } from 'console'

const inter = Inter({ subsets: ['latin'] })

export default function Home(props: any) {
  return (
    <>
      <Head>
        <title>My Gallery</title>
        <meta name="description" content="My gallery" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <p className={inter.className}>{props.address}</p>
        <br />
        <div style={({ display: "flex", flexWrap:"wrap", gap: "20px"})}>
        {props.data.map((item: any) => {
          return (
            <div>
              

              <img src={item.node?.images[3]?.url} width={200} height={200} alt="imgs" />
              <img src={`https://ipfs.io/ipfs/${item.node?.metadata?.image?.url?.split('ipfs://')[1]}`} width={200} height={200} alt="imgs" />
              <p>{item.node.tokenId}</p>
              <p>{item.node.contract.name}</p>
              
            </div>
        );
        })}
        </div>
      </main>
    </>
  )
}

export async function getServerSideProps(context: any) {
  const address = context.query["address"];

  const myQuery = JSON.stringify({
    query: `query WalletTokens($address: String, $after: String, $first: Int) {
  wallet(address: $address) {
    tokens(after: $after, first: $first) {
      edges {
        node {
          tokenId
          contract{
            ... on ERC721Contract {
              symbol
              name
            }
          }
          images {
            url
          }
          ... on ERC721Token {
            metadata {
              image
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
}`,
    variables: {
      address: address,
      after: null,
      first: 10
    },
  });

  const res = await fetch("https://graphql.icy.tools/graphql", {
    method: "POST",
    body: myQuery,
    headers: {
      "x-api-key": process.env.API_KEY ?? "",
      "content-type": "application/json",
    },
  }).then((response) => response.json());

  const data = await res;

  console.log(data);

  console.log(address);
  return {
    props: {
      address,
      data: data.data.wallet.tokens.edges,
    },
  };
}
