export default function Hero() {
  return (
    <>
      <div className="hero">
        <span>The easiest way to</span>
        <h1>Mint Your PFP</h1>
      </div>

      <style jsx>{`
        .hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          text-align: center;

          @media (min-width: 768px) {
            gap: 0.5rem;
          }

          span {
            opacity: 80%;
            line-height: 1;
            font-weight: 500;
            font-size: 1.5rem;

            @media (min-width: 768px) {
              font-size: 1.625rem;
            }
          }

          h1 {
            line-height: 1;
            font-size: 3rem;
            color: var(--color-primary);

            @media (min-width: 768px) {
              font-size: 4.5rem;
            }
          }
        }
      `}</style>
    </>
  )
}
