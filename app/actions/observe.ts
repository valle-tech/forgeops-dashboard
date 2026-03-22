"use server";

import {
  getServiceLogsBundle,
  getServiceMetricsBundle,
  getServiceHealthProbe,
  type GhRunRow,
} from "@/lib/service-observe-data";

export type { GhRunRow };

export async function getServiceLogsAction(serviceName: string) {
  return getServiceLogsBundle(serviceName);
}

export async function getServiceMetricsAction(serviceName: string) {
  return getServiceMetricsBundle(serviceName);
}

export async function getServiceHealthAction(serviceName: string) {
  return getServiceHealthProbe(serviceName);
}
