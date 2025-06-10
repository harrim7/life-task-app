import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  useToast,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Switch,
  Select,
  Avatar,
  Flex,
  IconButton,
  useColorMode,
  SimpleGrid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
} from '@chakra-ui/react';
import { FiSave, FiEdit, FiUser, FiMail, FiLock, FiBell, FiUpload, FiTrash2, FiSun, FiMoon } from 'react-icons/fi';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const Settings: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();
  
  // Profile state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatarUrl: user?.avatarUrl || '',
  });
  
  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // Notification preferences
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    reminders: true,
    taskUpdates: true,
    weeklyDigest: true,
  });
  
  // App preferences
  const [preferences, setPreferences] = useState({
    defaultView: 'list',
    defaultFilter: 'all',
    defaultSort: 'dueDate',
    showCompletedTasks: true,
    autoArchiveCompleted: false,
  });
  
  // Edit mode
  const [isEditing, setIsEditing] = useState(false);
  
  // Handle profile update
  const handleProfileUpdate = () => {
    toast({
      title: 'Profile Updated',
      description: 'Your profile information has been updated.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    setIsEditing(false);
  };
  
  // Handle password update
  const handlePasswordUpdate = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'New password and confirmation do not match.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    toast({
      title: 'Password Updated',
      description: 'Your password has been updated successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };
  
  // Handle notification preferences update
  const handleNotificationUpdate = () => {
    toast({
      title: 'Preferences Updated',
      description: 'Your notification preferences have been saved.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  
  // Handle app preferences update
  const handlePreferencesUpdate = () => {
    toast({
      title: 'Preferences Updated',
      description: 'Your application preferences have been saved.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  
  return (
    <Layout>
      <Box mb={6}>
        <Heading as="h1" size="xl" color="gray.800" mb={6}>Settings</Heading>
        
        <Tabs variant="enclosed" colorScheme="brand">
          <TabList mb={6}>
            <Tab>Profile</Tab>
            <Tab>Security</Tab>
            <Tab>Notifications</Tab>
            <Tab>Preferences</Tab>
          </TabList>
          
          <TabPanels>
            {/* Profile Tab */}
            <TabPanel p={0}>
              <Card mb={6}>
                <CardHeader>
                  <Flex justify="space-between" align="center">
                    <Heading size="md">Personal Information</Heading>
                    <IconButton
                      aria-label="Edit profile"
                      icon={isEditing ? <FiSave /> : <FiEdit />}
                      variant="ghost"
                      onClick={() => isEditing ? handleProfileUpdate() : setIsEditing(true)}
                    />
                  </Flex>
                </CardHeader>
                <CardBody>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                    <Box>
                      <VStack spacing={6} align="start">
                        <FormControl>
                          <FormLabel>Full Name</FormLabel>
                          <Input
                            placeholder="Your name"
                            value={profileData.name}
                            onChange={e => setProfileData({...profileData, name: e.target.value})}
                            isReadOnly={!isEditing}
                            leftIcon={<FiUser />}
                          />
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel>Email Address</FormLabel>
                          <Input
                            type="email"
                            placeholder="your.email@example.com"
                            value={profileData.email}
                            onChange={e => setProfileData({...profileData, email: e.target.value})}
                            isReadOnly={!isEditing}
                            leftIcon={<FiMail />}
                          />
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel>Member Since</FormLabel>
                          <Input 
                            value="June 15, 2023" 
                            isReadOnly 
                          />
                        </FormControl>
                      </VStack>
                    </Box>
                    
                    <Flex direction="column" align="center" justify="center">
                      <Avatar 
                        size="2xl" 
                        name={profileData.name || "User"} 
                        src={profileData.avatarUrl} 
                        mb={4} 
                      />
                      
                      {isEditing && (
                        <VStack>
                          <Button leftIcon={<FiUpload />} size="sm">
                            Upload Photo
                          </Button>
                          <Button leftIcon={<FiTrash2 />} size="sm" variant="ghost" colorScheme="red">
                            Remove
                          </Button>
                        </VStack>
                      )}
                    </Flex>
                  </SimpleGrid>
                </CardBody>
              </Card>
              
              <Card>
                <CardHeader>
                  <Heading size="md">App Theme</Heading>
                </CardHeader>
                <CardBody>
                  <HStack>
                    <Text>Theme Mode:</Text>
                    <HStack spacing={2}>
                      <FiSun />
                      <Switch 
                        isChecked={colorMode === 'dark'} 
                        onChange={toggleColorMode} 
                        colorScheme="brand"
                      />
                      <FiMoon />
                    </HStack>
                  </HStack>
                </CardBody>
              </Card>
            </TabPanel>
            
            {/* Security Tab */}
            <TabPanel p={0}>
              <Card mb={6}>
                <CardHeader>
                  <Heading size="md">Change Password</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={6} align="start">
                    <FormControl>
                      <FormLabel>Current Password</FormLabel>
                      <Input
                        type="password"
                        placeholder="Enter your current password"
                        value={passwordData.currentPassword}
                        onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      />
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>New Password</FormLabel>
                      <Input
                        type="password"
                        placeholder="Enter new password"
                        value={passwordData.newPassword}
                        onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                      />
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Confirm New Password</FormLabel>
                      <Input
                        type="password"
                        placeholder="Confirm new password"
                        value={passwordData.confirmPassword}
                        onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      />
                    </FormControl>
                    
                    <Button onClick={handlePasswordUpdate} leftIcon={<FiSave />} colorScheme="blue">
                      Update Password
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
              
              <Card>
                <CardHeader>
                  <Heading size="md">Security Settings</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4} align="start">
                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="two-factor" mb="0">
                        Two-Factor Authentication
                      </FormLabel>
                      <Switch id="two-factor" colorScheme="green" />
                    </FormControl>
                    
                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="session-timeout" mb="0">
                        Automatic Session Timeout
                      </FormLabel>
                      <Switch id="session-timeout" defaultChecked colorScheme="green" />
                    </FormControl>
                    
                    <FormControl mt={4}>
                      <FormLabel>Session Timeout Duration</FormLabel>
                      <Select defaultValue="30">
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="120">2 hours</option>
                      </Select>
                    </FormControl>
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>
            
            {/* Notifications Tab */}
            <TabPanel p={0}>
              <Card>
                <CardHeader>
                  <Heading size="md">Notification Preferences</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4} align="stretch" divider={<Divider />}>
                    <FormControl display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <FormLabel htmlFor="email-notifications" mb="0">
                          Email Notifications
                        </FormLabel>
                        <Text fontSize="sm" color="gray.500">
                          Receive notifications via email
                        </Text>
                      </Box>
                      <Switch 
                        id="email-notifications" 
                        isChecked={notifications.email}
                        onChange={e => setNotifications({...notifications, email: e.target.checked})}
                        colorScheme="brand"
                      />
                    </FormControl>
                    
                    <FormControl display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <FormLabel htmlFor="push-notifications" mb="0">
                          Push Notifications
                        </FormLabel>
                        <Text fontSize="sm" color="gray.500">
                          Receive push notifications in browser
                        </Text>
                      </Box>
                      <Switch 
                        id="push-notifications" 
                        isChecked={notifications.push}
                        onChange={e => setNotifications({...notifications, push: e.target.checked})}
                        colorScheme="brand"
                      />
                    </FormControl>
                    
                    <FormControl display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <FormLabel htmlFor="task-reminders" mb="0">
                          Task Reminders
                        </FormLabel>
                        <Text fontSize="sm" color="gray.500">
                          Receive reminders for upcoming tasks
                        </Text>
                      </Box>
                      <Switch 
                        id="task-reminders" 
                        isChecked={notifications.reminders}
                        onChange={e => setNotifications({...notifications, reminders: e.target.checked})}
                        colorScheme="brand"
                      />
                    </FormControl>
                    
                    <FormControl display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <FormLabel htmlFor="task-updates" mb="0">
                          Task Updates
                        </FormLabel>
                        <Text fontSize="sm" color="gray.500">
                          Receive notifications when tasks are updated
                        </Text>
                      </Box>
                      <Switch 
                        id="task-updates" 
                        isChecked={notifications.taskUpdates}
                        onChange={e => setNotifications({...notifications, taskUpdates: e.target.checked})}
                        colorScheme="brand"
                      />
                    </FormControl>
                    
                    <FormControl display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <FormLabel htmlFor="weekly-digest" mb="0">
                          Weekly Digest
                        </FormLabel>
                        <Text fontSize="sm" color="gray.500">
                          Receive a weekly summary of your tasks
                        </Text>
                      </Box>
                      <Switch 
                        id="weekly-digest" 
                        isChecked={notifications.weeklyDigest}
                        onChange={e => setNotifications({...notifications, weeklyDigest: e.target.checked})}
                        colorScheme="brand"
                      />
                    </FormControl>
                    
                    <Button onClick={handleNotificationUpdate} leftIcon={<FiSave />} colorScheme="blue">
                      Save Preferences
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>
            
            {/* Preferences Tab */}
            <TabPanel p={0}>
              <Card>
                <CardHeader>
                  <Heading size="md">Application Preferences</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={6} align="stretch">
                    <FormControl>
                      <FormLabel>Default View</FormLabel>
                      <Select 
                        value={preferences.defaultView}
                        onChange={e => setPreferences({...preferences, defaultView: e.target.value})}
                      >
                        <option value="list">List View</option>
                        <option value="board">Board View</option>
                        <option value="calendar">Calendar View</option>
                      </Select>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Default Filter</FormLabel>
                      <Select 
                        value={preferences.defaultFilter}
                        onChange={e => setPreferences({...preferences, defaultFilter: e.target.value})}
                      >
                        <option value="all">All Tasks</option>
                        <option value="today">Today</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="priority">Priority</option>
                      </Select>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Default Sort</FormLabel>
                      <Select 
                        value={preferences.defaultSort}
                        onChange={e => setPreferences({...preferences, defaultSort: e.target.value})}
                      >
                        <option value="dueDate">Due Date</option>
                        <option value="priority">Priority</option>
                        <option value="createdAt">Creation Date</option>
                        <option value="title">Alphabetical</option>
                      </Select>
                    </FormControl>
                    
                    <Divider />
                    
                    <FormControl display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <FormLabel htmlFor="show-completed" mb="0">
                          Show Completed Tasks
                        </FormLabel>
                        <Text fontSize="sm" color="gray.500">
                          Display completed tasks in task lists
                        </Text>
                      </Box>
                      <Switch 
                        id="show-completed" 
                        isChecked={preferences.showCompletedTasks}
                        onChange={e => setPreferences({...preferences, showCompletedTasks: e.target.checked})}
                        colorScheme="brand"
                      />
                    </FormControl>
                    
                    <FormControl display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <FormLabel htmlFor="auto-archive" mb="0">
                          Auto-Archive Completed Tasks
                        </FormLabel>
                        <Text fontSize="sm" color="gray.500">
                          Automatically archive tasks after completion
                        </Text>
                      </Box>
                      <Switch 
                        id="auto-archive" 
                        isChecked={preferences.autoArchiveCompleted}
                        onChange={e => setPreferences({...preferences, autoArchiveCompleted: e.target.checked})}
                        colorScheme="brand"
                      />
                    </FormControl>
                    
                    <Button onClick={handlePreferencesUpdate} leftIcon={<FiSave />} colorScheme="blue">
                      Save Preferences
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Layout>
  );
};

export default Settings;