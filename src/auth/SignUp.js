import React, { useCallback, useState } from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import firebaseApp from "../firebase";
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
} from "@chakra-ui/react";
import { VscRocket } from "react-icons/vsc";

const SignUp = ({ history }) => {
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignUp = useCallback(
    async (event) => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      try {
        await firebaseApp
          .auth()
          .createUserWithEmailAndPassword(email.value, password.value);
        history.push("/createprofile");
      } catch (error) {
        setErrorMessage(error.message);
      }
    },
    [history]
  );

  const demoSignIn = useCallback(
    async (event) => {
      event.preventDefault();
      try {
        await firebaseApp
          .auth()
          .signInWithEmailAndPassword("demo@demo.com", "demouserpass");
        history.push("/searchstartups");
      } catch (error) {
        setErrorMessage(error.message);
      }
    },
    [history]
  );

  return (
    <Flex
      flexDir="column"
      h="100vh"
      alignItems="center"
      backgroundColor="gray.200"
    >
      <Link to="/">
        <Flex mt={10}>
          <Flex
            backgroundColor="blue.400"
            height="fit-content"
            borderRadius={20}
            padding={2}
          >
            <VscRocket size={40} color="white" />
          </Flex>
          <Text
            fontSize={40}
            fontFamily="mono"
            fontWeight={700}
            letterSpacing="widest"
            ml={2}
            color="blue.700"
          >
            COFOUND
          </Text>
        </Flex>
      </Link>

      <Text>Sign up as a Co-founder!</Text>

      <Flex
        backgroundColor="white"
        margin={6}
        padding={6}
        borderRadius={20}
        boxShadow="base"
      >
        <form onSubmit={handleSignUp}>
          <Input name="email" type="email" placeholder="Email" />
          <Input
            mt={4}
            name="password"
            type="password"
            placeholder="Password"
          />
          <Button mt={4} type="submit" colorScheme="yellow" boxShadow="base">
            Sign Up !
          </Button>
        </form>
      </Flex>

      <Button colorScheme="purple" onClick={demoSignIn} boxShadow="base">
        Demo Sign In
      </Button>

      <Flex
        hidden={!errorMessage}
        margin={4}
        padding={4}
        backgroundColor="red.400"
        borderRadius={10}
      >
        <Text fontSize="sm" w="40vh" color="white">
          {errorMessage}
        </Text>
      </Flex>

      <Link to="/signin">
        <Text mt={2} color="blue.600" fontWeight="400">
          Have an account? Sign In!
        </Text>
      </Link>

      <Link to="/passwordreset">
        <Text mt={2} color="red.600" fontWeight="400">
          Forgot Password?
        </Text>
      </Link>
    </Flex>
  );
};

export default withRouter(SignUp);
