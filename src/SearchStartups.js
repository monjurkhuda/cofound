import React, { useState } from "react";
import StartupList from "./StartupList";
import Navigation from "./Navigation";
import Profile from "./Profile";
import firebaseApp from "./firebase";
import {
  Input,
  Box,
  Text,
  Flex,
  Button,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  Icon,
  Heading,
  Select,
} from "@chakra-ui/react";
import { VscRocket } from "react-icons/vsc";
import { AiOutlineSearch } from "react-icons/ai";
import { HiSearchCircle } from "react-icons/hi";
import { Link } from "react-router-dom";

function SearchStartups() {
  const [startupname, setStartupname] = useState("");
  const [availablePos, setAvailablePos] = useState("wantany");
  const [timezone, setTimezone] = useState("USA");
  const [startupFilteredArray, setStartupFilteredArray] = useState([]);

  const senderid = firebaseApp.auth().currentUser.uid;
  const db = firebaseApp.database();
  const startupRef = db.ref("startups/");
  let startupArray = [];

  function searchHandler(e) {
    e.preventDefault();
    setStartupFilteredArray([""]);

    startupRef
      .orderByChild(availablePos)
      .equalTo("yes")
      .on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          if (childSnapshot.val().timezone === timezone) {
            startupArray.push(childSnapshot.key);
          }
        });
        setStartupFilteredArray(startupArray);
      });
  }

  return (
    <Flex
      flexDir="column"
      justifyItems="center"
      h="100vh"
      backgroundColor="gray.200"
    >
      <Navigation />
      <Flex flexDir="row">
        <Flex>
          <Profile />
        </Flex>
        <Flex direction="column" p={6} w="90%">
          <Flex alignItems="center" maxWidth="60vw">
            <Text fontSize="sm" color="gray.400" fontWeight="600">
              Location:
            </Text>
            <Select
              ml={2}
              boxShadow="base"
              backgroundColor="white"
              onChange={(e) => setTimezone(e.target.value)}
            >
              <option defaultValue value="USA">
                USA
              </option>
              <option value="EU">EU</option>
              <option value="IND">IND</option>
              <option value="AFR">AFR</option>
            </Select>
            <Text ml={2} fontSize="sm" color="gray.400" fontWeight="600">
              Hiring:
            </Text>
            <Select
              ml={2}
              boxShadow="base"
              backgroundColor="white"
              onChange={(e) => setAvailablePos(e.target.value)}
            >
              <option defaultValue value="wantany">
                Any Position
              </option>
              <option value="wanttech">Tech</option>
              <option value="wantbiz">Biz</option>
              <option value="wantsales">Sales</option>
              <option value="wanthr">HR</option>
            </Select>
            <Button
              ml={4}
              backgroundColor="white"
              boxShadow="base"
              onClick={searchHandler}
            >
              🔍
            </Button>
          </Flex>

          <Table
            variant="simple"
            backgroundColor="white"
            size="md"
            mt={5}
            boxShadow="base"
            maxWidth="60vw"
          >
            <Tbody>
              <Tr borderBottom="1px" borderColor="gray.100">
                <Flex>
                  <Flex
                    ml={8}
                    mt={1}
                    width="fit-content"
                    borderBottom="2px"
                    borderBottomColor="blue.100"
                    alignItems="center"
                  >
                    <AiOutlineSearch size={20} />
                    <Text fontSize={20} fontWeight="600">
                      Startups
                    </Text>
                  </Flex>
                  <Flex
                    className="search__option"
                    ml={8}
                    mt={1}
                    width="fit-content"
                    alignItems="center"
                  >
                    <AiOutlineSearch size={20} />
                    <Link to="/searchfounders">
                      <Text fontSize={20} fontWeight="600">
                        Founders
                      </Text>
                    </Link>
                  </Flex>
                </Flex>
              </Tr>
              <Tr backgroundColor="gray.50">
                <Th>Latest Startups</Th>
              </Tr>
              {startupFilteredArray.map((startupid) => {
                return (
                  <StartupList
                    key={startupid}
                    senderid={senderid}
                    startupid={startupid}
                  />
                );
              })}
            </Tbody>
          </Table>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default SearchStartups;
