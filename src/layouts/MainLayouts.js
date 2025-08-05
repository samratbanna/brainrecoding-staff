import { Box, Flex } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { InternetStatus } from "../common/InternetStatus";
import { Sidebar } from "../layouts/Sidebar"
import { DashboardHeader } from "../layouts/Header"

export let NavReference = React.createRef();

export const MainLayout = (props) => {
  const [HeaderRef, setHeaderRef] = useState();
  const [navHeight, setNavHeight] = useState();
  const [showSidebarMenu, setShowSidebarMenu] = useState(false);

  const updateHeight = useCallback(() => {
    NavReference = { ...NavReference, current: HeaderRef };
    const headerBarElement = HeaderRef?.getClientRects();
    if (headerBarElement?.length > 0) {
      setNavHeight(headerBarElement[0].height + "px");
    }
  }, [HeaderRef]);

  useEffect(() => {
    updateHeight();
  }, [updateHeight]);

  useEffect(() => {
    const listner = () => {
      updateHeight();
    };
    window.addEventListener("resize", listner);
    return () => {
      window.removeEventListener("resize", listner);
    };
  }, [updateHeight]);

  const toggleSidebarMenu = () => {
    setShowSidebarMenu((p) => !p);
  };

  return (
    <InternetStatus>
      <Box minH="80vh" pos={"relative"}>
        <Box>
          <Box ref={(r) => setHeaderRef(r)}>
            <DashboardHeader toggleSidebarMenu={toggleSidebarMenu} />
          </Box>
        </Box>
        <Box pos={"relative"}>
          <Flex>
            <Sidebar
              showExtraSidear={props.sidebar !== undefined}
              showSidebarMenu={showSidebarMenu}
              toggleSidebarMenu={toggleSidebarMenu}
            />
            <Box w={"calc(100vw - 250px)"} flexGrow={1}>
              <Flex>
                {props.sidebar && (
                  <Box
                    h={`calc(100vh - ${navHeight})`}
                    overflow="hidden"
                    className="scrollbar-1"
                    overflowY={"scroll"}
                    py={{ lg: 8 }}
                  >
                    {props.sidebar || null}
                  </Box>
                )}
                <Box
                  h={`calc(100vh - ${navHeight})`}
                  overflowY={"scroll"}
                  overflowX="hidden"
                  flex={1}
                  bg="gray.50"
                >
                  <Box p={!props.noPadding && 4} py={{ lg: 8 }}>
                    {props.children}
                  </Box>
                </Box>
              </Flex>
            </Box>
          </Flex>
        </Box>
      </Box>
     </InternetStatus>
  );
};
