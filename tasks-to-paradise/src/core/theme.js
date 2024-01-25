import { extendTheme } from "@chakra-ui/react";

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({
  styles: {
    global: {
      '.chakra-form-control': {
        mt: "20px",
      },
      // Adding styles directly to MenuList
      '.chakra-menu__menu-list': {
        bg: 'gray.700', // Your desired background color
        borderColor: 'gray.600', // Optional: if you want to change border color
        // Add any other styles here
      },
      '.chakra-menu__menuitem': {
        bg: 'white', // Your desired background color
        borderColor: 'gray.600', // Optional: if you want to change border color
        // Add any other styles here
      },
    },
  },
  components: {
    Button: {
      variants: {
        outline: {
          bg: 'transparent', // Background color
          color: 'white',  // Text color
          border: '2px solid', // Border style
          borderColor: 'white', // Border color
          _hover: {
            bg: 'transparent', // Background color on hover
            color: 'red', // Text color on hover
          },
          _expanded: {
            bg: 'transparent', // Background color on hover
            color: 'white', // Text color on hover
          },
        },
      },
    },
  },
  config,
});

export default theme;
