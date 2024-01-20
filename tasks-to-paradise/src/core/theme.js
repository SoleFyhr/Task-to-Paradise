import { extendTheme } from "@chakra-ui/react";

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