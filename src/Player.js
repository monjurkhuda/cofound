import React, { useState, useEffect } from "react";
import {
  ChakraProvider,
  Box,
  Flex,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
  Avatar,
  Select,
} from "@chakra-ui/react";

export default function Player({ playerDetails }) {
  const [playerClicked, setPlayerClicked] = useState(false);

  useEffect(() => {}, [playerClicked]);

  return (
    <Flex
      direction="column"
      alignItems="center"
      ml={1}
      mr={1}
      onClick={() => setPlayerClicked(!playerClicked)}
      position={"relative"}
    >
      <Avatar
        size="md"
        boxShadow="base"
        src={playerDetails ? playerDetails.photo : ""}
      />
      <Flex
        mt={-1}
        zIndex={1}
        backgroundColor="white"
        boxShadow="base"
        p={1}
        borderRadius={6}
      >
        <Text fontSize="x-small" fontWeight="600">
          {playerDetails ? playerDetails.name : "Pick"}
        </Text>
      </Flex>
      <Flex
        hidden={!playerClicked}
        zIndex={2}
        backgroundColor="white"
        boxShadow="base"
        p={1}
        borderRadius={6}
        position={"absolute"}
        marginTop={14}
      >
        <Text>Hogaaa</Text>
      </Flex>
    </Flex>
  );
}
