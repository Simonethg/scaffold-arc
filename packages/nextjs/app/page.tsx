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
          <h1>Probá los footguns de USDC en Arc</h1>
          <p>
            Calculadora de prueba para la librería del scaffold: un solo saldo,
            comparación ingenua vs segura, y fees en dólares con piso de 20
            Gwei. Sin wallet todavía — eso llega en el siguiente entregable.
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
