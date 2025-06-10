import React from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Flex, 
  Heading, 
  Text, 
  VStack, 
  HStack, 
  SimpleGrid, 
  Icon,
  Image,
  useColorModeValue
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiCheckCircle, FiCpu, FiBell, FiCalendar, FiList, FiPieChart } from 'react-icons/fi';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

const FeatureCard = ({ icon, title, description }: { icon: React.ReactElement, title: string, description: string }) => {
  return (
    <Box 
      p={6} 
      borderRadius="lg" 
      borderWidth="1px" 
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      bg={useColorModeValue('white', 'gray.800')} 
      shadow="md"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-5px)', shadow: 'lg' }}
    >
      <Flex direction="column" align="center" textAlign="center">
        <Box fontSize="3xl" color="brand.500" mb={4}>
          {icon}
        </Box>
        <Heading as="h3" size="md" mb={2}>{title}</Heading>
        <Text color={useColorModeValue('gray.600', 'gray.400')}>{description}</Text>
      </Flex>
    </Box>
  );
};

const LandingPage: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const bgGradient = useColorModeValue(
    'linear(to-b, brand.50, white)',
    'linear(to-b, gray.900, gray.800)'
  );

  return (
    <Box>
      <Header isLoggedIn={isAuthenticated} onLogout={logout} />
      
      {/* Hero Section */}
      <Box bgGradient={bgGradient} py={20} px={4}>
        <Container maxW="container.xl">
          <Flex 
            direction={{ base: 'column', lg: 'row' }} 
            align="center" 
            justify="space-between"
            gap={10}
          >
            <VStack 
              spacing={6} 
              align={{ base: 'center', lg: 'flex-start' }} 
              textAlign={{ base: 'center', lg: 'left' }}
              maxW={{ lg: '50%' }}
            >
              <Heading 
                as="h1" 
                size="2xl" 
                fontWeight="bold" 
                color="brand.500"
                lineHeight="1.2"
              >
                Organize your life with AI-powered task management
              </Heading>
              
              <Text fontSize="xl" color={useColorModeValue('gray.600', 'gray.300')}>
                LifeTask AI helps you break down complex tasks, prioritize effectively,
                and receive intelligent suggestions for improved productivity.
              </Text>
              
              <HStack spacing={4} pt={4}>
                {isAuthenticated ? (
                  <Button 
                    as={RouterLink} 
                    to="/dashboard" 
                    size="lg" 
                    colorScheme="brand" 
                    rounded="full" 
                    px={8}
                  >
                    Go to Dashboard
                  </Button>
                ) : (
                  <>
                    <Button 
                      as={RouterLink} 
                      to="/register" 
                      size="lg" 
                      colorScheme="brand" 
                      rounded="full" 
                      px={8}
                    >
                      Get Started Free
                    </Button>
                    <Button 
                      as={RouterLink} 
                      to="/login" 
                      size="lg" 
                      variant="outline" 
                      colorScheme="brand" 
                      rounded="full"
                    >
                      Log In
                    </Button>
                  </>
                )}
              </HStack>
            </VStack>
            
            <Box 
              maxW={{ lg: '50%' }} 
              borderRadius="xl" 
              overflow="hidden" 
              shadow="2xl"
            >
              <Image 
                src="https://via.placeholder.com/600x400/4299E1/FFFFFF?text=LifeTask+AI+Dashboard" 
                alt="LifeTask AI Dashboard Preview" 
                fallbackSrc="https://via.placeholder.com/600x400/4299E1/FFFFFF?text=LifeTask+AI+Dashboard"
              />
            </Box>
          </Flex>
        </Container>
      </Box>
      
      {/* Features Section */}
      <Container maxW="container.xl" py={20}>
        <VStack spacing={16}>
          <VStack spacing={4} textAlign="center" maxW="container.md" mx="auto">
            <Heading as="h2" size="xl">Features designed for productivity</Heading>
            <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.400')}>
              LifeTask AI combines powerful task management with artificial intelligence to help you accomplish more
            </Text>
          </VStack>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10} width="full">
            <FeatureCard 
              icon={<Icon as={FiCpu} />} 
              title="AI Task Breakdown" 
              description="Let AI break down complex tasks into manageable subtasks automatically"
            />
            <FeatureCard 
              icon={<Icon as={FiList} />} 
              title="Smart Task Organization" 
              description="Organize tasks by priority, category, and status for maximum clarity"
            />
            <FeatureCard 
              icon={<Icon as={FiBell} />} 
              title="Intelligent Reminders" 
              description="Get timely reminders for important tasks and deadlines"
            />
            <FeatureCard 
              icon={<Icon as={FiCalendar} />} 
              title="Visual Timeline" 
              description="See your tasks and deadlines in an intuitive calendar view"
            />
            <FeatureCard 
              icon={<Icon as={FiPieChart} />} 
              title="Progress Tracking" 
              description="Track completion rates and productivity patterns over time"
            />
            <FeatureCard 
              icon={<Icon as={FiCheckCircle} />} 
              title="Achievement System" 
              description="Stay motivated with achievements and productivity insights"
            />
          </SimpleGrid>
        </VStack>
      </Container>
      
      {/* CTA Section */}
      <Box bg="brand.500" py={16} px={4}>
        <Container maxW="container.md" textAlign="center">
          <VStack spacing={6}>
            <Heading as="h2" size="xl" color="white">
              Ready to become more productive?
            </Heading>
            <Text fontSize="lg" color="whiteAlpha.900">
              Join thousands of users who have transformed their productivity with LifeTask AI.
              Get started for free today.
            </Text>
            <HStack spacing={4} pt={4}>
              {isAuthenticated ? (
                <Button 
                  as={RouterLink} 
                  to="/dashboard" 
                  size="lg" 
                  bg="white" 
                  color="brand.500" 
                  _hover={{ bg: 'gray.100' }} 
                  rounded="full" 
                  px={8}
                >
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button 
                    as={RouterLink} 
                    to="/register" 
                    size="lg" 
                    bg="white" 
                    color="brand.500" 
                    _hover={{ bg: 'gray.100' }} 
                    rounded="full" 
                    px={8}
                  >
                    Sign Up Free
                  </Button>
                  <Button 
                    as={RouterLink} 
                    to="/login" 
                    size="lg" 
                    variant="outline" 
                    colorScheme="whiteAlpha" 
                    color="white" 
                    rounded="full"
                  >
                    Log In
                  </Button>
                </>
              )}
            </HStack>
          </VStack>
        </Container>
      </Box>
      
      {/* Footer */}
      <Box bg={useColorModeValue('gray.50', 'gray.900')} py={10}>
        <Container maxW="container.xl">
          <Flex justify="space-between" direction={{ base: 'column', md: 'row' }} align="center" textAlign={{ base: 'center', md: 'left' }}>
            <Text>&copy; {new Date().getFullYear()} LifeTask AI. All rights reserved.</Text>
            <HStack spacing={6} mt={{ base: 4, md: 0 }}>
              <Text as="a" href="#" color="brand.500">Privacy Policy</Text>
              <Text as="a" href="#" color="brand.500">Terms of Service</Text>
              <Text as="a" href="#" color="brand.500">Contact</Text>
            </HStack>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;