import Image from "next/image";
import { useMemo } from "react";
import { Box, Flex, Text, Stack } from "@chakra-ui/react";
import ETHIcon from "@/assets/tokens/eth_half_rounded.svg";
import TitanIcon from "@/assets/tokens/titan_half_rounded.svg";

import { useRecoilState, useRecoilValue } from "recoil";
import { networkStatus, tokenModalStatus } from "@/recoil/bridgeSwap/atom";
import TokenCard from "@/components/card/TokenCard";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { useGetMode } from "@/hooks/mode/useGetMode";
import useConnectedNetwork from "@/hooks/network";
import { useAccount, useSwitchNetwork } from "wagmi";

import { mobileTokenModalStatus } from "@/recoil/mobile/atom";
import useMobileChainIds from "@/hooks/mobile/useMobileChainIds";
import {
  SupportedChainProperties,
  supportedChain,
} from "@/types/network/supportedNetwork";
import {
  selectedInTokenStatus,
  selectedOutTokenStatus,
} from "@/recoil/bridgeSwap/atom";

const MobileInToken = () => {
  const { outNetwork } = useRecoilValue(networkStatus);
  const { mode, swapSection } = useGetMode();
  const [tokenModal, setTokenModal] = useRecoilState(tokenModalStatus);
  const { outToken } = useInOutTokens();
  const [mobileTokenOpen, setMobileTokenOpen] = useRecoilState(
    mobileTokenModalStatus
  );
  const network = useConnectedNetwork();
  const { isConnected } = useAccount();
  const { ethChainId, titanChainId } = useMobileChainIds(network);
  const { switchNetworkAsync, isError } = useSwitchNetwork();
  const [networkStatusValue, setNetworkStatusValue] =
    useRecoilState(networkStatus);
  const [, setSelectedInToken] = useRecoilState(selectedInTokenStatus);
  const [, setSelectedOutToken] = useRecoilState(selectedOutTokenStatus);

  const tokenColorCode = useMemo(() => {
    switch (outToken?.tokenSymbol) {
      case "ETH":
        return "#627EEA";
      case "WETH":
        return "#393939";
      case "TON":
        return "#007AFF";
      case "WTON":
        return "#007AFF";
      case "TOS":
        return "#007AFF";
      case "DOC":
        return "#9e9e9e";
      case "AURA":
        return "#CB1000";
      case "LYDA":
        return "#4361EE";
      case "USDC":
        return "#2775CA";
      case "USDT":
        return "#50AF95";
      default:
        return "#9e9e9e";
    }
  }, [outToken]);

  const selectTokenClick = async () => {
    if (isConnected && !network.isSupportedChain) {
      const inValue: SupportedChainProperties["chainId"] = Number(ethChainId); // 'from' 값을 숫자로 변환
      const outValue: SupportedChainProperties["chainId"] = Number(ethChainId); // 'to' 값을 숫자로 변환

      const selectedInNetwork = supportedChain.filter((supportedChain) => {
        return supportedChain.chainId === inValue;
      })[0];

      const selectedOutNetwork = supportedChain.filter((supportedChain) => {
        return supportedChain.chainId === outValue;
      })[0];

      await switchNetworkAsync?.(inValue);

      // mode에 따라 다르게 한다.
      setNetworkStatusValue({
        inNetwork: selectedInNetwork,
        outNetwork: selectedOutNetwork,
      });

      setSelectedInToken(null);
      setSelectedOutToken(null);
      return;
    }
    swapSection && setTokenModal({ ...tokenModal, isOpen: "OUTPUT" });
    setMobileTokenOpen(true);
  };

  return (
    <Flex flexDir={"column"} w={"148px"} rowGap={"28px"}>
      <Box
        pos="relative"
        h={"184px"}
        cursor={"pointer"}
        onClick={() => {
          selectTokenClick();
        }}
      >
        {outToken?.tokenName ? (
          <>
            <TokenCard
              w={"100%"}
              h={"100%"}
              tokenInfo={outToken}
              hasInput={true}
              inNetwork={true}
              symbolSize={{ w: 64, h: 64 }}
              forBridge={true}
              isPrice
            />
          </>
        ) : (
          <Flex
            pos={"relative"}
            w={"148px"}
            h={"184px"}
            border={"2px dashed #313442"}
            rounded={"9px"}
            justify={"center"}
            align={"center"}
            rowGap={"8px"}
            flexDir={"column"}
          >
            {mode === "Deposit" ? (
              <Image alt="titan" src={TitanIcon} />
            ) : mode === "Withdraw" ? (
              <Image alt="eth" src={ETHIcon} />
            ) : (
              ""
            )}
            <Text fontSize={16} fontWeight={500}>
              {mode === "Deposit"
                ? "Titan"
                : mode === "Withdraw"
                ? "Ethereum"
                : "Select Token"}
            </Text>
          </Flex>
        )}
        {mode !== "Deposit" && mode !== "Withdraw" && (
          <Flex
            pos={"absolute"}
            top={"0px"}
            right={"0px"}
            w={"34px"}
            h={"34px"}
            borderRadius={"0px 9px 0px 9px"}
            bg={outToken?.tokenName ? tokenColorCode : "#2E3140"}
            justify={"center"}
            align={"center"}
          >
            <Flex w={"28px"} h={"28px"} borderRadius={"0px 6px 0px 6px"}>
              <Image
                alt="eth"
                src={
                  outNetwork?.chainId === 55004 || outNetwork?.chainId === 55007
                    ? TitanIcon
                    : ETHIcon
                }
              />
            </Flex>
          </Flex>
        )}
      </Box>
    </Flex>
  );
};

export default MobileInToken;
