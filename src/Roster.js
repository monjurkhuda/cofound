import { Avatar, Button, Flex, Stack, Td, Text, Tr } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { GiConverseShoe } from "react-icons/gi";
import { Link, useHistory } from "react-router-dom";
import firebaseApp from "./firebase";

function Roster(props) {
  const [logourl, setLogourl] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [yoe, setYoe] = useState();
  const [timezone, setTimezone] = useState("");

  const history = useHistory();

  const userid = props.userid;
  const founderid = props.founderid;
  const startupid = props.startupid;

  const db = firebaseApp.database();
  const myid = firebaseApp.auth().currentUser.uid;
  const userRef = db.ref().child("users/" + userid);
  const memberRef = db.ref().child("members/" + startupid + "/" + userid);

  function hideRemoveButton() {
    if (userid === founderid || myid !== founderid) {
      return true;
    } else {
      return false;
    }
  }

  useEffect(() => {
    userRef.once("value", (snapshot) => {
      setLogourl(snapshot.val().logourl);
      setUsername(snapshot.val().username);
      setRole(snapshot.val().role);
      setYoe(snapshot.val().yoe);
      setTimezone(snapshot.val().timezone);
    });
  }, [userRef]);

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
          <Avatar size="md" src={logourl}></Avatar>

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

            <Stack spacing={[1, 3]} direction={["column", "row"]} wrap="wrap">
              <Text fontSize="xs">{yoe} years of experience in </Text>
              <Text
                backgroundColor="blue.400"
                borderRadius={8}
                paddingRight={1}
                paddingLeft={1}
                ml={1}
                w="fit-content"
                fontSize="xs"
                color="white"
              >
                {role}
              </Text>
            </Stack>
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
          <GiConverseShoe size={20} />{" "}
          <Text display={["none", "flex"]}>Kick</Text>
        </Button>
      </Td>
    </Tr>
  );
}

export default Roster;
