"use client";

import { useMemo, useState } from "react";
import {
  MIN_MAX_FEE_PER_GAS_GWEI,
  GWEI,
  fromWholeUsdc,
  erc20ToNative,
  nativeToErc20,
  naiveValueCoversErc20,
  nativeCoversErc20,
  feeErc20,
  formatUsd,
} from "@/lib/usdcMath";

const SCENARIOS = [
  { id: "salary", label: "Sueldo 50 USDC", amount: "50", testId: "scenario-salary" },
  { id: "invoice", label: "Factura 12,50 USDC", amount: "12.50", testId: "scenario-invoice" },
  { id: "coffee", label: "Café 3,75 USDC", amount: "3.75", testId: "scenario-coffee" },
] as const;

export function UsdcPlayground() {
  const [amount, setAmount] = useState("50");
  const [gasLimit, setGasLimit] = useState("21000");
  const [feeGwei, setFeeGwei] = useState("20");

  const conversion = useMemo(() => {
    const erc20 = fromWholeUsdc(amount);
    if (erc20 === null) {
      return {
        error: "Escribí un monto válido, por ejemplo 50 o 12.50 (hasta 6 decimales).",
      } as const;
    }
    const native = erc20ToNative(erc20);
    return { error: null, erc20, native } as const;
  }, [amount]);

  const paymentDemo = useMemo(() => {
    if (conversion.error) return null;
    // Wrong port often sends msg.value = requiredErc20 (1e6 for 1 USDC) instead of 1e18.
    const ethereumTemplateValue = conversion.erc20;
    const arcCorrectValue = conversion.native;
    const tinyUsd = formatUsd(nativeToErc20(ethereumTemplateValue));
    return {
      ethereumTemplateValue,
      arcCorrectValue,
      tinyUsd,
      ethereumAccepts: naiveValueCoversErc20(ethereumTemplateValue, conversion.erc20),
      arcRejectsTiny: !nativeCoversErc20(ethereumTemplateValue, conversion.erc20),
      arcAcceptsFull: nativeCoversErc20(arcCorrectValue, conversion.erc20),
      requiredUsd: formatUsd(conversion.erc20),
    };
  }, [conversion]);

  const fee = useMemo(() => {
    const gl = BigInt(Math.max(0, Math.floor(Number(gasLimit) || 0)));
    const gwei = BigInt(Math.max(0, Math.floor(Number(feeGwei) || 0)));
    const belowFloor = gwei < MIN_MAX_FEE_PER_GAS_GWEI;
    const feeAmount = feeErc20(gl, gwei * GWEI);
    return { gl, gwei, belowFloor, feeAmount };
  }, [gasLimit, feeGwei]);

  return (
    <div data-testid="usdc-playground">
      <section className="panel" data-testid="panel-conversion" aria-labelledby="conv-title">
        <h2 id="conv-title">1. Te pagan o pagás en USDC</h2>
        <p className="lede">
          Historia: te acreditan el sueldo o pagás una factura en dólares
          digitales. En Arc es el mismo dinero — mostrá un solo saldo en USDC.
        </p>

        <div className="row" role="group" aria-label="Ejemplos rápidos" style={{ marginBottom: "1rem" }}>
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              className="secondary"
              data-testid={s.testId}
              aria-pressed={amount === s.amount}
              onClick={() => setAmount(s.amount)}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="field">
          <label htmlFor="usdc-amount">Monto del pago (USDC)</label>
          <input
            id="usdc-amount"
            data-testid="input-usdc-amount"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            placeholder="Ej. 50 o 12.50"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            aria-describedby="usdc-amount-hint"
          />
          <p id="usdc-amount-hint" className="muted" style={{ marginTop: "0.35rem", fontSize: "0.9rem" }}>
            Probá “50” (sueldo) o “12.50” (factura). Un dólar digital = 1 USDC.
          </p>
        </div>

        {conversion.error ? (
          <div className="result bad" role="alert" data-testid="conversion-error">
            {conversion.error}
          </div>
        ) : (
          <div className="result good" data-testid="conversion-result">
            <p>
              Tu saldo a mostrar:{" "}
              <strong className="mono" data-testid="out-balance-usdc">
                {formatUsd(conversion.erc20)}
              </strong>
            </p>
            <p className="muted" style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
              Una sola fila en la wallet. (Por dentro Arc guarda el mismo monto
              de dos formas:{" "}
              <span className="mono" data-testid="out-erc20">
                {conversion.erc20.toString()}
              </span>{" "}
              y{" "}
              <span className="mono" data-testid="out-native">
                {conversion.native.toString()}
              </span>
              — no las muestres como dos saldos.)
            </p>
          </div>
        )}
      </section>

      <section className="panel" data-testid="panel-naive" aria-labelledby="naive-title">
        <h2 id="naive-title">2. ¿Te alcanzó el pago?</h2>
        <p className="lede">
          Historia: cobrás {conversion.error ? "el monto de arriba" : formatUsd(conversion.erc20)}.
          Un template de Ethereum puede creer que alcanzó con una fracción
          ridícula; en Arc te quedás corto si no convertís bien.
        </p>
        {paymentDemo && !conversion.error ? (
          <div className="compare">
            <div className="result bad" data-testid="naive-result">
              <p>
                <strong>Template de Ethereum</strong>
              </p>
              <p className="muted" style={{ fontSize: "0.9rem", marginTop: "0.35rem" }}>
                Cree que alcanza con {paymentDemo.tinyUsd} (casi nada) para
                cubrir {paymentDemo.requiredUsd}.
              </p>
              <p style={{ marginTop: "0.5rem" }} className="danger">
                {paymentDemo.ethereumAccepts
                  ? "Acepta el pago — ¡te quedás corto!"
                  : "Rechaza (inesperado)"}
              </p>
            </div>
            <div className="result good" data-testid="safe-result">
              <p>
                <strong>En Arc (scaffold-arc)</strong>
              </p>
              <p className="muted" style={{ fontSize: "0.9rem", marginTop: "0.35rem" }}>
                Compara el valor completo en USDC antes de dar el ok.
              </p>
              <p style={{ marginTop: "0.5rem" }} className="ok">
                {paymentDemo.arcRejectsTiny
                  ? "Rechaza el pago incompleto"
                  : "No rechazó lo incompleto"}
                {" · "}
                {paymentDemo.arcAcceptsFull
                  ? `Acepta ${paymentDemo.requiredUsd} completo`
                  : "Falló el pago completo"}
              </p>
            </div>
          </div>
        ) : (
          <p className="muted">Corregí el monto arriba para ver la comparación.</p>
        )}
        {!conversion.error && (
          <p className="muted" style={{ marginTop: "0.85rem", fontSize: "0.9rem" }}>
            Detalle: un saldo “polvo” onchain puede verse como $0.00 USDC en
            pantalla y aun así existir en la cadena — por eso un solo saldo
            redondeado bien importa.
          </p>
        )}
      </section>

      <section className="panel" data-testid="panel-fee" aria-labelledby="fee-title">
        <h2 id="fee-title">3. Mandás un pago: ¿cuánto gas en dólares?</h2>
        <p className="lede">
          Historia: transferís USDC y querés saber el fee en dólares. En Arc el
          gas se paga en USDC; si el precio queda bajo el piso, la tx puede
          desaparecer sin aviso.
        </p>
        <div className="row">
          <div className="field" style={{ flex: "1 1 140px" }}>
            <label htmlFor="gas-limit">Complejidad del envío (unidades de gas)</label>
            <input
              id="gas-limit"
              data-testid="input-gas-limit"
              type="number"
              min={21000}
              step={1000}
              value={gasLimit}
              onChange={(e) => setGasLimit(e.target.value)}
              aria-describedby="gas-limit-hint"
            />
            <p id="gas-limit-hint" className="muted" style={{ marginTop: "0.35rem", fontSize: "0.85rem" }}>
              Un envío simple suele usar 21&nbsp;000.
            </p>
          </div>
          <div className="field" style={{ flex: "1 1 140px" }}>
            <label htmlFor="fee-gwei">Precio del gas (Gwei)</label>
            <input
              id="fee-gwei"
              data-testid="input-fee-gwei"
              type="number"
              min={0}
              step={1}
              value={feeGwei}
              onChange={(e) => setFeeGwei(e.target.value)}
              aria-describedby="fee-floor-hint"
            />
            <p id="fee-floor-hint" className="muted" style={{ marginTop: "0.35rem", fontSize: "0.85rem" }}>
              Mínimo en Arc: {MIN_MAX_FEE_PER_GAS_GWEI.toString()} Gwei → el fee
              se muestra en USDC.
            </p>
          </div>
        </div>
        <div
          className={`result ${fee.belowFloor ? "bad" : "good"}`}
          data-testid="fee-result"
          role="status"
        >
          <p>
            Vas a pagar de fee:{" "}
            <strong className="mono" data-testid="out-fee-usd">
              {formatUsd(fee.feeAmount)}
            </strong>
          </p>
          {fee.belowFloor ? (
            <p className="danger" style={{ marginTop: "0.5rem" }} data-testid="fee-floor-warning">
              Estás debajo del piso de 20 Gwei: en Arc este pago puede quedar en
              el limbo sin confirmación.
            </p>
          ) : (
            <p className="ok" style={{ marginTop: "0.5rem" }}>
              Cumple el piso: el fee se cobra en USDC y la tx puede entrar.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
