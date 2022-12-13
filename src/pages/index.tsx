import {
  useAccount,
  useDisconnect,
  useNetwork,
  useEnsName,
  useEnsResolver,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import Link from "next/link";
import { hash } from 'eth-ens-namehash'
import { Toaster } from 'react-hot-toast'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { FormEvent, useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import Head from 'next/head'
import useWindowSize from 'react-use/lib/useWindowSize'

import { ENS_RESOLVER_ABI, getEtherscanUrl } from '../utils/contract'
import Button from '../components/Button'
import Hero from '../components/Hero'
import Layout from '../components/Layout'
import Modal from '../components/Modal'
import useNfts from '../hooks/useNfts'
import { ArrowIcon, ErrorIcon } from '../assets/icons'
import { isTwitterUsernameValid } from '../utils/helpers'
import { TwitterPreview } from '../components/TwitterPreview';
import { ethers } from "ethers";
import React from 'react';


const url = `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`;
const provider = new ethers.providers.JsonRpcProvider(url);

export default function Home() {
  const { chain } = useNetwork()
  const { address } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { ensNames, isLoading, isError } = useNfts(address, chain)
  const { width: windowWidth, height: windowHeight } = useWindowSize()
  const [isHelperModalOpen, setIsHelperModalOpen] = useState<boolean>(false)

  const [isMounted, setIsMounted] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isTwitterSet, setIsTwitterSet] = useState(false)
  const [twitterName, setTwitterName] = useState<string | null>(null)
  const [currentTwitterName, setCurrentTwitterName] = useState<string | null>(null)

  const { data: ensName } = useEnsName({ address, chainId: chain?.id })

  const getEnsTwitter = async (ensName: string) => {
    const resolver = await provider?.getResolver(ensName);
    const twitter = await resolver?.getText("com.twitter");
    twitter && setCurrentTwitterName(twitter);
  };

  useEffect(() => {
    setIsMounted(true);
    ensName && getEnsTwitter(ensName);
  }, [ensName]);

  const [text, setText] = useState<string | undefined | null>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (text) {
      setTwitterName(text)
      setIsModalOpen(true);
    }
  }

  return (
    <>
      <Head>
        <title>Set Your ENS Twitter</title>
        <meta property="og:title" content="Set Your ENS Twitter" />
        <meta property="twitter:creator" content="@petrdu" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          name="description"
          content="Easily set a Twitter name on your ENS"
        />
        <meta
          property="og:description"
          content="Easily set a Twitter name on your ENS"
        />
        <meta
          property="og:image"
          content="/public/ens.jpeg"
        />
        <script async defer data-website-id="a5a49e01-4e16-4e75-92a5-7f66a6969ac1" src="https://twittens-lytics.up.railway.app/umami.js"></script>
      </Head>

      <Toaster />

      {isTwitterSet && (
        <Confetti
          width={windowWidth}
          height={windowHeight}
          colors={['#44BCFO', '#7298F8', '#A099FF', '#DE82FF', '#7F6AFF']}
          style={{ zIndex: '1000' }}
        />
      )}

      {isMounted && (
        <Layout
          size={address ? 'lg' : 'sm'}
          hero={<Hero title="Set Your ENS Twitter" />}
        >
          {!address && (
            <Button onClick={openConnectModal}>Connect Wallet</Button>
          )}

          {isLoading && <p>Loading...</p>}
          {isError && <p>Error...</p>}

          {address && !isLoading && ensNames.length === 0 && (
            <>
              <p style={{ margin: '0' }}>
                Your connected address doesn&apos;t own an ENS name
              </p>
              <Button
                as="a"
                href={`https://${
                  chain?.id === 5 ? 'alpha' : 'app'
                }.ens.domains/`}
              >
                Register a name
              </Button>
            </>
          )}

          {address && !isLoading && !ensName && ensNames.length > 0 && (
            <>
              <p style={{ margin: '0' }}>
                Your connected address doesn&apos;t have a primary ENS name.
              </p>
              <Button
                as="a"
                href={`https://${
                  chain?.id === 5 ? 'alpha' : 'app'
                }.ens.domains/`}
              >
                Register a name
              </Button>
            </>
          )}

          {address && currentTwitterName && (
            <>
              <p style={{ margin: '0', textAlign: "center" }}>
                Your connected address has already set a Twitter username to <br /><span style={{fontWeight: 700}}>{currentTwitterName}</span>{isTwitterUsernameValid(currentTwitterName) ? "" : " but it seems to be in an invalid format"}.
              </p>
              <p>Would you like to update it?</p>
            </>
          )}

          {address && !isLoading && ensName && (
            <>
              <div>
                <form onSubmit={async (e) => await handleSubmit(e)}>
                  <input
                    type="text"
                    name="text"
                    id="text"
                    placeholder="username"
                    autoFocus
                    onChange={(e) => setText(e.target.value)}
                  />
                  <button type="submit" disabled={!text}>
                    <ArrowIcon disabled={!text || text.length < 3} />
                  </button>
                </form>
              </div>
            </>
          )}

          {isModalOpen && ensName && twitterName && (
            <TransactionModal
              ensName={ensName}
              twitterName={twitterName}
              setIsOpen={setIsModalOpen}
              setIsTwitterSet={setIsTwitterSet}
            />
          )}

          <button className="help" onClick={() => setIsHelperModalOpen(true)}>
            How does it work?
          </button> 

          {isHelperModalOpen && (
            <div className="help-modal">
              <Modal setIsOpen={setIsHelperModalOpen}>
                <h2 className="text-center">How Does It Work?</h2>
                <p>ENS allows owners to associate their Twitter handle and other text records, such as an email address, URL, or Discord, with their ENS name.</p>
                <p style={{ fontWeight: '500', color: '#000' }}>
                  This website makes it easy to set your Twitter handle on your ENS name with just a few clicks.
                </p>

                <p>Once you link your Twitter handle to your ENS name, some websites will automatically display the information on your wallet profile. For example, {' '}

                  <a
                    href="https://twittens.xyz"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Twittens
                  </a>
                  ,{' '}
                  <a
                    href="https://rainbow.me/1540.eth"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Rainbow
                  </a>
                  , and{' '}
                  <a
                    href="https://app.ens.domains/name/1540.eth/details"
                    target="_blank"
                    rel="noreferrer"
                  >
                    ENS{' '}
                  </a>
                  all support this feature.
                </p>

                <p>
                  If you want to link more information than just a twitter, we recommend using the ENS portal directly. You can find more information and instructions <a href={"https://dudis.notion.site/How-to-add-your-Twitter-df8b2389dd664d08a85eb333b32f076d"} target="_blank" rel="noreferrer">in our guide</a>.
                </p>
                <Button
                  variant="secondary"
                  onClick={() => setIsHelperModalOpen(false)}
                >
                  Close
                </Button>
              </Modal>
            </div>
          )}

        </Layout>
      )}

      <style jsx>{`
        .nfts {
          width: 100%;
          display: grid;
          padding: 1rem;
          gap: 1.5rem 1rem;
          border-radius: 0.5rem;
          background-color: #fff;
          box-shadow: var(--shadow);
          grid-template-columns: repeat(auto-fill, minmax(9rem, 2fr));
        }

        .nft {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;

          &:hover {
            cursor: pointer;
          }

          img {
            aspect-ratio: 1;
            object-fit: cover;
            border-radius: 0.25rem;
            box-shadow: var(--shadow);
            transition: transform 0.15s ease-in-out;

            &:hover {
              transform: scale(1.04);
            }
          }

          span {
            font-size: 0.875rem;
          }
        }

        form {
          position: relative;

          & > * {
            outline-color: var(--color-primary);
          }

          input {
            background: #fff;
            border: none;
            font-size: 1.25rem;
            border-radius: 0.5rem;
            padding: 1rem 3.5rem 1rem 1.25rem;
            width: 100%;
          }

          button {
            background: none;
            border: none;
            position: absolute;
            border-radius: 5rem;
            width: 2rem;
            height: 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            top: 50%;
            right: 0.75rem;
            bottom: 0;
            transform: translateY(-50%) scale(1.3);

            &:disabled {
              cursor: not-allowed;
            }
          }
        }
        .help {
          margin-top: 1rem;
          opacity: 0.5;
          border: none;
          font-weight: 500;
          background: none;
          width: fit-content;
          :hover {
            text-decoration: underline;
          }

          &-modal {
            a {
              color: #3681f2;
            }
          }
        }


      `}</style>
    </>
  )
}

type TransactionModalProps = {
  ensName: string
  twitterName: string
  setIsOpen: (isOpen: boolean) => void
  setIsTwitterSet: (isTwitterSet: boolean) => void
}

function TransactionModal({
  ensName,
  twitterName,
  setIsOpen,
  setIsTwitterSet,
}: TransactionModalProps) {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const { data: ensResolver, } = useEnsResolver({
    name: ensName ?? undefined, chainId: chain?.id
  })
  const nodehash = ensName && hash(ensName)

  const { config, isError: prepareWriteError } = usePrepareContractWrite({
    address: ensResolver?.address,
    abi: ENS_RESOLVER_ABI,
    functionName: 'setText',
    args: [nodehash, 'com.twitter', twitterName],
  })

  const isTwitterValid = isTwitterUsernameValid(twitterName);

  const { data, write } = useContractWrite(config)
  const {
    data: success,
    isLoading,
    isError,
  } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => {
      setIsTwitterSet(true)
      address && notifyTwittens(address);
    },
    onError: () => {
      // do something
    },
  })

  return (
    <Modal setIsOpen={setIsOpen} canClose={!data}>
      <h2 className="text-center">
        {!isLoading && isTwitterValid && !success && "Is this your Twitter account?"}
        {!isLoading && !isTwitterValid && "Oooops..."}
        {isLoading && "Submitting...."}
        {!isLoading && success && "Your Twitter name has been set! 🥳"}
        
      </h2>
      <div className="content">
        {!isTwitterValid && (
          <>
            <div className="error">
              <ErrorIcon />
              <p style={{ color: '#ED7B7B' }}>
                It seems <b>{twitterName}</b> is not a valid Twitter username.
              </p>
            </div>
            <div>
              <p>Your username should be between 1 and 15 characters long and can only contain letters, numbers, and underscores.</p>
              <p>You can get it from the URL of your Twitter profile https://www.twitter.com/<span style={{color: 'green', fontWeight: 700}}>{`<your_username>`}</span></p>
            </div>
            <Button onClick={() => setIsOpen(false)}>
              Go back
            </Button>
          </>
        )}

        {prepareWriteError && (
          <>
            <p className="text-center" style={{ color: '#ED7B7B' }}>
              Only the controller of {ensName} can set the twitter
            </p>
            <Button onClick={() => setIsOpen(false)}>
              Go back
            </Button>
          </>
        )}

        {isTwitterValid && !prepareWriteError && (
          <>
            <TwitterPreview username={twitterName} isTwitterValid={isTwitterValid} />
            {!data &&              
              <>
                <Button disabled={!write} onClick={() => write?.()}>
                  Set Twitter name
                </Button>
                <Link  href="#" onClick={() => setIsOpen(false)} style={{textDecoration: "underline", textAlign: "center", fontSize: "12px"}}>
                  Go back
                </Link>
              </>
            }
          </>
        )}


        {isLoading && (
          <Button as="a" href={getEtherscanUrl(data!, chain)} loading>
            View on Etherscan
          </Button>
        )}

        {isError && (
          <Button as="a" href={getEtherscanUrl(data!, chain)} state="error">
            Transaction failed
          </Button>
        )}

        {success && (
          <Button
            as="a"
            href={`https://${
              chain?.id === 5
                ? 'alpha.ens.domains/profile'
                : 'app.ens.domains/name'
            }/${ensName}`}
            state="success"
          >
            View in ENS Manager
          </Button>
        )}
      </div>

      <style jsx>{`
        .content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .error {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 0.5rem;
        }

        .previews {
          display: flex;
          flex-direction: column-reverse;
          align-items: center;
          width: 100%;
          gap: 1rem;

          @media (min-width: 32em) {
            display: grid;
            grid-template-columns: 2fr 3fr;
          }

          @media (min-width: 38em) {
            grid-template-columns: 1fr 1fr;
          }

          .nft-image {
            line-height: 1;
            border-radius: 0.5rem;
            background: #dadfe9;
            overflow: hidden;
            box-shadow: var(--shadow);
          }

          .connections {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.75rem;

            @media (min-width: 32em) {
              gap: 1rem;
            }
          }
        }
      `}</style>
    </Modal>
  )
}

const notifyTwittens = async (walletAddress: string) => {  
  try {
    await fetch(`/api/twitter/update/${walletAddress}`);
  } catch(err) {
    console.error("error notify twittens", err);
  }
};
