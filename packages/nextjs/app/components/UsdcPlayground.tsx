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
import { useI18n } from "@/lib/i18n/I18nProvider";
import { ARC_DOCS } from "@/lib/arcDocs";
import { ArcInlineText } from "./ArcInlineText";
import { ArcDocsCallout } from "./ArcDocsCallout";

const SCENARIO_IDS = [
  { id: "salary", amount: "50", testId: "scenario-salary", labelKey: "scenarioSalary" as const },
  {
    id: "invoice",
    amount: "12.50",
    testId: "scenario-invoice",
    labelKey: "scenarioInvoice" as const,
  },
  { id: "coffee", amount: "3.75", testId: "scenario-coffee", labelKey: "scenarioCoffee" as const },
];

export function UsdcPlayground() {
  const { t } = useI18n();
  const [amount, setAmount] = useState("50");
  const [gasLimit, setGasLimit] = useState("21000");
  const [feeGwei, setFeeGwei] = useState("20");

  const conversion = useMemo(() => {
    const erc20 = fromWholeUsdc(amount);
    if (erc20 === null) {
      return { error: true as const };
    }
    const native = erc20ToNative(erc20);
    return { error: false as const, erc20, native };
  }, [amount]);

  const paymentDemo = useMemo(() => {
    if (conversion.error) return null;
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
        <h2 id="conv-title">{t("convTitle")}</h2>
        <p className="lede">
          <ArcInlineText text={t("convLede")} />
        </p>
        <ArcDocsCallout
          testId="arc-docs-conversion"
          blurbKey="convArcDocsBlurb"
          primaryHref={ARC_DOCS.evmDifferences}
          primaryLinkKey="convArcDocsLinkEvm"
          primaryLinkTestId="arc-docs-link-evm-conversion"
        />

        <div
          className="row"
          role="group"
          aria-label={t("scenariosGroup")}
          style={{ marginBottom: "1rem" }}
        >
          {SCENARIO_IDS.map((s) => (
            <button
              key={s.id}
              type="button"
              className="secondary"
              data-testid={s.testId}
              aria-pressed={amount === s.amount}
              onClick={() => setAmount(s.amount)}
            >
              {t(s.labelKey)}
            </button>
          ))}
        </div>

        <div className="field">
          <label htmlFor="usdc-amount">{t("amountLabel")}</label>
          <input
            id="usdc-amount"
            data-testid="input-usdc-amount"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            placeholder={t("amountPlaceholder")}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            aria-describedby="usdc-amount-hint"
          />
          <p id="usdc-amount-hint" className="muted" style={{ marginTop: "0.35rem", fontSize: "0.9rem" }}>
            {t("amountHint")}
          </p>
        </div>

        {conversion.error ? (
          <div className="result bad" role="alert" data-testid="conversion-error">
            {t("amountError")}
          </div>
        ) : (
          <div className="result good" data-testid="conversion-result">
            <p>
              {t("balanceShown")}{" "}
              <strong className="mono" data-testid="out-balance-usdc">
                {formatUsd(conversion.erc20)}
              </strong>
            </p>
            <p className="muted" style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
              {t("balanceOneRow")}
            </p>
            <details className="tech-details" data-testid="tech-details-balance">
              <summary>{t("techDetailsSummary")}</summary>
              <p className="muted" style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>
                <ArcInlineText text={t("techDetailsBody")} />{" "}
                <span className="mono" data-testid="out-erc20">
                  {conversion.erc20.toString()}
                </span>{" "}
                {t("balanceHintAnd")}{" "}
                <span className="mono" data-testid="out-native">
                  {conversion.native.toString()}
                </span>
                .
              </p>
            </details>
          </div>
        )}
      </section>

      <section className="panel" data-testid="panel-naive" aria-labelledby="naive-title">
        <h2 id="naive-title">{t("naiveTitle")}</h2>
        <p className="lede">
          <ArcInlineText
            text={
              conversion.error
                ? t("naiveLedeFallback")
                : t("naiveLedeAmount", { amount: formatUsd(conversion.erc20) })
            }
          />
        </p>
        <ArcDocsCallout
          testId="arc-docs-naive"
          blurbKey="naiveArcDocsBlurb"
          primaryHref={ARC_DOCS.connectToArc}
          primaryLinkKey="naiveArcDocsLinkConnect"
          primaryLinkTestId="arc-docs-link-connect-naive"
        />
        {paymentDemo && !conversion.error ? (
          <div className="compare">
            <div className="result bad" data-testid="naive-result">
              <p>
                <strong>{t("naiveEthTitle")}</strong>
              </p>
              <p className="muted" style={{ fontSize: "0.9rem", marginTop: "0.35rem" }}>
                {t("naiveEthBody", {
                  tiny: paymentDemo.tinyUsd,
                  required: paymentDemo.requiredUsd,
                })}
              </p>
              <p style={{ marginTop: "0.5rem" }} className="danger">
                {paymentDemo.ethereumAccepts ? t("naiveEthAccepts") : t("naiveEthRejects")}
              </p>
            </div>
            <div className="result good" data-testid="safe-result">
              <p>
                <strong>
                  <ArcInlineText text={t("naiveArcTitle")} />
                </strong>
              </p>
              <p className="muted" style={{ fontSize: "0.9rem", marginTop: "0.35rem" }}>
                {t("naiveArcBody")}
              </p>
              <p style={{ marginTop: "0.5rem" }} className="ok">
                {paymentDemo.arcRejectsTiny
                  ? t("naiveArcRejectsTiny")
                  : t("naiveArcDidNotReject")}
                {" · "}
                {paymentDemo.arcAcceptsFull
                  ? t("naiveArcAcceptsFull", { amount: paymentDemo.requiredUsd })
                  : t("naiveArcFullFailed")}
              </p>
            </div>
          </div>
        ) : (
          <p className="muted">{t("naiveFixAmount")}</p>
        )}
        {!conversion.error && (
          <p className="muted" style={{ marginTop: "0.85rem", fontSize: "0.9rem" }}>
            {t("naiveDustHint")}
          </p>
        )}
      </section>

      <section className="panel" data-testid="panel-fee" aria-labelledby="fee-title">
        <h2 id="fee-title">{t("feeTitle")}</h2>
        <p className="lede">
          <ArcInlineText text={t("feeLede")} />
        </p>
        <ArcDocsCallout
          testId="arc-docs-fee"
          blurbKey="feeArcDocsBlurb"
          primaryHref={ARC_DOCS.gasAndFees}
          primaryLinkKey="feeArcDocsLinkGas"
          primaryLinkTestId="arc-docs-link-gas-fee"
        />
        <div className="row">
          <div className="field" style={{ flex: "1 1 140px" }}>
            <label htmlFor="gas-limit">{t("gasLimitLabel")}</label>
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
              {t("gasLimitHint")}
            </p>
          </div>
          <div className="field" style={{ flex: "1 1 140px" }}>
            <label htmlFor="fee-gwei">{t("feeGweiLabel")}</label>
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
              <ArcInlineText
                text={t("feeFloorHint", { floor: MIN_MAX_FEE_PER_GAS_GWEI.toString() })}
              />
            </p>
          </div>
        </div>
        <div
          className={`result ${fee.belowFloor ? "bad" : "good"}`}
          data-testid="fee-result"
          role="status"
        >
          <p>
            {t("feeYouPay")}{" "}
            <strong className="mono" data-testid="out-fee-usd">
              {formatUsd(fee.feeAmount)}
            </strong>
          </p>
          {fee.belowFloor ? (
            <p className="danger" style={{ marginTop: "0.5rem" }} data-testid="fee-floor-warning">
              <ArcInlineText text={t("feeBelowFloor")} />
            </p>
          ) : (
            <p className="ok" style={{ marginTop: "0.5rem" }}>
              {t("feeOkFloor")}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
