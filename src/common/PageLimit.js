import { PAGELIMIT } from "@/constant";
import { Box, Select } from "@chakra-ui/react";
import { map } from "lodash";

export const PageLimit = ({ pageLimit, setPageLimit, setCurrentPage }) => {
  const handlePageLimit = (e) => {
    setPageLimit(e.target.value);
    setCurrentPage(1);
  };

  return (
    <Box w="15%">
      <Select size="sm" onChange={handlePageLimit} value={pageLimit} bg="white" w='180px'>
        {map(PAGELIMIT, (p) => (
          <option value={p.total} key={p.total} color="black">
            {p.title}
          </option>
        ))}
      </Select>
    </Box>
  );
};
