import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Center,
  Flex,
  Heading,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Tooltip,
  VStack,
} from "@chakra-ui/react";

import { concat, find, map } from "lodash";
import Link from "next/link";
import { FaChevronCircleLeft, FaChevronCircleRight, FaChevronDown, FaChild, FaUsers } from "react-icons/fa";
import { CloseIcon } from "@chakra-ui/icons";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { HiOutlineAcademicCap } from "react-icons/hi";

import { usePathname } from "next/navigation";

import { LOCAL_STORAGE_SIDEBAR_KEYS } from "../constant";
import { NavReference } from "./MainLayouts";
import { useLoginStore } from "@/store/login";


export const Sidebar = ({ showSidebarMenu, toggleSidebarMenu, showExtraSidear }) => {
  const [sidebarHeight, setSidebarHeight] = useState();

  const { userData } = useLoginStore((s) => ({
    userData: s.userData,
  }));
  const isFindTeleCaller = useMemo(() => (userData && userData?.role == "CALLER") ? true : false, [userData])

  const NavLinks =
    !isFindTeleCaller ?
      [
        {
          title: "Dashboard",
          icon: <MdOutlineSpaceDashboard />,
          route: "/",
        },
        {
          title: "Leads",
          icon: <HiOutlineAcademicCap />,
          route: "/leads",
        },
        {
          title: "Tasks",
          icon: <HiOutlineAcademicCap />,
          route: "/task",
        },
        {
          title: "Lectures",
          icon: <HiOutlineAcademicCap />,
          route: "/lectures",
        },
        {
          title: "Meeting",
          icon: <FaChild />,
          route: "/meetings",
        },
        {
          title: "Rewards",
          icon: <FaChild />,
          route: "/rewards",
        },
        {
          title: "My Team",
          icon: <FaUsers />,
          route: "/my-team",
        },
      ] :

      [
        {
          title: "Leads",
          icon: <HiOutlineAcademicCap />,
          route: "/leads",
        },
      ]

  const localShowSidebar = localStorage.getItem(LOCAL_STORAGE_SIDEBAR_KEYS.showSidebarOpen);
  const defaultShowOpen = localShowSidebar === "true" || localShowSidebar === null ? true : false;
  const [showSidebarItemDetail, setShowSidebarItemDetail] = useState(defaultShowOpen);

  const toggleShowSideabarDetail = () => {
    setShowSidebarItemDetail((p) => !p);
    localStorage.setItem(LOCAL_STORAGE_SIDEBAR_KEYS.showSidebarOpen, !showSidebarItemDetail);
  };

  const updateHeight = useCallback(() => {
    const headerElement = NavReference?.current?.getClientRects();
    if (headerElement?.length > 0) {
      setSidebarHeight("calc( 100vh - " + headerElement[0].height + "px )");
    }
  }, []);

  useEffect(() => {
    const listener = () => {
      updateHeight();
    };
    window.addEventListener("resize", listener);
    return () => {
      window.removeEventListener("resize", listener);
    };
  }, [updateHeight]);


  useEffect(() => {
    updateHeight();
  }, [updateHeight]);

  return (
    <Flex
      w={{ base: "100%", lg: "auto" }}
      transition={"left 0.3s"}
      bg="transparent"
      minH={{ base: "80vh", lg: "auto" }}
      zIndex={9}
      pos={{ base: "fixed", lg: "relative" }}
      top="0px"
      left={{ base: showSidebarMenu ? "0px" : "-100%", lg: 0 }}
    >
      <Box
        borderRight={showExtraSidear && "1px solid"}
        borderColor="gray.200"
        transition={"width 0.3s"}
        pos="relative"
        boxShadow={{ base: "lg", lg: "none" }}
        h="100%"
        py={{ base: 4, lg: 0 }}
        bg={showSidebarItemDetail ? "white" : "gray.50"}
        w={{ base: "70%", lg: showSidebarItemDetail ? 250 : "80px" }}
      >
        <Box w="100%" px={4} justifyContent={"flex-end"} display={{ base: "flex", lg: "none" }}>
          <IconButton size="sm" onClick={toggleSidebarMenu}>
            <CloseIcon />
          </IconButton>
        </Box>
        <VStack
          justify="space-between"
          mt={{ base: 4, lg: 0 }}
          h={{ base: "80vh", lg: sidebarHeight }}
          className="scrollbar-1"
          pb={{ base: 20, lg: 4 }}
          pt={{ lg: 4 }}
        >
          <Box w="100%">
            {map(concat(NavLinks), (item, index) => (
              <SidebarItem
                showSidebarItemDetail={showSidebarItemDetail}
                key={index}
                details={item}
              />
            ))}
          </Box>
        </VStack>

        <Center
          display={{ base: "none", lg: "flex" }}
          border="2px solid"
          borderColor={"gray.100"}
          cursor="pointer"
          onClick={toggleShowSideabarDetail}
          pos="absolute"
          bottom="2%"
          transform={"translate(-50%)"}
          borderRadius={"50%"}
          left={"100%"}
          color="gray.400"
          bg="white"
          p={1}
          fontSize={15}
          boxShadow="sm"
          _hover={{ color: "defaultColor.400" }}
        >
          {showSidebarItemDetail ? <FaChevronCircleLeft /> : <FaChevronCircleRight />}
        </Center>
      </Box>
      <Box
        h={{ base: "100vh", lg: 0 }}
        flexGrow={1}
        onClick={toggleSidebarMenu}
        w={{ base: "30%", lg: 0 }}
        transition="width 0s 0.3s"
      ></Box>
    </Flex>
  );
}
const SidebarItem = ({ details, isChildren, showSidebarItemDetail }) => {
  const path = usePathname();
  const [showChildrens, setShowChildrens] = useState(false);
  const isActive = useMemo(() => {
    return path === details.route || find(details.childern, (d) => d.route === path) !== undefined;
  }, [path, details]);

  const toggleChilrens = () => {
    setShowChildrens((p) => !p);
  };

  useEffect(() => {
    setShowChildrens(isActive);
  }, [isActive]);

  return (
    <Box
      px={{ base: 8, lg: 2 }}
      bg={isActive && !showSidebarItemDetail && !isChildren && "defaultColor.500"}
      borderTopRightRadius={isActive && !showSidebarItemDetail && 50}
      borderBottomRightRadius={isActive && !showSidebarItemDetail && 50}
      _hover={{ bg: !isChildren && !isActive && "defaultColor.100" }}
      py={isChildren ? 1 : 2}
      w="full"
      borderBottom={!isChildren && "0px solid"}
      borderColor={isActive ? "defaultColor.400" : "gray.100"}
    >
      <Box px={{ lg: 2 }}>
        <SidebarItemDetailContainer
          heading={details.title}
          hasChildren={details.childern}
          showChildrens={showChildrens}
          showSidebarItemDetail={showSidebarItemDetail}
          popoverTarget={
            <>
              {details.childern ? (
                <Box onClick={toggleChilrens}>
                  <NavItemsDetails
                    isChildren={isChildren}
                    showSidebarItemDetail={showSidebarItemDetail}
                    childVisible={showChildrens}
                    hasChildren={true}
                    details={details}
                    isActive={isActive}
                  />
                </Box>
              ) : details.route ? (
                <Link href={details.route}>
                  <NavItemsDetails
                    isChildren={isChildren}
                    showSidebarItemDetail={showSidebarItemDetail}
                    childVisible={isActive}
                    hasChildren={false}
                    details={details}
                    isActive={isActive}
                  />
                </Link>
              ) : details.onClick ? (
                <Box onClick={details.onClick}>
                  <NavItemsDetails
                    isChildren={isChildren}
                    showSidebarItemDetail={showSidebarItemDetail}
                    childVisible={isActive}
                    details={details}
                    hasChildren={false}
                    isActive={isActive}
                  />
                </Box>
              ) : null}
            </>
          }
        >
          <VStack
            borderLeft={showSidebarItemDetail && "3px solid"}
            borderColor="gray.400"
            ml={4}
            pl={showSidebarItemDetail && 4}
            transition="all 0.1s"
            mt={showChildrens && showSidebarItemDetail ? 3 : 0}
            align="start"
          >
            {map(details.childern, (childNav, i) => (
              <SidebarItem
                key={i}
                showSidebarItemDetail={showSidebarItemDetail}
                isChildren={true}
                details={childNav}
              />
            ))}
          </VStack>
        </SidebarItemDetailContainer>
      </Box>
    </Box>
  );
};

const SidebarItemDetailContainer = (props) => {
  const { popoverTarget, showSidebarItemDetail, showChildrens, hasChildren, heading } = props;
  return !showSidebarItemDetail && hasChildren ? (
    <Popover closeDelay={400} openDelay={-100} size="sm" trigger="hover" placement="right">
      <PopoverTrigger>
        <Box>{popoverTarget}</Box>
      </PopoverTrigger>
      <PopoverContent boxShadow={"lg"} maxW={200} borderRadius={10}>
        <PopoverHeader bg="gray.700" color="white" borderTopLeftRadius={5} borderTopRightRadius={5}>
          <Heading pl={4} fontSize="md">
            {heading}
          </Heading>
        </PopoverHeader>
        <PopoverArrow />
        <PopoverBody px={0} py={2}>
          {props.children}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  ) : (
    <>
      {popoverTarget}
      {hasChildren && showChildrens && props.children}
    </>
  );
};

const NavItemsDetails = ({
  details,
  isActive,
  hasChildren,
  childVisible,
  showSidebarItemDetail,
  isChildren,
}) => {
  const { title, icon, iconBgcolor, iconColor, textColor } = details;
  return (
    <Flex role="group" cursor={"pointer"} align={"center"} justify={"space-between"}>
      <Tooltip
        label={!showSidebarItemDetail && !isChildren && !hasChildren && title}
        placement="right"
        hasArrow
      >
        <Flex align="center">
          {icon && (
            <Box
              pos="relative"
              boxShadow="lg"
              border="1px solid"
              borderColor={"gray.200"}
              p={2}
              bg={iconBgcolor ? iconBgcolor : isActive ? "defaultColor.500" : "white"}
              color={iconColor ? iconColor : isActive ? "white" : "gray.700"}
              fontSize={18}
              borderRadius={50}
              mr={4}
            >
              {icon}
            </Box>
          )}
          {(showSidebarItemDetail || (!showSidebarItemDetail && isChildren)) && (
            <Box
              fontSize={"sm"}
              wordBreak="keep-all"
              whiteSpace="nowrap"
              overflow="hidden"
              transition="all 0s 0.3s"
              color={textColor ? textColor : isActive && !hasChildren ? "black" : "black"}
              fontWeight={isActive && "bold"}
            >
              {title}
            </Box>
          )}
        </Flex>
      </Tooltip>
      {hasChildren && showSidebarItemDetail && (
        <Box
          color={isActive && childVisible ? "defaultcolor.400" : "gray.400"}
          transform={!childVisible && "rotateZ(-90deg)"}
          transition="all 0.3s"
          fontSize={"sm"}
        >
          <FaChevronDown />
        </Box>
      )}
    </Flex>
  );
};
