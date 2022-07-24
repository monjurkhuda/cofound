import React, { useEffect, useState } from "react";
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
  HStack,
  Button,
} from "@chakra-ui/react";
import Player from "./Player";
import firebaseApp from "./firebase.js";
import CFLineup from "./CFLineup";

const db = firebaseApp.database();
const homeTeamRef = db.ref("teams/-N3mKTbNRplhnHSdkyQO");

function App() {
  const [formation, setFormation] = useState("");

  useEffect(() => {
    homeTeamRef.once("value", (snapshot) => {
      setFormation(snapshot.val().formation);
    });
  }, []);

  function editHomeTeam(e) {
    e.preventDefault();
    homeTeamRef.update({
      formation: formation,
    });
  }

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl" backgroundColor="green.500">
        <Grid minH="100vh" p={2}>
          <VStack spacing={2}>
            <Flex>
              <Select
                backgroundColor="white"
                value={formation}
                onChange={(e) => setFormation(e.target.value)}
              >
                <option value="433">4-3-3</option>
                <option value="442">4-4-2</option>
                <option value="352">3-5-2</option>
              </Select>
              <Button ml={1} onClick={(e) => editHomeTeam(e)}>
                Confirm
              </Button>
            </Flex>
            <CFLineup formation={formation} />
            <Flex w="100%" justifyContent="space-between">
              <Player /> <Player /> <Player />
            </Flex>
            <Flex w="100%" justifyContent="space-between">
              <Player /> <Player /> <Player /> <Player />
            </Flex>
            <Flex w="100%" justifyContent="center">
              <Player />
            </Flex>
            <Flex w="100%" justifyContent="space-between">
              <Player /> <Player />
            </Flex>
            <Flex w="100%" justifyContent="center">
              <Player /> <Player /> <Player />
            </Flex>
            <Flex w="100%" justifyContent="center">
              <Player />
            </Flex>
          </VStack>
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default App;
