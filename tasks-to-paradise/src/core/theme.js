import { extendTheme } from "@chakra-ui/react";


const config = {
  initialColorMode: 'dark', // Set the initial color mode
  useSystemColorMode: false, // Set to 'true' if you want to use the system color mode
};

const theme = extendTheme({
  styles: {
    global: {
      '.chakra-form-control': {
        mt: "20px",
      },
    },
  },
  
});

export default theme;