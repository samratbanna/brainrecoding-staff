import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  useColorModeValue,
  InputGroup,
  InputRightElement,
  Icon,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { useLoginStore } from "@/store/login";
import { useEffect, useMemo, useState } from "react";
import { STATUS } from "@/constant";
import { useRouter } from "next/navigation";
import { BiHide, BiShow } from "react-icons/bi"

export const Login = () => {
  const { control, handleSubmit } = useForm({defaultValues: {username: "", password:""}});
  const [show, setShow] = useState()

  const router = useRouter();

  const { loginUserAction, loginStatus, resetOtpToken, userData } = useLoginStore((s) => ({
    loginUserAction: s.loginUserAction,
    loginStatus: s.loginStatus,
    resetOtpToken: s.resetOtpToken,
    userData: s.userData,
  }));

  const isFindTeleCaller = useMemo(() => (userData && userData?.role === "CALLER") ? true : false, [userData])

  useEffect(() => {
    if (loginStatus === STATUS.SUCCESS) {
      resetOtpToken();
      if (isFindTeleCaller) {
        router.push("/leads")
      }
      else {
        router.push("/");
      }
    }
  }, [loginStatus, isFindTeleCaller]);

  const onSubmit = (data) => {
    loginUserAction(data);
  };

  const handleClick = () => setShow(!show);

  return (
    <Flex
      color={"black"}
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Sign in to Brain Recoding</Heading>
        </Stack>
        <Box rounded={"lg"} bg={useColorModeValue("white", "gray.700")} boxShadow={"lg"} p={8}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Username</FormLabel>
                <Controller
                  control={control}
                  name="username"
                  render={({ field }) => <Input {...field} placeholder="Username" />}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Controller
                  control={control}
                  name="password"
                  render={({ field }) =>
                    <InputGroup {...field}>
                      <Input placeholder="Password" type={show ? "text" : "password"} />
                      <InputRightElement width="4.5rem" onClick={handleClick}>
                        <Icon as={show ? BiHide : BiShow} />
                      </InputRightElement>
                    </InputGroup>}
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="defaultColor"
                isLoading={loginStatus === STATUS.FETCHING}
              >
                Sign in
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
};
