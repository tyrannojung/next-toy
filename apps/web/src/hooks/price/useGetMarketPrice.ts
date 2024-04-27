import { GET_MARKET_PRICE } from "@/graphql/getMarketPrice";
import { SupportedTokenNames } from "@/types/token/supportedToken";
import commafy from "@/utils/trim/commafy";
import { useQuery } from "@apollo/client";
import { useMemo } from "react";

export const trimTokenName = (tokenName: string | undefined) => {
  if (tokenName?.includes(" "))
    return `${tokenName.split(" ")[0]}-${tokenName.split(" ")[1]}`;
  return tokenName;
};

export const changeTokenNameForAPI = (tokenName: string | undefined) => {
  if (tokenName === "Wrapped TON") return "tokamak-network";
  if (tokenName === "Wrapped Ether" || tokenName === "ETH") return "ethereum";
  if (tokenName === "USD Coin") return "usd-coin";
  if (tokenName === "Tether USD") return "tether";
  return tokenName?.toLowerCase();
};

export function useGetMarketPrice(params: {
  tokenName: SupportedTokenNames | string | undefined;
  amount?: number;
}) {
  const tokenName = changeTokenNameForAPI(params.tokenName);

  const { data } = useQuery(GET_MARKET_PRICE, {
    variables: {
      tokenName: trimTokenName(tokenName),
    },
    pollInterval: 13000,
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    context: {
      apiName: "price",
    },
  });

  const tokenMarketPrice: number = useMemo(() => {
    if (data?.getTokenMarketData.current_price !== undefined) {
      return data.getTokenMarketData.current_price;
    }
    return undefined;
  }, [data]);

  const tokenPriceWithAmount = useMemo(() => {
    if (tokenMarketPrice && params.amount) {
      return commafy(data.getTokenMarketData.current_price * params.amount, 2);
    }
    return undefined;
  }, [tokenMarketPrice, params.amount]);

  return { tokenMarketPrice, tokenPriceWithAmount };
}
