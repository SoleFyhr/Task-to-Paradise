import { formAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(formAnatomy.keys);

const baseStyle = definePartsStyle({

    mt:"20"
//   container: {
//     margin : "10px 50px",
//     backgroundColor: "white",
//     _dark:{
//       backgroundColor: "blue.800",
//     }
//   },
//   header: {
//     padding: "10px",
//     borderRadius:"10px",
//     backgroundColor:"white"
//   },
//   body: {
//     padding: "20px",
//     paddingTop: "2px",
//     borderRadius:"10px",
//     backgroundColor:"white"
//   },
//   footer: {
//     paddingTop: "4px",
//     backgroundColor:"white"
//   }
});

// const sizes = {
//   md: definePartsStyle({
//     container: {
//       borderRadius: "10"
//     }
//   }),
  
//   xl: definePartsStyle({
//     container: {
//       borderRadius: "36px",
//       padding: "40px"
//     }
//   })
// };



export const formTheme = defineMultiStyleConfig({
  baseStyle,
//   sizes,
//   defaultProps: {
//     // define which size and variant is applied by default
//     size: "md",

//   },
});