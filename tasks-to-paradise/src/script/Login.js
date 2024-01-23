import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from '@chakra-ui/react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const toast = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const bodyContent = JSON.stringify({ username });

    fetch('http://127.0.0.1:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: bodyContent,
      credentials: 'include',
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return response.json().then((data) => {
            throw new Error(data.message || 'Unknown server error');
          });
        }
      })
      .then((data) => {
        onLogin(username);
        toast({
          title: 'Logged in successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((error) => {
        toast({
          title: 'An error occurred.',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
  };

  return (
    <Flex
      height="100vh" // Full viewport height
      alignItems="center" // Aligns children vertically
      justifyContent="center" // Aligns children horizontally
    >
      <Box
        p={8} // Padding
        maxWidth="400px" // Maximum width
        borderWidth={1} // Border width
        borderRadius={8} // Border radius
        boxShadow="lg" // Shadow
      >
        <form onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Enter your username" 
              isRequired
            />
          </FormControl>
          <Button
            width="full"
            mt={4}
            type="submit"
            colorScheme="messenger"
          >
            Login
          </Button>
        </form>
      </Box>
    </Flex>
  );
};

export default Login;
