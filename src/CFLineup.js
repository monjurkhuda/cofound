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
import firebaseApp from "./firebase";

const db = firebaseApp.database();
const homeTeamRef = db.ref("teams/-N3mKTbNRplhnHSdkyQO");

function CFLineup(props) {
  const [CFOne, setCFOne] = useState("");
  const [CFTwo, setCFTwo] = useState("");

  const twoCFFormations = new Set(["442", "41212", "352", "532"]);
  const oneCFFormations = new Set(["433", "4141", "4411", "4231", "343"]);

  useEffect(() => {
    homeTeamRef.once("value", (snapshot) => {
      let CFOneId = snapshot.val().CF[1];
      let CFTwoId = snapshot.val().CF[2];

      const CFOneRef = db.ref(`players/${CFOneId}`);
      const CFTwoRef = db.ref(`players/${CFTwoId}`);

      CFOneRef.once("value", (snapshot) => {
        setCFOne(snapshot.val());
      });

      CFTwoRef.once("value", (snapshot) => {
        setCFTwo(snapshot.val());
      });
    });
  }, []);

  console.log(CFOne);

  return twoCFFormations.has(props.formation) ? (
    <Flex w="100%" justifyContent="center">
      <Player playerDetails={CFOne} />
      <Player playerDetails={CFTwo} />
    </Flex>
  ) : (
    <Flex w="100%" justifyContent="center">
      <Player playerDetails={CFOne} />
    </Flex>
  );
}

export default CFLineup;
