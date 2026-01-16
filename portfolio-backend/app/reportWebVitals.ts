// app/reportWebVitals.ts

import type { NextWebVitalsMetric } from "next/app";

export function reportWebVitals(metric: NextWebVitalsMetric) {
  if (metric.name === "LCP" || metric.name === "CLS" || metric.name === "INP") {
    console.log(metric.name, metric.value);
  }
}
