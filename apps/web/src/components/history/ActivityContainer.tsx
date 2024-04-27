import { Flex, Text, Button, Spinner } from "@chakra-ui/react";
import WithdrawTx from "./WithdrawTx";
import DepositTx from "./DepositTx";
import DepositTxMobile from "./DepositTxMobile";
import { useEffect, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import { searchTxStatus } from "@/recoil/userHistory/searchTx";
import LoadingTx from "./LoadingTx";
import noActivityIcon from "assets/icons/accountHistory/noActivityIcon.svg";
import Image from "next/image";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { FullWithTx, FullDepTx } from "@/types/activity/history";
import { fetchUserTransactions } from "@/components/history/utils/fetchUserTransactions";
import useConnectedNetwork from "@/hooks/network";
import { useAccount } from "wagmi";
import { L1TxType } from "@/types/activity/history";
import HalfLoadingTx from "./HalfLoadingTx";
import useGetTransaction from "@/hooks/user/useGetTransaction";
import { useRef } from "react";
import useMediaView from "@/hooks/mediaView/useMediaView";

type ChainName = "MAINNET" | "TITAN" | undefined;

type SelectOption = {
  chainId: number;
  chainName: ChainName;
  networkImage: any;
};

export default function ActivityContainer(props: { network: SelectOption }) {
  const { network } = props;
  const { isConnectedToMainNetwork } = useConnectedNetwork();
  const { address } = useAccount();
  const [preLoadData, setPreLoadData] = useState<L1TxType[]>([]);
  const [numData, setNumData] = useState(2);
  const searchTxString = useRecoilValue(searchTxStatus);
  const tData = useGetTransaction();
  const ref = useRef<HTMLDivElement | null>(null);
  const { mobileView } = useMediaView();

  useEffect(() => {
    const updateNumData = () => {
      if (ref?.current) {
        const height = ref?.current?.offsetHeight;
        if (height !== undefined) {
          const numTxs = parseInt((height / 160).toString());
          setNumData(numTxs);
        }
      }
    };
    updateNumData();
    const handleResize = () => {
      updateNumData();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [ref?.current]);

  //get the data from the subgraphs to show as initial data until the proper data is loaded in the useGetTransactions hook
  //sets the preloaded data
  useEffect(() => {
    const getTxs = async () => {
      if (isConnectedToMainNetwork !== undefined) {
        const txs = await fetchUserTransactions(
          address,
          isConnectedToMainNetwork
        );

        const depTx = txs?.formattedL1DepositResults.map((tx: any) => {
          return {
            ...tx,
            event: "deposit",
          };
        });

        const wthTx = txs?.formattedL1WithdrawResults.map((tx: any) => {
          return {
            ...tx,
            event: "withdraw",
          };
        });

        const allTxs = depTx
          .concat(wthTx)
          .sort(
            (tx1: L1TxType, tx2: L1TxType) =>
              Number(tx2.blockTimestamp) - Number(tx1.blockTimestamp)
          );

        setPreLoadData(allTxs);
      }
    };

    getTxs();
  }, [isConnectedToMainNetwork, address]);

  //used to filter the data for the search string
  const filteredTx = useMemo(() => {
    if (searchTxString?.id === "" || searchTxString === null) {
      return tData.depositTxs.length > 0 ? tData.depositTxs : preLoadData;
    } else {
      if (tData.depositTxs.length > 0) {
        const filteredTx = tData.depositTxs.filter(
          (tx: FullDepTx | FullWithTx) => {
            if (tx !== undefined) {
              if (tx.l1txHash && tx.l2txHash === undefined)
                return tx.l1txHash.includes(searchTxString.id);
              if (tx.l2txHash && tx.l1txHash === undefined)
                return tx.l2txHash.includes(searchTxString.id);
              if (tx.l2txHash && tx.l1txHash)
                return (
                  tx.l1txHash.includes(searchTxString.id) ||
                  tx.l2txHash.includes(searchTxString.id)
                );
            }
          }
        );

        return filteredTx;
      } else {
        return preLoadData;
      }
    }
  }, [
    address,
    searchTxString,
    preLoadData,
    tData.depositTxs,
    tData.loadingState,
  ]);

  const getLayerFiltered = useMemo(() => {
    const depSelected = network.chainId === SupportedChainId["MAINNET"];
    const withSelected = network.chainId === SupportedChainId["TITAN"];

    const allSelected = network.chainId === undefined;
    if (depSelected === true) {
      const txs = filteredTx.filter(
        (tx: FullDepTx) => tx !== undefined && tx.event === "deposit"
      );
      return txs;
    }
    if (withSelected === true) {
      const txs = filteredTx.filter(
        (tx: FullWithTx) => tx !== undefined && tx.event === "withdraw"
      );
      return txs;
    } else {
      return filteredTx;
    }
  }, [searchTxString, filteredTx, network, tData]);

  //creates the pagination array from the filtered txs
  const getPaginatedData = useMemo(() => {
    const startIndex = 0;
    const endIndex = startIndex + numData;
    return getLayerFiltered.slice(startIndex, endIndex);
  }, [getLayerFiltered, tData, filteredTx]);

  //returns the appropriate component depending on the loading status of the data from the hook
  const txes = useMemo(() => {
    switch (tData.loadingState) {
      case "absent":
        return (
          <Flex
            w="100%"
            h={"100%"}
            justifyContent={"center"}
            alignItems={"center"}
            flexDir={"column"}
          >
            <Image
              alt="noActivityIcon"
              src={noActivityIcon}
              height={75}
              width={60}
            />
            <Text
              color={"#e3f3ff"}
              fontWeight={500}
              fontSize={"16px"}
              mt="24px"
            >
              No activity yet
            </Text>
            <Text
              color={"#7B7F8F"}
              fontWeight={400}
              fontSize={"11px"}
              mt="7px"
              w="191px"
            >
              Your onchain transactions and crypto purchases will appear here.
            </Text>
          </Flex>
        );

      case "present":
        return (
          // getPaginatedData.length !== 0 &&
          tData.depositTxs.map((tx: any, index: number) => {
            if (tx.event === "deposit") {
              return mobileView ? (
                <DepositTxMobile tx={tx} key={tx.transactionHash} />
              ) : (
                <DepositTx tx={tx} key={tx.transactionHash} />
              );
            } else {
              return <WithdrawTx tx={tx} key={index} />;
            }
          })
        );

      case "loading":
        if (tData.depositTxs.length > 0) {
          return (
            // getPaginatedData.length !== 0 &&
            tData.depositTxs.map((tx: any) => {
              return <HalfLoadingTx tx={tx} key={tx.transactionHash} />;
            })
          );
        } else {
          return (
            <Flex flexDir={"column"} rowGap={"8px"}>
              <LoadingTx />
              <LoadingTx />
              <LoadingTx />
              <LoadingTx />
            </Flex>
          );
        }
    }
  }, [getPaginatedData, tData]);

  return (
    <Flex
      flexDir={"column"}
      justifyContent={"space-between"}
      h={"calc(100% - 20px)"}
      bg={"transparent"}
      w="100%"
    >
      <Flex
        ref={ref}
        id={"tx-history"}
        flexDir={"column"}
        bg={"transparent"}
        overflow={"scroll"}
        overflowX={"hidden"}
        rowGap={"8px"}
        h={"calc(100vh - 140px)"}
        css={{
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "::-webkit-scrollbar-track": {
            background: "transparent",
            borderRadius: "4px",
          },
          "::-webkit-scrollbar-thumb": {
            background: "#343741",
            borderRadius: "3px",
          },
        }}
      >
        {txes}
      </Flex>
      {/* {getLayerFiltered.length > getPaginatedData.length &&
        tData.loadingState === "present" && (
          <Flex
            my={{ base:"16px", lg: "32px" }}
            justifyContent={"center"}
            alignItems={"start"}
          >
            <Button
              bg="transparent"
              border={"1px solid #313442"}
              fontSize={"12px"}
              color={"#fff"}
              fontWeight={500}
              _hover={{}}
              _active={{}}
              onClick={() => setNumData(numData + 2)}
            >
              Load more
            </Button>
          </Flex>
        )} */}
    </Flex>
  );
}
