import {
  AspectRatio,
  Badge,
  Box,
  Center,
  Flex,
  HStack,
  Icon,
  Image,
  Menu,
  MenuItem,
  MenuList,
  SimpleGrid,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { PageHeading } from "../../common/PageHeading";
import { useEffect, useMemo } from "react";
import { useLectureStore } from "@/store/lecture";
import { map, orderBy } from "lodash";
import { LoadingContainer } from "@/common/LoadingContainer";
import { STATUS } from "@/constant";
import { EmptyBox } from "@/common/EmptyBox";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { FaPlay, FaYoutube } from "react-icons/fa";
import { FiExternalLink, FiVideo, FiVideoOff } from "react-icons/fi";


const columnHelper = createColumnHelper();

export const Lecture = () => {
  const { getLectureAction, getLectureStatus, lectures } = useLectureStore(
    (s) => ({
      getLectureAction: s.getLectureAction,
      getLectureStatus: s.getLectureStatus,
      lectures: s.lectures,
    })
  );

  useEffect(() => {
    getLectureAction({ isLecture: true });
  }, [getLectureAction]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("title", {
        header: () => "Lecture Name",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("description", {
        header: () => "Description",
        cell: (info) => (
          <Text noOfLines={2} maxW="200px" whiteSpace="pre-wrap" fontSize="sm">
            {info.getValue()}
          </Text>
        ),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("videoUrl", {
        cell: (info) => {
          const url = info.row.original.videoUrl;
          const youtubeIdMatch = url?.match(
            /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/
          );
          const videoId = youtubeIdMatch?.[1];

          return videoId ? (
            <Box position="relative" display="inline-block">
              <Tooltip
                label={`Watch: ${info.row.original.title || "Video"}`}
                placement="top"
                hasArrow
              >
                <Box
                  as="a"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  display="block"
                  position="relative"
                  borderRadius="lg"
                  overflow="hidden"
                  boxShadow="md"
                  transition="all 0.2s"
                  _hover={{
                    transform: "scale(1.05)",
                    boxShadow: "lg",
                  }}
                  bg="gray.100"
                >
                  <Image
                    src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                    alt={`Thumbnail for ${info.row.original.title || "Video"}`}
                    width="120px"
                    height="90px"
                    objectFit="cover"
                    fallback={
                      <Flex
                        width="120px"
                        height="90px"
                        bg="gray.200"
                        align="center"
                        justify="center"
                        direction="column"
                      >
                        <Icon
                          as={FaYoutube}
                          color="red.500"
                          boxSize={6}
                          mb={1}
                        />
                        <Text fontSize="xs" color="gray.600">
                          Loading...
                        </Text>
                      </Flex>
                    }
                  />

                  {/* YouTube Play Button Overlay */}
                  <Box
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    bg="rgba(0, 0, 0, 0.8)"
                    borderRadius="full"
                    p={2}
                    transition="all 0.2s"
                    _hover={{ bg: "rgba(255, 0, 0, 0.9)" }}
                  >
                    <Icon as={FaPlay} color="white" boxSize={4} ml="1px" />
                  </Box>

                  {/* Duration Badge (if you have duration data) */}
                  {info.row.original.duration && (
                    <Badge
                      position="absolute"
                      bottom={2}
                      right={2}
                      bg="rgba(0, 0, 0, 0.8)"
                      color="white"
                      fontSize="xs"
                      px={2}
                      py={1}
                      borderRadius="sm"
                    >
                      {info.row.original.duration}
                    </Badge>
                  )}

                  {/* Live indicator (if applicable) */}
                  {info.row.original.isLive && (
                    <Badge
                      position="absolute"
                      top={2}
                      left={2}
                      colorScheme="red"
                      fontSize="xs"
                      px={2}
                      py={1}
                      borderRadius="sm"
                    >
                      🔴 LIVE
                    </Badge>
                  )}
                </Box>
              </Tooltip>

              {/* External link indicator */}
              <Box
                position="absolute"
                top={1}
                right={1}
                bg="white"
                borderRadius="full"
                p={1}
                boxShadow="sm"
              >
                <Icon as={FiExternalLink} boxSize={3} color="gray.600" />
              </Box>
            </Box>
          ) : url ? (
            // Fallback for non-YouTube URLs
            <Tooltip label="Open Video" placement="top" hasArrow>
              <Box
                as="a"
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                display="flex"
                align="center"
                justify="center"
                width="120px"
                height="90px"
                bg="gray.100"
                borderRadius="lg"
                border="2px dashed"
                borderColor="gray.300"
                transition="all 0.2s"
                _hover={{
                  borderColor: "blue.400",
                  bg: "blue.50",
                }}
              >
                <VStack spacing={1}>
                  <Icon as={FiVideo} boxSize={6} color="gray.500" />
                  <Text fontSize="xs" color="gray.600" textAlign="center">
                    Video Link
                  </Text>
                </VStack>
              </Box>
            </Tooltip>
          ) : (
            // No video URL provided
            <Flex
              width="120px"
              height="90px"
              bg="gray.50"
              align="center"
              justify="center"
              borderRadius="lg"
              border="1px solid"
              borderColor="gray.200"
            >
              <VStack spacing={1}>
                <FiVideoOff boxSize={6} color="gray.400" />
                <Text fontSize="xs" color="gray.500" textAlign="center">
                  No Video
                </Text>
              </VStack>
            </Flex>
          );
        },
        header: () => (
          <HStack spacing={1} align="center">
            <Icon as={FaYoutube} color="red.500" boxSize={4} />
            <Text>Video</Text>
          </HStack>
        ),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("dateTime", {
        header: () => "Time",
        footer: (info) => info.column.id,
      }),
    ],
    []
  );

  const table = useReactTable(
    useMemo(
      () => ({
        data: orderBy(lectures, "createdAt", "desc") || [],
        columns,
        columnResizeMode: "onChange",
        getCoreRowModel: getCoreRowModel(),
      }),
      [columns, lectures]
    )
  );

  return (
    <Box bg="white" p={3} minH="100vh">
      <PageHeading heading="Lecture" desc="show list of Lecture" />
      <LoadingContainer loading={getLectureStatus === STATUS.FETCHING}>
        {!lectures?.length ? (
          <EmptyBox
            title="No Lectures Found"
            desc="Wait For Next Meeting Schedule"
          />
        ) : (
          //       <SimpleGrid columns={4} gap={16} mt={3} textAlign={"left"}>
          //         {map(lectures, (lect) => {
          //           console.log("lecture",lect)
          //           return (
          //             <Box
          //               border={"2px solid"}
          //               borderColor={"gray.400"}
          //               borderRadius={"md"}
          //               textAlign={"center"}
          //               onClick={() => window.open(lect.videoUrl, "")}
          //             >
          //               {/* <AspectRatio h={"200px"} ratio={1}> */}
          //               <Center>
          //                 <Image
          //                   src={
          //                     "https://cdn-icons-png.flaticon.com/512/1384/1384060.png"
          //                   }
          //                   boxSize='100px'
          // objectFit='cover'
          //                 />
          //                 </Center>
          //               {/* </AspectRatio> */}
          //               <Text fontWeight={"semibold"} fontSize={"md"}>
          //                 {lect.title}
          //               </Text>
          //               <Text color={"gray.400"}>{lect.dateTime}</Text>
          //             </Box>
          //           );
          //         })}
          //       </SimpleGrid>

          <TableContainer
            pt={5}
            style={{
              borderBottomLeftRadius: "10px",
              borderBottomRightRadius: "10px",
            }}
          >
            <Table bg="white">
              <Thead>
                {table?.getHeaderGroups().map((headerGroup) => (
                  <Tr key={headerGroup.id}>
                    {map(headerGroup.headers, (header) => (
                      <Th h={10} key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </Th>
                    ))}
                  </Tr>
                ))}
              </Thead>
              <Tbody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <Tr key={row.original?.id} color="gray.500">
                      {row.getVisibleCells().map((cell) => (
                        <Td key={cell.id} bg="white" maxW={200}>
                          <Box>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </Box>
                        </Td>
                      ))}
                     
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={6}>
                      <EmptyBox title="Lecture not found" />
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </LoadingContainer>
    </Box>
  );
};
