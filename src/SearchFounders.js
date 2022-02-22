import React, { useState } from "react";
import UserList from "./UserList";
import Navigation from "./Navigation";
import firebaseApp from "./firebase";
import Profile from "./Profile";
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
  Select,
  Tr,
  Th,
  Td,
  TableCaption,
  Icon,
  Heading,
} from "@chakra-ui/react";

import "./List.css";
import { VscRocket } from "react-icons/vsc";
import { AiOutlineSearch } from "react-icons/ai";
import { HiSearchCircle } from "react-icons/hi";
import { Link } from "react-router-dom";

function SearchPlayers() {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("tech");
  const [yoe, setYoe] = useState(0);
  const [timezone, setTimezone] = useState("USA");
  const [redditusername, setRedditusername] = useState("");
  const [startupid, setStartupid] = useState("");
  const [userFilteredArray, setUserFilteredArray] = useState([]);

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
            >
              🔍
            </Button>
          </Flex>

          <Flex alignItems="center" maxWidth="40vw" mt={4}>
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
                    className="search__option"
                    ml={8}
                    mt={1}
                    width="fit-content"
                    alignItems="center"
                  >
                    <AiOutlineSearch size={20} />
                    <Link to="/searchstartups">
                      <Text fontSize={20} fontWeight="600">
                        Startups
                      </Text>
                    </Link>
                  </Flex>
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
                      Founders
                    </Text>
                  </Flex>
                </Flex>
              </Tr>
              <Tr backgroundColor="gray.50">
                <Th>Founders</Th>
              </Tr>
              {userFilteredArray.map((userid) => {
                return (
                  <UserList key={userid} userid={userid} senderid={senderid} />
                );
              })}
            </Tbody>
          </Table>
        </Flex>
      </Flex>
    </Flex>

    // <Flex flexDir="column" h="100vh" backgroundColor="gray.200">
    //   <Navigation />
    //   <Flex flexDir="row">
    //     <Flex w="30%">
    //       <Profile />
    //     </Flex>
    //     <Flex>
    //       <div>
    //         <h4>Search Founders</h4>
    //         <div>
    //           <select onChange={(e) => setRole(e.target.value)}>
    //             <option defaultValue value="tech">
    //               Tech
    //             </option>
    //             <option value="biz">Biz</option>
    //             <option value="sales">Sales</option>
    //             <option value="hr">HR</option>
    //           </select>
    //         </div>

    // <div>
    //   <select
    //     className="search__select"
    //     onChange={(e) => setTimezone(e.target.value)}
    //   >
    //     <option defaultValue value="USA">
    //       USA
    //     </option>
    //     <option value="EU">EU</option>
    //     <option value="IND">IND</option>
    //     <option value="AFR">AFR</option>
    //   </select>

    //           {"Min YOE: "}

    // <select
    //   className="createprofile__select"
    //   value={yoe}
    //   onChange={(e) => setYoe(e.target.value)}
    // >
    //   <option value="0">0</option>
    //   <option value="1">1</option>
    //   <option value="2">2</option>
    //   <option value="3">3</option>
    //   <option value="4">4</option>
    //   <option value="5">5</option>
    //   <option value="6">6</option>
    //   <option value="7">7</option>
    //   <option value="8">8</option>
    //   <option value="9">9</option>
    //   <option value="10">10</option>
    //   <option value="11">10+</option>
    // </select>

    //           <button className="search__select" onClick={searchHandler}>
    //             🔍
    //           </button>
    //         </div>

    //         <div>
    //           <input
    //             className="search__select"
    //             placeholder="EXACT Username..."
    //             onChange={(e) => setUsername(e.target.value)}
    //           ></input>

    //           <button className="search__select" onClick={searchByUsername}>
    //             🔍
    //           </button>
    //         </div>
    //       </div>

    //       <table>
    //         <tbody>
    //           {userFilteredArray.map((userid) => {
    //             return (
    //               <UserList key={userid} userid={userid} senderid={senderid} />
    //             );
    //           })}
    //         </tbody>
    //       </table>
    //     </Flex>
    //   </Flex>
    // </Flex>
  );
}

export default SearchPlayers;
