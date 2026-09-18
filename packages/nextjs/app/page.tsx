import { UsdcPlayground } from "./components/UsdcPlayground";

export default function HomePage() {
  return (
    <div className="shell">
      <header className="site-header" data-testid="site-header">
        <div>
          <p className="brand-mark">
            <a
              href="https://simonethg.com"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="brand-link"
            >
              Simonethg
            </a>
          </p>
          <p className="product-name" data-testid="product-name">
            scaffold-arc · playground
          </p>
        </div>
        <a
          href="https://github.com/Simonethg/scaffold-arc"
          target="_blank"
          rel="noopener noreferrer"
          data-testid="repo-link"
        >
          GitHub
        </a>
      </header>

      <main id="contenido-principal">
        <section className="hero" data-testid="hero">
          <h1>Casos de uso USDC en Arc</h1>
          <p>
            Tres historias de fintech LatAm: te pagan el sueldo, cobrás una
            factura sin quedarte corto, y ves el gas en dólares. Un solo saldo
            USDC. Sin wallet todavía — eso llega en el siguiente entregable.
          </p>
        </section>

        <UsdcPlayground />
      </main>

      <footer className="site-footer" data-testid="site-footer">
        <p>
          Powered by{" "}
          <a
            href="https://academiaqa.com"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="academiaqa-link"
          >
            AcademiaQA.com
          </a>
        </p>
      </footer>
    </div>
  );
}
