import { Flex, Text } from "@chakra-ui/react";
import { getUnixTime, intervalToDuration, getTime } from "date-fns";
import { useState, useEffect } from "react";
import Image from "next/image";
import { confirmWithdrawData } from "@/recoil/modal/atom";
import { useRecoilState, useRecoilValue } from "recoil";

const Step3 = (props: { progress: string; timeStamp: number; check: any }) => {
  const [withdraw, setWithdraw] = useRecoilState(confirmWithdrawData);

  const { progress, timeStamp, check } = props;
  const tx = withdraw.modalData;

  const [duration, setDuration] = useState<Duration>({
    days: 0,
    hours: 0,
    minutes: 0,
    months: 0,
    seconds: 0,
    years: 0,
  });

  useEffect(() => {
    if (props.timeStamp) {
      const intervalID = setInterval(() => {
        const nowTime = getUnixTime(new Date());

        if (nowTime > props.timeStamp) {
          setDuration({
            days: 0,
            hours: 0,
            minutes: 0,
            months: 0,
            seconds: 0,
            years: 0,
          });
        } else {
          setDuration(
            intervalToDuration({
              start: getTime(props.timeStamp * 1000),
              end: getTime(nowTime * 1000),
            })
          );
        }
      }, 1000);
      return () => clearInterval(intervalID);
    }
  }, [props.timeStamp]);

  return (
    <Flex
      h="36px"
      justifyContent={"space-between"}
      alignItems={"center"}
      // border={"1px solid red"}
      w="100%"
    >
      <Flex>
        <Image src={check.check} alt="check" />
        <Text ml="8px" fontSize={"14px"} color={check.color}>
          Wait 7 days
        </Text>
      </Flex>
      {tx && props.progress === "inProgress" && (
        <Flex>
          <Text mr="6px" fontSize={"14px"} color={check.color}>
            {" "}
            {duration.days !== undefined && duration.days < 10 ? "0" : ""}
            {duration.days}:
            {duration.hours !== undefined && duration.hours < 10 ? "0" : ""}
            {duration.hours}:
            {duration.minutes !== undefined && duration.minutes < 10 ? "0" : ""}
            {duration.minutes}:
            {duration.seconds !== undefined && duration.seconds < 10 ? "0" : ""}
            {duration.seconds} Left
          </Text>
        </Flex>
      )}
    </Flex>
  );
};

export default Step3;
