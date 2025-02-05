import {
  Box,
  Center,
  Divider,
  Flex,
  Heading,
  HStack,
  Link,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { ethers, utils } from "ethers";
import React from "react";
import { Link as ReactLink } from "react-router-dom";
import { BlockProgress } from "../components/BlockProgress";
import { Card } from "../components/Card";
import { FirePit } from "../components/FirePit";
import { Footer } from "../components/Footer";
import { Loader } from "../components/Loader";
import { EthereumNetwork } from "../components/Network";
import {
  BurnedBlockTransaction,
  useBlockExplorer,
} from "../contexts/BlockExplorerContext";
import { timeSince } from "../utils/time";

interface BlockItemProps {
  number: number;
  timestamp: number;
  weiBurned: string;
  weiBaseFee: string;
  gasLimit: ethers.BigNumber;
  gasUsed: ethers.BigNumber;
}

function BlockItem(props: BlockItemProps) {
  const weiBurned = utils.formatUnits(props.weiBurned, "gwei");

  const label = (<Text>Burned: {props.weiBurned} wei<br />Base Fee: {props.weiBaseFee} wei<br />Gas used: {(props.gasUsed.toNumber() / props.gasLimit.toNumber() * 100).toFixed(2)}%</Text>)

  return (
    <HStack m="2">
      <Flex flex="1" align="flex-start" direction="column">
        <Box><Link as={ReactLink} to={`/block/${props.number}`}>Block {props.number}</Link></Box>
        <Box fontSize="14px" mt="0" color="brand.secondaryText">
          {timeSince(props.timestamp)}
        </Box>
      </Flex>
      <HStack
        bg="brand.subheaderCard"
        pl="4"
        pr="4"
        pt="2"
        pb="2"
        rounded="full"
        align="center"
      >
        <FirePit size="12px" />
        <Box w="70px"><Tooltip hasArrow label={label} placement="right">{weiBurned}</Tooltip></Box>
      </HStack>
    </HStack>
  );
}

interface CurrentBlockProps {
  block: BurnedBlockTransaction;
}

function CurrentBlock(props: CurrentBlockProps) {
  return (
    <HStack m="2">
      <Flex flex="1" align="flex-start" direction="column">
        <Box>Block {props.block.number + 1}</Box>
        <Box fontSize="14px" mt="0" color="brand.secondaryText">
          pending
        </Box>
      </Flex>
      <HStack
        bg="brand.subheaderCard"
        pl="4"
        pr="4"
        pt="2"
        pb="2"
        rounded="full"
        align="center"
      >
        <BlockProgress
          totalSecondsPerBlock={30}
          block={props.block}
          w="90px"
          h="24px"
          colorScheme="red"
          bg="brand.background"
          isAnimated
          hasStripe={true}
          rounded="full"
        />
      </HStack>
    </HStack>
  );
}

export function Home() {
  const { details, blocks, session } = useBlockExplorer();

  if (!details) return <Loader>Loading block details ...</Loader>;

  if (!blocks) return <Loader>Loading blocks ...</Loader>;

  if (!session) return <Loader>Loading session ...</Loader>;

  const totalBurnedSplitter = details.totalBurned.indexOf(".");
  const totalBurnedWholeNumber = utils.commify(
    details.totalBurned.substr(0, totalBurnedSplitter)
  );
  const totalBurnedDecimalNumber = details.totalBurned.substr(
    totalBurnedSplitter + 1
  );

  const latestBlock = blocks[0];
  const renderedBlocks = blocks.slice(0, 5)

  return (
    <Center
      display="fixed"
      t="0"
      l="0"
      w="100%"
      h="100%"
      bg="brand.background"
      overflowY="auto"
    >
      <VStack zIndex={2} color="brand.primaryText" w={["95%", "90%", "700px"]} pb="100">
        <Box mb={"4"} textAlign="center">
          <Heading>Watch The Burn</Heading>
          <Text>Ethereum's EIP-1559</Text>
          <EthereumNetwork />
        </Box>
        <Card
          bg="brand.card"
          zIndex={2}
          p="4"
          w="100%"
          textAlign="center"
        >
          <Heading size="sm" color="brand.headerText">
            Total Fees Burned
          </Heading>
          <HStack
            alignItems="baseline"
            overflow="hidden"
            wordBreak="break-all"
            whiteSpace="nowrap"
            justify="center"
          >
            <Text fontSize={["42px", "60px", "100px"]} fontWeight="bold">
              {totalBurnedWholeNumber}.
            </Text>
            <Text fontSize={["18px", "22px", "32px"]}>
              {totalBurnedDecimalNumber}
            </Text>
            <Text fontSize={["18px", "22px", "32px"]} color="orangered">
              ETH
            </Text>
          </HStack>
        </Card>
        <Card>
          <Heading size="sm" textAlign="center" color="brand.headerText">
            Session Summary
          </Heading>
          <Text color="brand.secondaryText" textAlign="center" mt="2">You've just experienced <strong>{utils.formatEther(session.burned)} ETH</strong> being burned by observing <strong>{session.blockCount} blocks</strong> that contain <strong>{session.transactionCount} transactions</strong> with <strong>{utils.formatEther(session.rewards)} ETH</strong> rewards!</Text>
        </Card>
        <Card bg="brand.card" zIndex={2} p="4" w="100%">
          <Heading size="sm" textAlign="center" color="brand.headerText">
            Latest Blocks
          </Heading>
          <CurrentBlock block={latestBlock} />
          <Divider
            bg="brand.card"
            borderColor="brand.card"
          />
          {renderedBlocks.map((block, idx) => (
            <BlockItem key={idx} {...block} />
          ))}
        </Card>
        <Link
          as={ReactLink}
          to="/blocks"
          mt="4"
          textAlign="center"
          zIndex={2}
        >
          View all blocks
        </Link>
        <Footer />
      </VStack>
      <FirePit
        size="80px"
        position="fixed"
        bottom="0"
        sparkCount={12}
        zIndex={1}
      />
    </Center>
  );
}
