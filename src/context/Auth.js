"use client"
import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    useCallback,
    useMemo,
} from 'react';
import { Box, Center, Spinner } from '@chakra-ui/react';

import { useCookies } from 'react-cookie';

import { motion, AnimatePresence } from 'framer-motion';

import { usePathname, useRouter } from 'next/navigation'
import { useLoginStore } from "../store/login"
import { find, indexOf } from 'lodash';
import { LOCAL_STORAGE_KEYS, STATUS } from '@/constant';
import { PageNotFound } from "../common/PageNotFound"

const cookiePath = 'isfaergfg';
const PUBLIC_PATHS = ['/login'];
const PUBLIC_PATHS_TELECALLER = ['/leads'];
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const isServerSide = typeof window === 'undefined';
    const router = useRouter()
    const path = usePathname()
    const [checkAuth, setCheckAuth] = useState(false);
    const [cookie, setCookie, removeCookie] = useCookies();
    const [isAuthenticated, setIsAuthenticated] = useState(true);

    useEffect(() => {
        const checktoken = cookie[cookiePath];
        if (!checktoken) {
            setCheckAuth(true);
        }
    }, [cookie]);

    const fetchingUserData = false;
    const { loginUserAction, loginStatus, resetOtpToken, userData } = useLoginStore(s => ({
        loginUserAction: s.loginUserAction,
        loginStatus: s.loginStatus,
        userData: s.userData,
        resetOtpToken: s.resetOtpToken,
    }))


    const isFindTeleCaller = useMemo(() => (userData && userData?.role === 'CALLER') ? true : false, [userData])

    useEffect(() => { 
        if (!isServerSide && !userData) {
            const isPublicPath = indexOf(PUBLIC_PATHS, path) !== -1;
            const localToken = localStorage.getItem(LOCAL_STORAGE_KEYS.loginToken);
            if (localToken && !isPublicPath) {
                loginUserAction({ rtoken: localToken, deviceType:'web' })
            }
        }
    }, [isServerSide, path, loginUserAction, userData]);

    useEffect(() => {
        if (!isServerSide && isFindTeleCaller && userData) {
            const isPublicPathTeleCaller = indexOf(PUBLIC_PATHS_TELECALLER, path) !== -1;
            const localToken = localStorage.getItem(LOCAL_STORAGE_KEYS.loginToken);
            if (localToken && !isPublicPathTeleCaller) {
                <PageNotFound/>
            }
        }
    }, [isServerSide, userData, isFindTeleCaller])

    useEffect(() => {
        if (!isServerSide && !userData) {
            const localToken = localStorage.getItem(LOCAL_STORAGE_KEYS.loginToken);
            if (!localToken) {
                router.push('/login')
            }
        }
    }, [isServerSide, router, userData])

    useEffect(() => {
        if (loginStatus === STATUS.FAILED) {
            router.push('/login', () => resetOtpToken())
        }
    }, [loginStatus, router, resetOtpToken])

    const loginSuccess = useCallback(() => {
    }, []);

    const logout = useCallback(() => {
        const isConfirm = confirm('Logout?');

        if (isConfirm) {
            removeCookie(cookiePath);
            window.open('/', '_self');
        }
    }, [removeCookie]);

    const contextValue = useMemo(() => {
        return {
            isAuthenticated,
            setIsAuthenticated,
            loginSuccess,
            logout
        };
    }, [isAuthenticated, loginSuccess, logout]);

    const isLoading = useMemo(() => !checkAuth, [checkAuth])
    const isPublicPath = useMemo(() => indexOf([...PUBLIC_PATHS, '/register'], path) !== -1, [router])
    return (
        <AuthContext.Provider value={contextValue}>
            {isLoading ? (
                <Loader />
            )
                : (isAuthenticated || isPublicPath) ? (
                    <Box>
                        <AnimatePresence>
                            <motion.section
                                key="content"
                                initial="collapsed"
                                animate="open"
                                exit="collapsed"
                                variants={{
                                    open: { opacity: 1, marginLeft: 0 },
                                    collapsed: { opacity: 0 },
                                }}
                                transition={{ duration: 0.5, ease: [0.04, 0.4, 0.8, 0.98] }}
                            >
                                {children}
                            </motion.section>
                        </AnimatePresence>
                    </Box>
                ) : fetchingUserData === STATUS.FETCHING ? (
                    <Loader />
                ) : null}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

const Loader = (props) => {
    return (
        <Center zIndex={999999999} pos='fixed' top='0px' bg="gray.50" h="100vh" w="100vw" {...props}>
            <Spinner />
        </Center>
    );
};
