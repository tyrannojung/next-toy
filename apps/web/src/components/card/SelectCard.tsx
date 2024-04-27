import { Box, Flex, Input, Text } from "@chakra-ui/react";
import { Modal, ModalOverlay, ModalContent, ModalBody } from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import useTokenModal from "@/hooks/modal/useTokenModal";
import { Field } from "@/types/swap/swap";
import { CardCarrousel } from "./CardCarousel";
import { Overlay_Index } from "@/types/style/overlayIndex";

import BgImage from "assets/image/BridgeSwap/selectTokenCardBg.svg";
import BgImageButton from "assets/image/BridgeSwap/selectTokenBg.svg";
import CloseIcon from "assets/icons/close.svg";

export function SelectCardButton(props: { field: Field }) {
  const { field } = props;
  const { onOpenInToken, onOpenOutToken } = useTokenModal();

  return (
    <Flex
      w={"562px"}
      h={"100px"}
      alignItems={"center"}
      justifyContent={"center"}
      cursor={"pointer"}
      onClick={() => (field === "INPUT" ? onOpenInToken() : onOpenOutToken())}
      pos={"relative"}
      // zIndex={Overlay_Index}
    >
      <Image
        src={BgImageButton}
        alt={"BgImageButton"}
        style={{ position: "absolute" }}
      />
      <Text
        color={"#FFFFFF"}
        fontSize={24}
        fontWeight={"semibold"}
        zIndex={100}
        mt={"10px"}
      >
        Select Token
      </Text>
    </Flex>
  );
}

const SearchToken = () => {
  const { onCloseTokenModal } = useTokenModal();
  const ref = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState<string>("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = e.target.value;
    setSearchValue(value);
  };

  return (
    <Flex
      w={"100%"}
      justifyContent={"center"}
      pos={"relative"}
      zIndex={Overlay_Index.BelowHeader}
      border={"1px solid transparent"}
      rounded={{ base: "8px", lg: "21.5px" }}
      bgColor={{ base: "#0F0F12", lg: "transparent" }}
    >
      <Input
        w={{ base: "100%", lg: "430px" }}
        h={"42px"}
        borderRadius={{ base: "8px", lg: "21.5px" }}
        placeholder={"Search token name or address"}
        _placeholder={{ color: "#8E8E92", fontWeight: 500 }}
        boxShadow={"none !important"}
        border={{}}
        bgColor={"#0F0F12"}
        _focus={{}}
        _active={{}}
        onChange={onChange}
        ref={ref}
        value={searchValue}
      ></Input>
      <Box pos={"absolute"} right={"69px"}>
        <Image
          src={CloseIcon}
          alt={"close"}
          style={{ cursor: "pointer" }}
          onClick={() => onCloseTokenModal()}
        />
      </Box>
    </Flex>
  );
};

export function SelectCardModal() {
  const { isInTokenOpen, isOutTokenOpen, onCloseTokenModal } = useTokenModal();

  //close when click at outside
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (event.target.id === "out-area") {
        return onCloseTokenModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Modal
      isOpen={isInTokenOpen || isOutTokenOpen}
      // isOpen={false}
      onClose={onCloseTokenModal}
    >
      <ModalOverlay />
      <ModalContent
        minW={"100%"}
        maxW={"100%"}
        h={{
          base: "calc(100% - 60px)",
          lg: "100%",
        }}
        m={{ base: "none", lg: 0 }}
        mb={0}
        mt={"auto"}
        // mb={0}
        p={0}
        pb={{ base: "0px" }}
        bg={{ base: "#1F2128", lg: "transparent" }}
        overflow={"hidden"}
        borderRadius={"24px 24px 0px 0px"}
      >
        <ModalBody
          minW={"100%"}
          maxW={"100%"}
          p={0}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"end"}
          bg={"transparent"}
          id="out-area"
          zIndex={1}
        >
          <Flex
            w={"1362px"}
            h={{ base: "100%", lg: "486px" }}
            bgColor={{ base: "#1F2128", lg: "transparent" }}
            padding={{ base: "16px 10px 0px 10px", lg: 0 }}
            // borderRadius={"150px 150px 0px 0px"}
            rowGap={"13px"}
            flexDir={"column"}
            alignItems={"center"}
            backgroundImage={BgImage}
            zIndex={100}
            overflow={{ base: "hidden" }}
            mb={{ base: "auto", lg: "0" }}
          >
            <Flex pos={"absolute"}>
              <Image
                src={BgImage}
                alt={"CloseIcon"}
                style={{
                  minWidth: "1362px",
                  width: "1362px",
                  minHeight: "486px",
                  height: "486px",
                }}
              ></Image>
            </Flex>
            <CardCarrousel />
            <SearchToken />
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
