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
  useColorModeValue,
  Divider,
  List,
  ListItem,
  ListIcon,
  chakra,
  Stack,
  Badge,
  Grid,
  GridItem,
  Circle,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useBreakpointValue
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  FiCheckCircle, 
  FiCpu, 
  FiBell, 
  FiCalendar, 
  FiList, 
  FiPieChart, 
  FiArrowRight, 
  FiCheck,
  FiEdit,
  FiZap,
  FiGrid,
  FiLayers,
  FiRefreshCw,
  FiTarget,
  FiAward,
  FiLifeBuoy
} from 'react-icons/fi';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

// Enhanced Feature Card with before/after representation
const FeatureCard = ({ 
  icon, 
  title, 
  description,
  color = "brand.500"
}: { 
  icon: React.ReactElement, 
  title: string, 
  description: string,
  color?: string
}) => {
  return (
    <Box 
      p={6} 
      borderRadius="lg" 
      borderWidth="1px" 
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      bg={useColorModeValue('white', 'gray.800')} 
      shadow="md"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-5px)', shadow: 'lg', borderColor: color }}
      height="100%"
    >
      <Flex direction="column" align="flex-start" h="100%">
        <Box fontSize="3xl" color={color} mb={4}>
          {icon}
        </Box>
        <Heading as="h3" size="md" mb={2} color="gray.800">{title}</Heading>
        <Text color={useColorModeValue('gray.600', 'gray.400')}>{description}</Text>
      </Flex>
    </Box>
  );
};

// Step card for showing the transformation process
const StepCard = ({ 
  number, 
  title, 
  description 
}: { 
  number: number, 
  title: string, 
  description: string 
}) => {
  return (
    <Box position="relative" pl={16} pb={8}>
      <Circle 
        size="40px" 
        bg="yellow.500" 
        color="gray.800" 
        fontWeight="bold" 
        position="absolute" 
        left={0} 
        top={0}
      >
        {number}
      </Circle>
      <Box ml={4}>
        <Heading as="h3" size="md" mb={2}>
          {title}
        </Heading>
        <Text color="gray.600">
          {description}
        </Text>
      </Box>
    </Box>
  );
};

// Testimonial component
const Testimonial = ({ 
  quote, 
  author, 
  role 
}: { 
  quote: string, 
  author: string, 
  role: string 
}) => {
  return (
    <Box 
      p={6} 
      bg={useColorModeValue('white', 'gray.800')} 
      borderRadius="lg"
      borderWidth="1px"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      shadow="md"
    >
      <Text fontSize="lg" fontStyle="italic" mb={4}>
        "{quote}"
      </Text>
      <Flex align="center">
        <Circle size="40px" bg="accent.500" color="white" fontWeight="bold" mr={3}>
          {author.charAt(0)}
        </Circle>
        <Box>
          <Text fontWeight="bold">{author}</Text>
          <Text fontSize="sm" color="gray.500">{role}</Text>
        </Box>
      </Flex>
    </Box>
  );
};

// Before/After panel
const BeforeAfterPanel = () => {
  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} width="full" py={8}>
      <Box 
        p={6} 
        borderRadius="lg" 
        bg="red.50" 
        borderWidth="1px" 
        borderColor="red.200"
      >
        <Heading as="h3" size="md" color="red.500" mb={4}>Before LifeTask AI</Heading>
        <List spacing={3}>
          <ListItem>
            <ListIcon as={FiCheck} color="red.500" />
            Overwhelmed by complex projects with too many steps
          </ListItem>
          <ListItem>
            <ListIcon as={FiCheck} color="red.500" />
            Struggling to prioritize and figure out where to start
          </ListItem>
          <ListItem>
            <ListIcon as={FiCheck} color="red.500" />
            Missing deadlines and feeling constantly stressed
          </ListItem>
          <ListItem>
            <ListIcon as={FiCheck} color="red.500" />
            No clear way to track progress or maintain momentum
          </ListItem>
          <ListItem>
            <ListIcon as={FiCheck} color="red.500" />
            Projects often abandoned before completion
          </ListItem>
        </List>
      </Box>
      
      <Box 
        p={6} 
        borderRadius="lg" 
        bg="green.50" 
        borderWidth="1px" 
        borderColor="green.200"
      >
        <Heading as="h3" size="md" color="green.500" mb={4}>After LifeTask AI</Heading>
        <List spacing={3}>
          <ListItem>
            <ListIcon as={FiCheck} color="green.500" />
            Projects automatically broken down into achievable subtasks
          </ListItem>
          <ListItem>
            <ListIcon as={FiCheck} color="green.500" />
            AI-powered prioritization that tells you exactly what to do next
          </ListItem>
          <ListItem>
            <ListIcon as={FiCheck} color="green.500" />
            Smart reminders keep you on track and meeting deadlines
          </ListItem>
          <ListItem>
            <ListIcon as={FiCheck} color="green.500" />
            Visual progress tracking provides motivation and clarity
          </ListItem>
          <ListItem>
            <ListIcon as={FiCheck} color="green.500" />
            Increased completion rate and reduced stress
          </ListItem>
        </List>
      </Box>
    </SimpleGrid>
  );
};

// Visual task breakdown example
const TaskBreakdownExample = () => {
  return (
    <Box 
      borderWidth="1px" 
      borderRadius="lg" 
      overflow="hidden" 
      bg={useColorModeValue('white', 'gray.800')}
      shadow="xl"
      my={8}
    >
      <Box p={4} bg="brand.500" color="white">
        <Heading size="md">Example: Home Renovation Project</Heading>
      </Box>
      
      <Box p={4}>
        <VStack align="stretch" divider={<Divider />} spacing={4}>
          {/* Main Task */}
          <Box p={4} bg="yellow.50" borderRadius="md" borderLeftWidth="4px" borderLeftColor="yellow.500">
            <Badge colorScheme="yellow" mb={1}>Main Project</Badge>
            <Heading size="md">Complete Kitchen Renovation</Heading>
            <Text color="gray.600" mt={1}>Transform the outdated kitchen into a modern cooking space</Text>
          </Box>
          
          {/* AI Generated Subtasks */}
          <Box>
            <Flex align="center" mb={4}>
              <Icon as={FiCpu} color="purple.500" mr={2} />
              <Text fontWeight="bold" color="purple.500">AI-Generated Subtasks</Text>
            </Flex>
            
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Box p={3} bg="brand.50" borderRadius="md" borderLeftWidth="3px" borderLeftColor="brand.500">
                <HStack mb={1}>
                  <Badge colorScheme="brand">Phase 1</Badge>
                  <Badge colorScheme="red">High Priority</Badge>
                </HStack>
                <Text fontWeight="bold">Planning and Design</Text>
                <Text fontSize="sm" color="gray.600">Create budget, finalize design plans, select materials</Text>
              </Box>
              
              <Box p={3} bg="brand.50" borderRadius="md" borderLeftWidth="3px" borderLeftColor="brand.500">
                <HStack mb={1}>
                  <Badge colorScheme="brand">Phase 2</Badge>
                  <Badge colorScheme="yellow">Medium Priority</Badge>
                </HStack>
                <Text fontWeight="bold">Demolition</Text>
                <Text fontSize="sm" color="gray.600">Remove old cabinets, flooring, and appliances</Text>
              </Box>
              
              <Box p={3} bg="brand.50" borderRadius="md" borderLeftWidth="3px" borderLeftColor="brand.500">
                <HStack mb={1}>
                  <Badge colorScheme="brand">Phase 3</Badge>
                  <Badge colorScheme="yellow">Medium Priority</Badge>
                </HStack>
                <Text fontWeight="bold">Electrical and Plumbing</Text>
                <Text fontSize="sm" color="gray.600">Update wiring and plumbing to meet new layout requirements</Text>
              </Box>
              
              <Box p={3} bg="brand.50" borderRadius="md" borderLeftWidth="3px" borderLeftColor="brand.500">
                <HStack mb={1}>
                  <Badge colorScheme="brand">Phase 4</Badge>
                  <Badge colorScheme="green">Low Priority</Badge>
                </HStack>
                <Text fontWeight="bold">Installation</Text>
                <Text fontSize="sm" color="gray.600">Install new cabinets, countertops, and appliances</Text>
              </Box>
              
              <Box p={3} bg="brand.50" borderRadius="md" borderLeftWidth="3px" borderLeftColor="brand.500">
                <HStack mb={1}>
                  <Badge colorScheme="brand">Phase 5</Badge>
                  <Badge colorScheme="green">Low Priority</Badge>
                </HStack>
                <Text fontWeight="bold">Finishing Touches</Text>
                <Text fontSize="sm" color="gray.600">Paint, install backsplash, and final cleanup</Text>
              </Box>
            </SimpleGrid>
          </Box>
          
          {/* AI Suggestions */}
          <Box p={4} bg="purple.50" borderRadius="md">
            <Flex align="center" mb={2}>
              <Icon as={FiZap} color="purple.500" mr={2} />
              <Text fontWeight="bold" color="purple.500">AI Suggestions</Text>
            </Flex>
            <Text fontSize="sm">
              Consider hiring a plumber for the complex pipe relocation. Based on your timeline, 
              start searching for contractors at least 4 weeks before your target start date. 
              Remember to check permit requirements for your city.
            </Text>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

const LandingPage: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const bgGradient = useColorModeValue(
    'linear(to-b, brand.50, gray.50)',
    'linear(to-b, gray.900, gray.800)'
  );
  
  const isDesktop = useBreakpointValue({ base: false, lg: true });

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
              <Badge colorScheme="yellow" fontSize="md" px={3} py={1} borderRadius="full">
                AI-Powered Productivity
              </Badge>
              
              <Heading 
                as="h1" 
                size="2xl" 
                fontWeight="bold" 
                color="gray.800"
                lineHeight="1.2"
              >
                Transform overwhelming projects into achievable steps
              </Heading>
              
              <Text fontSize="xl" color={useColorModeValue('gray.600', 'gray.300')}>
                Stop feeling paralyzed by large, complex projects. LifeTask AI breaks down
                your biggest challenges into clear, manageable steps and helps you prioritize
                exactly what to do next.
              </Text>
              
              <HStack spacing={4} pt={4}>
                {isAuthenticated ? (
                  <Button 
                    as={RouterLink} 
                    to="/dashboard" 
                    size="lg" 
                    bg="yellow.500"
                    color="gray.800"
                    _hover={{ bg: 'yellow.400' }}
                    rounded="full" 
                    px={8}
                    rightIcon={<FiArrowRight />}
                  >
                    Go to Dashboard
                  </Button>
                ) : (
                  <>
                    <Button 
                      as={RouterLink} 
                      to="/register" 
                      size="lg" 
                      bg="yellow.500"
                      color="gray.800"
                      _hover={{ bg: 'yellow.400' }}
                      rounded="full" 
                      px={8}
                      rightIcon={<FiArrowRight />}
                    >
                      Start Breaking Down Projects
                    </Button>
                    <Button 
                      as={RouterLink} 
                      to="/login" 
                      size="lg" 
                      variant="outline" 
                      borderColor="brand.500"
                      color="brand.500"
                      _hover={{ bg: 'brand.50' }}
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
              borderWidth="1px"
              borderColor="gray.200"
            >
              <Image 
                src="https://via.placeholder.com/600x400/c3a55c/FFFFFF?text=LifeTask+AI+Dashboard" 
                alt="LifeTask AI Dashboard Preview" 
                fallbackSrc="https://via.placeholder.com/600x400/c3a55c/FFFFFF?text=LifeTask+AI+Dashboard"
              />
            </Box>
          </Flex>
        </Container>
      </Box>
      
      {/* Problem-Solution Section */}
      <Box bg={useColorModeValue('white', 'gray.800')} py={16} px={4}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center" maxW="container.md" mx="auto">
              <Badge colorScheme="red" fontSize="md" px={3} py={1} borderRadius="full">
                THE PROBLEM
              </Badge>
              <Heading as="h2" size="xl">Why do big projects feel so overwhelming?</Heading>
              <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.400')}>
                Most people struggle to complete large projects because they don't know how to 
                break them down effectively or decide what to do first.
              </Text>
            </VStack>
            
            <BeforeAfterPanel />
            
            <VStack spacing={4} textAlign="center" maxW="container.md" mx="auto" pt={8}>
              <Badge colorScheme="green" fontSize="md" px={3} py={1} borderRadius="full">
                THE SOLUTION
              </Badge>
              <Heading as="h2" size="xl">AI-powered project breakdown</Heading>
              <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.400')}>
                LifeTask AI uses advanced artificial intelligence to analyze your projects, 
                create a strategic breakdown, and guide you step-by-step to completion.
              </Text>
            </VStack>
            
            <TaskBreakdownExample />
          </VStack>
        </Container>
      </Box>
      
      {/* How It Works Section */}
      <Box bg={useColorModeValue('gray.50', 'gray.700')} py={16} px={4}>
        <Container maxW="container.xl">
          <VStack spacing={16}>
            <VStack spacing={4} textAlign="center">
              <Badge colorScheme="brand" fontSize="md" px={3} py={1} borderRadius="full">
                HOW IT WORKS
              </Badge>
              <Heading as="h2" size="xl">Your path from overwhelmed to accomplished</Heading>
              <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.400')} maxW="container.md">
                Our proven process transforms your overwhelming projects into achievable goals
              </Text>
            </VStack>
            
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={10}>
              <GridItem>
                <VStack align="stretch" spacing={10}>
                  <StepCard 
                    number={1} 
                    title="Enter your project" 
                    description="Simply describe what you're trying to accomplish, whether it's a home renovation, career transition, or any large goal."
                  />
                  <StepCard 
                    number={3} 
                    title="Get a prioritized action plan" 
                    description="Receive an intelligent breakdown with clear priorities, timelines, and dependencies between tasks."
                  />
                  <StepCard 
                    number={5} 
                    title="Track progress visually" 
                    description="Watch your progress grow with intuitive charts and celebrate each completed step along the way."
                  />
                </VStack>
              </GridItem>
              
              <GridItem>
                <VStack align="stretch" spacing={10} pt={{ base: 0, md: 16 }}>
                  <StepCard 
                    number={2} 
                    title="AI analyzes your project" 
                    description="Our AI engine identifies the necessary steps, optimal sequence, and potential obstacles for your specific project."
                  />
                  <StepCard 
                    number={4} 
                    title="Follow guided execution" 
                    description="Focus on one task at a time with AI assistance providing tips, resources, and suggestions at each step."
                  />
                  <StepCard 
                    number={6} 
                    title="Complete with confidence" 
                    description="Finish your project on time with less stress and a clear methodology you can apply to future goals."
                  />
                </VStack>
              </GridItem>
            </Grid>
            
            <Button 
              as={RouterLink} 
              to={isAuthenticated ? "/dashboard" : "/register"} 
              size="lg" 
              bg="yellow.500"
              color="gray.800"
              _hover={{ bg: 'yellow.400' }}
              rounded="full" 
              px={8}
              rightIcon={<FiArrowRight />}
              mt={6}
            >
              {isAuthenticated ? "Go to Dashboard" : "Start Your First Project"}
            </Button>
          </VStack>
        </Container>
      </Box>
      
      {/* Key Features Section */}
      <Container maxW="container.xl" py={20}>
        <VStack spacing={16}>
          <VStack spacing={4} textAlign="center" maxW="container.md" mx="auto">
            <Badge colorScheme="accent" fontSize="md" px={3} py={1} borderRadius="full">
              KEY FEATURES
            </Badge>
            <Heading as="h2" size="xl">Powerful tools for complex projects</Heading>
            <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.400')}>
              LifeTask AI combines advanced task management with artificial intelligence 
              to help you tackle your biggest challenges
            </Text>
          </VStack>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10} width="full">
            <FeatureCard 
              icon={<Icon as={FiLayers} />} 
              title="Smart Project Breakdown" 
              description="AI analyzes your project and creates a structured hierarchy of manageable tasks and subtasks automatically"
              color="yellow.500"
            />
            <FeatureCard 
              icon={<Icon as={FiTarget} />} 
              title="Priority Intelligence" 
              description="Get AI recommendations on what to focus on next based on dependencies, deadlines, and project flow"
              color="accent.500"
            />
            <FeatureCard 
              icon={<Icon as={FiZap} />} 
              title="Personalized Suggestions" 
              description="Receive tailored advice, resources, and step-by-step guidance for completing each task effectively"
              color="purple.500"
            />
            <FeatureCard 
              icon={<Icon as={FiCalendar} />} 
              title="Visual Timeline & Calendar" 
              description="See your project timeline visually with a clear view of upcoming deadlines and milestones"
              color="blue.500"
            />
            <FeatureCard 
              icon={<Icon as={FiRefreshCw} />} 
              title="Adaptive Replanning" 
              description="When priorities change or timelines shift, AI helps reorganize your plan to keep you on track"
              color="green.500"
            />
            <FeatureCard 
              icon={<Icon as={FiAward} />} 
              title="Progress Analytics" 
              description="Track completion rates and productivity patterns with detailed reports and insights"
              color="red.500"
            />
          </SimpleGrid>
        </VStack>
      </Container>
      
      {/* Testimonials Section */}
      <Box bg={useColorModeValue('gray.50', 'gray.700')} py={16} px={4}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Badge colorScheme="lime" fontSize="md" px={3} py={1} borderRadius="full">
                SUCCESS STORIES
              </Badge>
              <Heading as="h2" size="xl">From overwhelmed to accomplished</Heading>
              <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.400')} maxW="container.md">
                See how others have used LifeTask AI to conquer their biggest projects
              </Text>
            </VStack>
            
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
              <Testimonial 
                quote="I was completely stuck on how to approach my home remodeling project. LifeTask AI broke it down into clear phases that made it so much less intimidating. I'm now halfway through and right on schedule!"
                author="Sarah K."
                role="Homeowner"
              />
              <Testimonial 
                quote="As a freelancer juggling multiple client projects, I was constantly overwhelmed. This app helps me break each project into concrete steps and prioritize across all my clients. My delivery rate has improved dramatically."
                author="Michael J."
                role="Freelance Designer"
              />
              <Testimonial 
                quote="Writing my thesis seemed impossible until I used LifeTask AI to break it into manageable chapters and research steps. The AI suggestions were surprisingly insightful about academic workflow."
                author="Priya T."
                role="Graduate Student"
              />
            </SimpleGrid>
            
            <Box pt={8} textAlign="center">
              <Button 
                as={RouterLink} 
                to={isAuthenticated ? "/dashboard" : "/register"} 
                size="lg" 
                bg="yellow.500"
                color="gray.800"
                _hover={{ bg: 'yellow.400' }}
                rounded="full" 
                px={8}
              >
                {isAuthenticated ? "Go to Dashboard" : "Join Them Today"}
              </Button>
            </Box>
          </VStack>
        </Container>
      </Box>
      
      {/* FAQ Section */}
      <Container maxW="container.xl" py={20}>
        <VStack spacing={12}>
          <VStack spacing={4} textAlign="center" maxW="container.md" mx="auto">
            <Badge colorScheme="blue" fontSize="md" px={3} py={1} borderRadius="full">
              FREQUENTLY ASKED QUESTIONS
            </Badge>
            <Heading as="h2" size="xl">Got questions? We've got answers</Heading>
          </VStack>
          
          <Accordion allowToggle width="full" maxW="container.md" mx="auto">
            <AccordionItem>
              <h2>
                <AccordionButton py={4}>
                  <Box flex="1" textAlign="left" fontWeight="medium">
                    How does the AI break down my projects?
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                Our AI analyzes your project description and goals, then uses advanced language processing to identify 
                necessary steps, dependencies, and optimal sequencing. It draws from knowledge of similar project 
                structures to create a comprehensive breakdown customized to your specific needs.
              </AccordionPanel>
            </AccordionItem>
            
            <AccordionItem>
              <h2>
                <AccordionButton py={4}>
                  <Box flex="1" textAlign="left" fontWeight="medium">
                    What kinds of projects work best with LifeTask AI?
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                LifeTask AI works well with virtually any complex project that has multiple steps and requires 
                planning. This includes home renovations, career transitions, educational goals, product launches, 
                event planning, content creation, and personal goals like fitness transformations. The more 
                specific your project description, the better the breakdown will be.
              </AccordionPanel>
            </AccordionItem>
            
            <AccordionItem>
              <h2>
                <AccordionButton py={4}>
                  <Box flex="1" textAlign="left" fontWeight="medium">
                    How is this different from other task management apps?
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                Unlike traditional task managers where you manually create and organize every task, LifeTask AI 
                automatically breaks down your projects for you. Our intelligent prioritization system tells you 
                exactly what to focus on next, and the AI assistant provides contextual advice for each step.
                We focus specifically on making large, overwhelming projects manageable.
              </AccordionPanel>
            </AccordionItem>
            
            <AccordionItem>
              <h2>
                <AccordionButton py={4}>
                  <Box flex="1" textAlign="left" fontWeight="medium">
                    Is there a limit to how many projects I can manage?
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                The free plan allows for up to 3 active projects with basic AI features. Our premium plans
                offer unlimited projects, advanced AI prioritization, and additional features like timeline
                visualization and integration capabilities.
              </AccordionPanel>
            </AccordionItem>
            
            <AccordionItem>
              <h2>
                <AccordionButton py={4}>
                  <Box flex="1" textAlign="left" fontWeight="medium">
                    Can I customize the AI-generated breakdown?
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                Absolutely! While the AI provides an initial breakdown, you have full control to add, edit,
                or remove tasks, change priorities, adjust timelines, and reorganize the structure. The system
                learns from your edits to provide even better breakdowns for future projects.
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </VStack>
      </Container>
      
      {/* CTA Section */}
      <Box bg="yellow.500" py={16} px={4}>
        <Container maxW="container.md" textAlign="center">
          <VStack spacing={8}>
            <Icon as={FiLifeBuoy} boxSize={16} color="gray.800" />
            <Heading as="h2" size="xl" color="gray.800">
              Stop feeling overwhelmed by big projects
            </Heading>
            <Text fontSize="xl" color="gray.800" maxW="container.sm" mx="auto">
              Join thousands of users who have transformed overwhelming projects into achievable steps.
              Start breaking down your biggest challenges today.
            </Text>
            <HStack spacing={4} pt={4}>
              {isAuthenticated ? (
                <Button 
                  as={RouterLink} 
                  to="/dashboard" 
                  size="lg" 
                  bg="brand.500" 
                  color="white" 
                  _hover={{ bg: 'brand.600' }} 
                  rounded="full" 
                  px={8}
                  rightIcon={<FiArrowRight />}
                >
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button 
                    as={RouterLink} 
                    to="/register" 
                    size="lg" 
                    bg="brand.500" 
                    color="white" 
                    _hover={{ bg: 'brand.600' }} 
                    rounded="full" 
                    px={8}
                    rightIcon={<FiArrowRight />}
                  >
                    Start Free Trial
                  </Button>
                  <Button 
                    as={RouterLink} 
                    to="/login" 
                    size="lg" 
                    variant="outline" 
                    borderColor="gray.800" 
                    color="gray.800" 
                    _hover={{ bg: 'yellow.400' }}
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
      <Box bg={useColorModeValue('gray.800', 'gray.900')} py={10} color="white">
        <Container maxW="container.xl">
          <Flex 
            justify="space-between" 
            direction={{ base: 'column', md: 'row' }} 
            align="center" 
            textAlign={{ base: 'center', md: 'left' }}
          >
            <VStack align={{ base: 'center', md: 'flex-start' }} mb={{ base: 4, md: 0 }}>
              <Heading size="md" color="yellow.500">LifeTask AI</Heading>
              <Text fontSize="sm" color="gray.400">Transforming overwhelming projects into achievable steps</Text>
            </VStack>
            <HStack spacing={6}>
              <Text as="a" href="#" color="yellow.300">Privacy</Text>
              <Text as="a" href="#" color="yellow.300">Terms</Text>
              <Text as="a" href="#" color="yellow.300">Contact</Text>
              <Text as="a" href="#" color="yellow.300">About</Text>
            </HStack>
          </Flex>
          <Divider my={6} borderColor="gray.700" />
          <Text textAlign="center" fontSize="sm" color="gray.500">
            &copy; {new Date().getFullYear()} LifeTask AI. All rights reserved.
          </Text>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;