"use client";

import { useMemo, useState } from "react";
import {
  SCALE,
  MIN_MAX_FEE_PER_GAS_GWEI,
  GWEI,
  fromWholeUsdc,
  erc20ToNative,
  nativeToErc20,
  naiveValueCoversErc20,
  nativeCoversErc20,
  feeErc20,
  formatErc20,
  formatUsd,
} from "@/lib/usdcMath";

export function UsdcPlayground() {
  const [amount, setAmount] = useState("1");
  const [gasLimit, setGasLimit] = useState("21000");
  const [feeGwei, setFeeGwei] = useState("20");

  const conversion = useMemo(() => {
    const erc20 = fromWholeUsdc(amount);
    if (erc20 === null) {
      return { error: "Usá un número con hasta 6 decimales (ej. 1 o 1.5)." } as const;
    }
    const native = erc20ToNative(erc20);
    return { error: null, erc20, native } as const;
  }, [amount]);

  const naiveDemo = useMemo(() => {
    if (conversion.error) return null;
    // Wrong port often sends msg.value = requiredErc20 (1e6 for 1 USDC) instead of 1e18.
    const wrongMsgValue = conversion.erc20;
    const correctMsgValue = conversion.native;
    return {
      wrongMsgValue,
      correctMsgValue,
      naiveAcceptsWrong: naiveValueCoversErc20(wrongMsgValue, conversion.erc20),
      safeRejectsWrong: !nativeCoversErc20(wrongMsgValue, conversion.erc20),
      safeAcceptsCorrect: nativeCoversErc20(correctMsgValue, conversion.erc20),
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
        <h2 id="conv-title">1. Un solo USDC, dos vistas</h2>
        <p className="lede">
          En Arc el saldo nativo (18 decimales) y el ERC-20 (6 decimales) son el
          mismo dinero. Acá ves la conversión sin wallet.
        </p>
        <div className="field">
          <label htmlFor="usdc-amount">Monto en USDC</label>
          <input
            id="usdc-amount"
            data-testid="input-usdc-amount"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            aria-describedby="usdc-amount-hint"
          />
          <p id="usdc-amount-hint" className="muted" style={{ marginTop: "0.35rem", fontSize: "0.9rem" }}>
            Ejemplo: 1 = un dólar digital.
          </p>
        </div>
        {conversion.error ? (
          <div className="result bad" role="alert" data-testid="conversion-error">
            {conversion.error}
          </div>
        ) : (
          <div className="result good" data-testid="conversion-result">
            <p>
              Vista ERC-20 (6d):{" "}
              <span className="mono" data-testid="out-erc20">
                {conversion.erc20.toString()}
              </span>{" "}
              → {formatUsd(conversion.erc20)}
            </p>
            <p style={{ marginTop: "0.5rem" }}>
              Vista nativa (18d):{" "}
              <span className="mono" data-testid="out-native">
                {conversion.native.toString()}
              </span>
            </p>
            <p className="muted" style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
              Factor: × {SCALE.toString()} (10¹²). Un solo saldo para mostrar: la vista de 6
              decimales.
            </p>
          </div>
        )}
      </section>

      <section className="panel" data-testid="panel-naive" aria-labelledby="naive-title">
        <h2 id="naive-title">2. Port ingenuo vs seguro</h2>
        <p className="lede">
          Si copiás lógica de Ethereum y comparás msg.value crudo con un monto
          ERC-20, aceptás casi nada de dinero como si fuera el pago completo.
        </p>
        {naiveDemo && !conversion.error ? (
          <div className="compare">
            <div className="result bad" data-testid="naive-result">
              <p>
                <strong>Ingenuo</strong>
              </p>
              <p className="muted" style={{ fontSize: "0.9rem", marginTop: "0.35rem" }}>
                msg.value = {naiveDemo.wrongMsgValue.toString()} (usa unidades de 6d por error)
              </p>
              <p style={{ marginTop: "0.5rem" }} className="danger">
                {naiveDemo.naiveAcceptsWrong
                  ? "Acepta el pago (¡mal!)"
                  : "Rechaza (inesperado)"}
              </p>
            </div>
            <div className="result good" data-testid="safe-result">
              <p>
                <strong>Seguro (scaffold-arc)</strong>
              </p>
              <p className="muted" style={{ fontSize: "0.9rem", marginTop: "0.35rem" }}>
                Convierte nativo → ERC-20 antes de comparar.
              </p>
              <p style={{ marginTop: "0.5rem" }} className="ok">
                {naiveDemo.safeRejectsWrong
                  ? "Rechaza el valor erróneo"
                  : "No rechazó"}
                {" · "}
                {naiveDemo.safeAcceptsCorrect
                  ? "Acepta 1 USDC nativo correcto"
                  : "Falló el caso correcto"}
              </p>
            </div>
          </div>
        ) : (
          <p className="muted">Corregí el monto arriba para ver la comparación.</p>
        )}
        {!conversion.error && (
          <p className="muted" style={{ marginTop: "0.85rem", fontSize: "0.9rem" }}>
            Dust: {(SCALE - BigInt(1)).toString()} unidades nativas → ERC-20 ={" "}
            {nativeToErc20(SCALE - BigInt(1)).toString()} (parece vacío, pero hay saldo
            onchain).
          </p>
        )}
      </section>

      <section className="panel" data-testid="panel-fee" aria-labelledby="fee-title">
        <h2 id="fee-title">3. Fee en USDC (piso 20 Gwei)</h2>
        <p className="lede">
          En Arc el gas se paga en USDC. Debajo de 20 Gwei la transacción puede
          desaparecer sin recibo. Mostramos el costo en dólares.
        </p>
        <div className="row">
          <div className="field" style={{ flex: "1 1 140px" }}>
            <label htmlFor="gas-limit">Límite de gas</label>
            <input
              id="gas-limit"
              data-testid="input-gas-limit"
              type="number"
              min={21000}
              step={1000}
              value={gasLimit}
              onChange={(e) => setGasLimit(e.target.value)}
            />
          </div>
          <div className="field" style={{ flex: "1 1 140px" }}>
            <label htmlFor="fee-gwei">maxFeePerGas (Gwei)</label>
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
              Piso Arc: {MIN_MAX_FEE_PER_GAS_GWEI.toString()} Gwei
            </p>
          </div>
        </div>
        <div
          className={`result ${fee.belowFloor ? "bad" : "good"}`}
          data-testid="fee-result"
          role="status"
        >
          <p>
            Fee estimado:{" "}
            <strong className="mono" data-testid="out-fee-usd">
              {formatUsd(fee.feeAmount)}
            </strong>{" "}
            ({formatErc20(fee.feeAmount)} en unidades ERC-20)
          </p>
          {fee.belowFloor ? (
            <p className="danger" style={{ marginTop: "0.5rem" }} data-testid="fee-floor-warning">
              Por debajo del piso: en Arc esta tx puede quedar en el limbo sin
              receipt.
            </p>
          ) : (
            <p className="ok" style={{ marginTop: "0.5rem" }}>
              Cumple el piso de 20 Gwei.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
