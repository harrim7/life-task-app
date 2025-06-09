import React from 'react';
import { 
  Box, 
  Flex, 
  Heading, 
  IconButton, 
  Menu, 
  MenuButton, 
  MenuList, 
  MenuItem, 
  MenuDivider,
  Avatar, 
  Text,
  useColorMode,
  Badge,
  Button,
} from '@chakra-ui/react';
import { FiBell, FiUser, FiSettings, FiLogOut, FiMoon, FiSun } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      px={4}
      py={2}
      bg="white"
      borderBottomWidth="1px"
      boxShadow="sm"
    >
      <Flex align="center">
        <Heading size="md" color="brand.600">
          LifeTask AI
        </Heading>
      </Flex>

      <Flex align="center">
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Notifications"
            icon={<FiBell />}
            variant="ghost"
            mr={2}
          />
          <MenuList>
            <Box px={4} py={2}>
              <Text fontWeight="bold">Notifications</Text>
            </Box>
            <MenuDivider />
            <MenuItem>
              <Flex align="center">
                <Badge colorScheme="red" mr={2}>New</Badge>
                <Text>Task "Pay bills" is due tomorrow</Text>
              </Flex>
            </MenuItem>
            <MenuItem>
              <Flex align="center">
                <Badge colorScheme="green" mr={2}>Completed</Badge>
                <Text>Task "Call plumber" was completed</Text>
              </Flex>
            </MenuItem>
          </MenuList>
        </Menu>

        <Button
          variant="ghost"
          onClick={toggleColorMode}
          mr={2}
          aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
        >
          {colorMode === 'light' ? <FiMoon /> : <FiSun />}
        </Button>

        <Menu>
          <MenuButton
            as={Button}
            variant="ghost"
            rounded="full"
            display="flex"
            alignItems="center"
          >
            <Avatar 
              size="sm" 
              name={user?.name || 'User'} 
              bg="brand.500"
              color="white"
              src="https://bit.ly/broken-link"
              mr={2}
            />
            <Text display={{ base: 'none', md: 'block' }}>{user?.name || 'User'}</Text>
          </MenuButton>
          <MenuList>
            <MenuItem icon={<FiUser />}>Profile</MenuItem>
            <MenuItem icon={<FiSettings />}>Settings</MenuItem>
            <MenuDivider />
            <MenuItem icon={<FiLogOut />} onClick={logout}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};

export default Header;
