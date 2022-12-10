import React from "react";
import Link from "next/link";

interface ITwitterData {
  name: string;
  profile_image_url: string;
  id: string;
  username: string;
}

export function TwitterPreview({
  username,
  isTwitterValid
}: {
  username: string,
  isTwitterValid: boolean
}) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false);
  const [twitterData, setTwitterData] = React.useState<ITwitterData | null>(null);

  const fetchTwitterData = React.useCallback(async () => {  
    try {
      const res = await fetch(`/api/twitter/${username}`)
      const data = await res.json();
      setTwitterData(data);
      setIsLoading(false);
    } catch(err) {
      console.error(err);
      setIsError(true);
      setIsLoading(false);
    }
  }, [username]);

  React.useEffect(() => {
    fetchTwitterData();
  }, [fetchTwitterData])

  if (!isTwitterValid) {
    return null
  }

  if (isLoading) {
    return (
      <>
        <div className="loading">Loading profile data...</div>
        <style jsx>{`
          .loading {
            font-size: 1.1rem;
            text-align: center;
          }
       `}</style>
      </>
    )
  }

  if (isError || (!isLoading && (!twitterData || !twitterData?.username || !twitterData?.name))) {
    return (
      <>
        <div>
          <p>Please verify if this is your profile before signing a transaction:</p>
          <div className="twitter-link">
            <a href={`https://www.twitter.com/${username}`} target="_blank" rel="noreferrer" >
              https://www.twitter.com/{username}
            </a>
          </div>
        </div>
        <style jsx>{`
          .twitter-link {
            text-decoration: underline;
            font-size: 1.1rem;
            text-align: center;
            margin-bottom: 1.5rem;
            color: #555;
            font-weight: 600;
          }
       `}</style>
      </>
    )
  }

  return (
    <>
      {twitterData && 
        <Link href={`https://www.twitter.com/${twitterData.username}`} target="_blank" >
          <div className='profile'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {twitterData.profile_image_url && <img src={twitterData.profile_image_url} alt="twitter profile picture" aria-hidden="true" width={46} height={46} />}
                <div className="right">
                  <span className="name">{twitterData.name}</span>
                  <span className="address">{twitterData.username}</span>
                </div>
          </div>
        </Link>
      }

      <style jsx>{`
        .profile {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 0.5rem;
          background-color: #fff;
          border: 2px solid #e2e8ed;
          box-shadow: var(--shadow);
          padding: 0.5rem 1.125rem 0.5rem 0.5rem;
          word-spacing: -0.0625rem;
          border-radius: 10rem;
          width: fit-content;
          overflow: hidden;
          margin: 1rem auto;
          transition: transform 0.15s ease-in-out;
          .address {
            font-size: 1.1rem;
            font-weight: 400;
            color: #888;
          }
          img {
            --size: 3rem;
            border-radius: 5rem;
            width: var(--size);
            height: var(--size);
            object-fit: cover;
            background-color: #dce5f1;
            transition: opacity 0.1s ease-in-out;
          }
          .right {
            display: flex;
            font-weight: 600;
            flex-direction: column;
            justify-content: center;
          }
          &.rainbow {
            background: linear-gradient(0deg, #525258, #2b2d30);
            padding: 0.375rem 0.75rem 0.375rem 0.5rem;
            border-radius: 0.5rem;
            border: none;
            gap: 0.5rem;
            img {
              width: 2rem;
              height: 2rem;
            }
            .right {
              .name {
                color: #fff;
                font-size: 1rem;
              }
              .address {
                display: none;
              }
            }
          }
        }
      `}</style>
    </>
  )
}