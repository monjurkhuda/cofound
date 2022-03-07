import React, { useState } from "react";
import UserList from "../search/UserList";
import Navigation from "../navigation/Navigation";
import firebaseApp from "../firebase";
import Profile from "../userprofile/Profile";
import {
  Input,
  Text,
  Flex,
  Button,
  Table,
  Tbody,
  Select,
  Tr,
  Th,
  Stack,
} from "@chakra-ui/react";
import { IoPeopleOutline } from "react-icons/io5";
import { BiBuildingHouse } from "react-icons/bi";
import { Link } from "react-router-dom";

function SearchPlayers() {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("tech");
  const [yoe, setYoe] = useState(0);
  const [timezone, setTimezone] = useState("USA");
  const [userFilteredArray, setUserFilteredArray] = useState([]);
  const [lowerRange, setLowerRange] = useState(0);
  const [higherRange, setHigherRange] = useState(5);
  const [showPaginationButtons, setShowPaginationButtons] = useState(false);

  const senderid = firebaseApp.auth().currentUser.uid;
  const db = firebaseApp.database();
  const userRef = db.ref("users/");
  let userArray = [];

  function searchHandler(e) {
    e.preventDefault();

    userRef
      .orderByChild("role")
      .equalTo(role)
      .on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          if (
            Number(childSnapshot.val().yoe) >= Number(yoe) &&
            childSnapshot.val().timezone === timezone
          ) {
            userArray.push(childSnapshot.key);
          }
        });
        setUserFilteredArray(userArray);
      });

    setShowPaginationButtons(true);
  }

  function searchByUsername(e) {
    e.preventDefault();

    userRef
      .orderByChild("username")
      .equalTo(username)
      .on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          userArray.push(childSnapshot.key);
        });
        setUserFilteredArray(userArray);
      });
  }

  return (
    <Flex
      flexDir="column"
      justifyItems="center"
      h="100%"
      minHeight="100vh"
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
                Role
              </Text>
              <Select
                ml={2}
                boxShadow="base"
                backgroundColor="white"
                onChange={(e) => setRole(e.target.value)}
              >
                <option defaultValue value="tech">
                  Tech
                </option>
                <option value="biz">Biz</option>
                <option value="sales">Sales</option>
                <option value="hr">HR</option>
              </Select>
            </Flex>

            <Flex alignItems="center">
              <Text ml={2} fontSize="sm" color="gray.400" fontWeight="600">
                Location
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
                YOE
              </Text>
              <Select
                ml={2}
                boxShadow="base"
                backgroundColor="white"
                value={yoe}
                onChange={(e) => setYoe(e.target.value)}
              >
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">10+</option>
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

          <Stack
            mt={4}
            spacing={[1, 3]}
            direction={["column", "row"]}
            wrap="wrap"
          >
            <Flex alignItems="center">
              <Text fontSize="sm" color="gray.400" fontWeight="600">
                Username
              </Text>
              <Input
                ml={2}
                boxShadow="base"
                backgroundColor="white"
                placeholder="EXACT Username..."
                onChange={(e) => setUsername(e.target.value)}
              ></Input>

              <Button
                ml={4}
                backgroundColor="white"
                boxShadow="base"
                onClick={searchByUsername}
                w="fit-content"
              >
                🔍user
              </Button>
            </Flex>
          </Stack>

          <Flex
            mt={3}
            justifyContent="flex-end"
            w={["85vw", "85vw", "90vw", "60vw"]}
          >
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
            mt={5}
            boxShadow="base"
            w={["85vw", "85vw", "90vw", "60vw"]}
          >
            <Tbody>
              <Tr borderBottom="1px" borderColor="gray.100">
                <Flex>
                  <Link to="/searchstartups">
                    <Flex
                      className="inactive"
                      ml={2}
                      mt={1}
                      mr={10}
                      pl={4}
                      pb={4}
                      pt={2}
                      pr={4}
                      alignItems="center"
                      color="gray.400"
                    >
                      <BiBuildingHouse size={20} />

                      <Text fontSize={16} ml={2} fontWeight="600">
                        Startups
                      </Text>
                    </Flex>
                  </Link>

                  <Flex
                    className="active"
                    ml={2}
                    mt={1}
                    mr={10}
                    pl={2}
                    pb={4}
                    pt={2}
                    pr={4}
                    borderBottom="4px"
                    borderBottomColor="purple.400"
                    alignItems="center"
                    color="purple.400"
                  >
                    <IoPeopleOutline size={20} />

                    <Text fontSize={16} ml={2} fontWeight="600">
                      Founders
                    </Text>
                  </Flex>
                </Flex>
              </Tr>
              <Tr backgroundColor="gray.50">
                <Th>Founders</Th>
              </Tr>
              {userFilteredArray
                .slice(lowerRange, higherRange)
                .map((userid) => {
                  return (
                    <UserList
                      key={userid}
                      userid={userid}
                      senderid={senderid}
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

export default SearchPlayers;
