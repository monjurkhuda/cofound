import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import StartupList from "../search/StartupList";
import Navigation from "../navigation/Navigation";
import Profile from "../userprofile/Profile";
import firebaseApp from "../firebase";
import {
  Text,
  Flex,
  Button,
  Table,
  Tbody,
  Tr,
  Th,
  Stack,
  Select,
} from "@chakra-ui/react";
import { IoPeopleOutline } from "react-icons/io5";
import { BiBuildingHouse } from "react-icons/bi";
import { Link } from "react-router-dom";
import "./SearchHover.css";

function SearchStartups() {
  const [availablePos, setAvailablePos] = useState("wantany");
  const [timezone, setTimezone] = useState("USA");
  const [startupFilteredArray, setStartupFilteredArray] = useState([]);
  const [lowerRange, setLowerRange] = useState(0);
  const [higherRange, setHigherRange] = useState(5);
  const [showPaginationButtons, setShowPaginationButtons] = useState(false);

  const senderid = firebaseApp.auth().currentUser.uid;
  const db = firebaseApp.database();
  const startupRef = db.ref("startups/");
  const currentUserRef = db.ref("users/" + senderid);
  let startupArray = [];

  let history = useHistory();
  const [currentUsername, setCurrentUsername] = useState("");

  useEffect(() => {
    currentUserRef.once("value", (snapshot) => {
      setCurrentUsername(snapshot.val()?.username);
    });
  }, [currentUsername]);

  if (currentUsername === undefined) {
    history.push("/createprofile");
  }

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

    setShowPaginationButtons(true);
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
        <Flex direction="column" p={6} w="100%">
          <Stack spacing={[1, 3]} direction={["column", "row"]} wrap="wrap">
            <Flex alignItems="center">
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
            </Flex>

            <Flex alignItems="center">
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
                w="fit-content"
              >
                🔍
              </Button>
            </Flex>
          </Stack>

          <Flex mt={3} justifyContent="flex-end">
            {lowerRange !== 0 ? (
              <Button
                backgroundColor="white"
                boxShadow="base"
                size="xs"
                onClick={() => {
                  setHigherRange(higherRange - 5);
                  setLowerRange(lowerRange - 5);
                }}
              >
                {"<"}
              </Button>
            ) : (
              <></>
            )}

            {showPaginationButtons ? (
              <Button
                ml={3}
                backgroundColor="white"
                boxShadow="base"
                size="xs"
                onClick={() => {
                  setHigherRange(higherRange + 5);
                  setLowerRange(lowerRange + 5);
                }}
              >
                {">"}
              </Button>
            ) : (
              <></>
            )}
          </Flex>

          <Table
            variant="simple"
            backgroundColor="white"
            size="md"
            mt={3}
            boxShadow="base"
            w={["85vw", "85vw", "90vw", "60vw"]}
          >
            <Tbody>
              <Tr borderBottom="1px" borderColor="gray.100">
                <Flex>
                  <Flex
                    ml={2}
                    mt={1}
                    mr={10}
                    pl={4}
                    pb={4}
                    pt={2}
                    pr={4}
                    borderBottom="4px"
                    borderBottomColor="yellow.500"
                    alignItems="center"
                    color="yellow.500"
                  >
                    <BiBuildingHouse size={20} />
                    <Text fontSize={16} ml={2} fontWeight="600">
                      Startups
                    </Text>
                  </Flex>

                  <Link to="/searchfounders">
                    <Flex
                      className="inactive"
                      ml={1}
                      mt={1}
                      mr={10}
                      pl={2}
                      pb={4}
                      pt={2}
                      pr={4}
                      alignItems="center"
                      color="gray.400"
                    >
                      <IoPeopleOutline size={20} />
                      <Text fontSize={16} ml={2} fontWeight="600">
                        Founders
                      </Text>
                    </Flex>
                  </Link>
                </Flex>
              </Tr>
              <Tr backgroundColor="gray.50">
                <Th>Startups</Th>
              </Tr>
              {startupFilteredArray
                .slice(lowerRange, higherRange)
                .map((startupid) => {
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
