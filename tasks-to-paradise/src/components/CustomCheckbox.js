import React from "react";
import { Checkbox } from "@chakra-ui/react";


function CustomCheckbox({ onCheck,checked }) {
  return (
    <Checkbox
      size = "lg"
      borderColor="white"
      colorScheme="blue"
      onChange={(e) => onCheck(e.target.checked)}
      isChecked={checked}
      sx={{
        '.chakra-checkbox__control': {
          borderWidth: '1px', // Set the thickness of the border
          borderRadius: 'lg', // Adjust the border-radius to your preference (e.g., 'md', 'lg', 'full')
          boxShadow: '0 0 0 1px white', // This creates a white shadow to act as an outline
          marginRight: '10px'
        },
        '.chakra-checkbox': {
          // Apply additional styles if needed
        }
      }}
    >
      
    </Checkbox>
  );
}

export default CustomCheckbox;
