import type { LoaderFunction, MetaFunction } from "react-router";
import { data as json } from "react-router";
import { useLoaderData } from "react-router";
import { marketsMock, Market, Candle } from "@domain/market";
import { hlCompositeMock } from "@domain/market";
import { Error500 } from "@app/components/error-500";
import { ScreenerView } from "@app/ui/main/screener";
import { formatTags, formatProperties } from "@utils/meta";

export const meta: MetaFunction = () => {
  const title = "Jira clone - Screener";
  const description =
    "Advanced screener for Hyperliquid markets: filter, scan and rank perps and spot markets by price, volume, funding, and technical criteria.";

  const tags = {
    charset: "utf-8",
    viewport: "width=device-width,initial-scale=1",
    title: title,
    description: description,
  };

  const properties = {
    "og:type": "website",
    "og:site_name": title,
    "og:title": title,
    "og:description": description,
  };

  return [{ title }, ...formatTags(tags), ...formatProperties(properties)];
};

type LoaderData = {
  markets: Market[];
  benchmark: Candle[];
};

// This is the single place a real Hyperliquid API call would later swap in:
// today it returns the mock dataset synchronously; a real integration would
// fetch metaAndAssetCtxs + candleSnapshot here instead.
export const loader: LoaderFunction = async () => {
  return json<LoaderData>({ markets: marketsMock, benchmark: hlCompositeMock });
};

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  const errorMessage = "The Screener page failed. Navigate to the projects page";

  return (
    <div className="flex h-full items-center justify-center">
      <Error500 message={errorMessage} href="/projects" />
    </div>
  );
}

export default function ScreenerRoute() {
  const { markets, benchmark } = useLoaderData() as LoaderData;
  return <ScreenerView markets={markets} benchmark={benchmark} />;
}
