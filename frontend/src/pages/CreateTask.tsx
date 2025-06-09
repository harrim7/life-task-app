import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  VStack,
  Heading,
  useToast,
  FormErrorMessage,
  Flex,
  Switch,
  HStack,
  Text,
  Divider,
  Card,
  CardBody,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiCalendar, FiAward, FiSave, FiCpu } from 'react-icons/fi';
import Layout from '../components/Layout';
import { useTask } from '../context/TaskContext';

const CreateTask: React.FC = () => {
  const [useAI, setUseAI] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createTask, breakdownTask } = useTask();
  const navigate = useNavigate();
  const toast = useToast();
  
  // Form validation schema
  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required').min(3, 'Title must be at least 3 characters'),
    description: Yup.string(),
    category: Yup.string().required('Category is required'),
    priority: Yup.string().required('Priority is required'),
    dueDate: Yup.date().nullable()
  });
  
  // Formik setup
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      category: 'work',
      priority: 'medium',
      dueDate: null as Date | null,
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      
      try {
        const taskData = {
          title: values.title,
          description: values.description,
          category: values.category as any,
          priority: values.priority as any,
          dueDate: values.dueDate || undefined
        };
        
        // Create the task
        const createdTask = await createTask(taskData);
        
        // If AI assistance is enabled, break down the task
        if (useAI && createdTask) {
          toast({
            title: 'Task created',
            description: 'Now using AI to break down your task...',
            status: 'info',
            duration: 5000,
            isClosable: true
          });
          
          await breakdownTask(createdTask._id);
          
          toast({
            title: 'Task breakdown complete',
            description: 'AI has created subtasks for your task',
            status: 'success',
            duration: 3000,
            isClosable: true
          });
        } else {
          toast({
            title: 'Task created',
            status: 'success',
            duration: 3000,
            isClosable: true
          });
        }
        
        // Navigate to task detail
        navigate(`/tasks/${createdTask._id}`);
      } catch (err) {
        toast({
          title: 'Error',
          description: err instanceof Error ? err.message : 'Failed to create task',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  });
  
  return (
    <Layout>
      <Heading mb={6}>Create New Task</Heading>
      
      <Card shadow="sm" mb={6}>
        <CardBody>
          <form onSubmit={formik.handleSubmit}>
            <VStack spacing={6} align="start">
              <FormControl 
                isInvalid={!!formik.errors.title && formik.touched.title}
                isRequired
              >
                <FormLabel htmlFor="title">Task Title</FormLabel>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter task title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <FormErrorMessage>{formik.errors.title}</FormErrorMessage>
              </FormControl>
              
              <FormControl>
                <FormLabel htmlFor="description">Description</FormLabel>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter task description"
                  rows={4}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </FormControl>
              
              <Flex width="100%" gap={6} direction={{ base: 'column', md: 'row' }}>
                <FormControl isRequired>
                  <FormLabel htmlFor="category">Category</FormLabel>
                  <Select
                    id="category"
                    name="category"
                    value={formik.values.category}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="work">Work</option>
                    <option value="home">Home</option>
                    <option value="finance">Finance</option>
                    <option value="health">Health</option>
                    <option value="family">Family</option>
                    <option value="other">Other</option>
                  </Select>
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel htmlFor="priority">Priority</FormLabel>
                  <Select
                    id="priority"
                    name="priority"
                    value={formik.values.priority}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel htmlFor="dueDate">Due Date</FormLabel>
                  <Box position="relative">
                    <DatePicker
                      selected={formik.values.dueDate}
                      onChange={(date) => formik.setFieldValue('dueDate', date)}
                      customInput={
                        <Input 
                          placeholder="Select date" 
                          pr="10"
                        />
                      }
                      dateFormat="MMM d, yyyy"
                      minDate={new Date()}
                    />
                    <Box
                      position="absolute"
                      top="50%"
                      right="2"
                      transform="translateY(-50%)"
                      color="gray.500"
                      pointerEvents="none"
                    >
                      <FiCalendar />
                    </Box>
                  </Box>
                </FormControl>
              </Flex>
              
              <Divider />
              
              <FormControl>
                <Flex align="center">
                  <Switch 
                    colorScheme="blue" 
                    size="lg" 
                    isChecked={useAI}
                    onChange={() => setUseAI(!useAI)}
                    id="use-ai"
                    mr={3}
                  />
                  <Box>
                    <FormLabel htmlFor="use-ai" mb="0" cursor="pointer">
                      <Flex align="center">
                        <FiCpu style={{ marginRight: '8px' }} /> 
                        <Text fontWeight="medium">Use AI to break down this task</Text>
                      </Flex>
                    </FormLabel>
                    <Text fontSize="sm" color="gray.600">
                      AI will automatically create subtasks for this task
                    </Text>
                  </Box>
                </Flex>
              </FormControl>
              
              {useAI && (
                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  <Text fontSize="sm">
                    AI will analyze your task title and description to generate relevant subtasks
                    with appropriate priorities and due dates.
                  </Text>
                </Alert>
              )}
              
              <HStack width="100%" justify="flex-end" pt={4}>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/dashboard')}
                  isDisabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  colorScheme="blue"
                  leftIcon={<FiSave />}
                  isLoading={isSubmitting}
                  loadingText="Creating Task"
                >
                  Create Task
                </Button>
              </HStack>
            </VStack>
          </form>
        </CardBody>
      </Card>
    </Layout>
  );
};

export default CreateTask;