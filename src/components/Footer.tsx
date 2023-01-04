export default function Footer() {
  return (
    <>
      <footer>
        <div className="links">
          <a
            href="https://twitter.com/petrdu"
            target="_blank"
            rel="noreferrer"
          >
            @petrdu
          </a>
          <a
            href="https://twittens.xyz/twitter"
            target="_blank"
            rel="noreferrer"
          >
            @twittensxyz
          </a>
        </div>

        <div className="links">
          <span>
            <a 
              href="https://www.twittens.xyz"
              target="_blank"
              rel="noreferrer"
            >
              Home
            </a>
          </span>

          <a
            href="https://github.com/petdud/ens-twitter"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>

          <span>
            <a 
              href="https://www.twittens.xyz/feedback"
              target="_blank"
              rel="noreferrer"
            >
              Feedback
            </a>
          </span>

        </div>
      </footer>

      <style jsx>{`
        footer {
          gap: 0.5rem;
          display: flex;
          align-items: center;
          font-size: 1.125rem;
          font-weight: 500;
          flex-direction: column;

          @media (min-width: 560px) {
            flex-direction: row;
            justify-content: space-between;
            gap: 2rem;
          }
        }

        .links {
          display: flex;
          gap: 2rem;

          & > * {
            opacity: 0.6;

            &:hover {
              opacity: 1;
              cursor: pointer;
            }
          }

          button {
            background: none;
            border: none;
          }
        }
      `}</style>
    </>
  )
}
