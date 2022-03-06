import React, { useState, useEffect } from "react";
import firebaseApp from "./firebase";
import { Link, useHistory } from "react-router-dom";
import { MdExitToApp } from "react-icons/md";
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
  Tag,
  Tr,
  Th,
  Td,
  TableCaption,
  Icon,
  Heading,
  Avatar,
} from "@chakra-ui/react";
import { GiConverseShoe } from "react-icons/gi";

function Roster(props) {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [yoe, setYoe] = useState();
  const [timezone, setTimezone] = useState("");
  const [redditusername, setRedditusername] = useState("");
  const [bio, setBio] = useState("");

  const history = useHistory();

  const userid = props.userid;
  const isFounder = props.isFounder;
  const founderid = props.founderid;
  const startupid = props.startupid;

  const db = firebaseApp.database();
  const myid = firebaseApp.auth().currentUser.uid;
  const userRef = db.ref().child("users/" + userid);
  const memberRef = db.ref().child("members/" + startupid + "/" + userid);
  const startupRef = db.ref().child("startups/" + startupid);

  console.log(isFounder, userid, myid, founderid);

  function hideRemoveButton() {
    if (userid === founderid || myid !== founderid) {
      return true;
    } else {
      return false;
    }
  }

  useEffect(() => {
    userRef.once("value", (snapshot) => {
      setUsername(snapshot.val().username);
      setRole(snapshot.val().role);
      setYoe(snapshot.val().yoe);
      setTimezone(snapshot.val().timezone);
      setRedditusername(snapshot.val().redditusername);
    });
  }, []);

  function removeMember() {
    if (window.confirm("Are you sure you want to remove this member?")) {
      userRef.update({ startupid: "" });
      memberRef.remove();
      history.push("/mystartup");
    }
  }

  return (
    <Tr>
      <Td>
        <Flex>
          <Avatar
            size="md"
            className="listlogo"
            src="https://i.pinimg.com/originals/37/c9/f5/37c9f5492e8219c5f91e2b3c28b74c92.png"
            alt="Startup Logo"
          ></Avatar>

          <Flex direction="column" ml={3} w="100%">
            <Flex>
              {userid === founderid ? (
                <Text
                  backgroundColor="red"
                  borderRadius={8}
                  paddingRight={1}
                  paddingLeft={1}
                  mr={1}
                  fontSize="xs"
                  color="white"
                  letterSpacing="widest"
                  fontWeight="600"
                >
                  CEO
                </Text>
              ) : (
                <></>
              )}
              <Link style={{ textDecoration: "none" }} to={`/users/${userid}`}>
                <Text fontSize="md" fontWeight={500}>
                  {username}
                </Text>
              </Link>
              <Text fontSize="xs" ml={1}>
                {timezone}
              </Text>
            </Flex>

            <Flex direction="row" mt={1}>
              <Text fontSize="xs">{yoe} years of experience in </Text>
              <Text
                backgroundColor="blue.400"
                borderRadius={8}
                paddingRight={1}
                paddingLeft={1}
                ml={1}
                fontSize="xs"
                color="white"
              >
                {role}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Td>
      <Td>
        <Button
          size="sm"
          hidden={hideRemoveButton()}
          onClick={() => removeMember()}
          colorScheme="red"
          boxShadow="base"
        >
          <GiConverseShoe size={20} /> Kick
        </Button>
      </Td>
    </Tr>
  );
}

export default Roster;
