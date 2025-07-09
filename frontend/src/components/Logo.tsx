import React from 'react';
import { Box, HStack, Text } from '@chakra-ui/react';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg';
    showText?: boolean;
    color?: string;
}

const Logo: React.FC<LogoProps> = ({
    size = 'md',
    showText = true,
    color = 'indigo.500'
}) => {
    const sizeMap = {
        sm: { width: '24px', height: '24px' },
        md: { width: '32px', height: '32px' },
        lg: { width: '48px', height: '48px' }
    };

    const textSizeMap = {
        sm: 'sm',
        md: 'md',
        lg: 'lg'
    };

    return (
        <HStack spacing={2} align="center">
            <Box
                as="svg"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                {...sizeMap[size]}
                color={color}
            >
                <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: 'currentColor', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: 'currentColor', stopOpacity: 0.8 }} />
                    </linearGradient>
                </defs>

                {/* Background circle */}
                <circle cx="16" cy="16" r="15" fill="currentColor" opacity="0.1" />

                {/* Brain icon */}
                <path
                    d="M16 6 C20 6, 24 8, 24 12 C24 15, 22 17, 20 18 C22 19, 24 21, 24 24 C24 28, 20 30, 16 30 C12 30, 8 28, 8 24 C8 21, 10 19, 12 18 C10 17, 8 15, 8 12 C8 8, 12 6, 16 6 Z"
                    fill="url(#logoGradient)"
                    stroke="currentColor"
                    strokeWidth="1"
                />

                {/* Brain details */}
                <path d="M13 10 C14 11, 15 12, 16 12 C17 12, 18 11, 19 10" stroke="white" strokeWidth="1" fill="none" />
                <path d="M13 14 C14 15, 15 16, 16 16 C17 16, 18 15, 19 14" stroke="white" strokeWidth="1" fill="none" />
                <path d="M13 18 C14 19, 15 20, 16 20 C17 20, 18 19, 19 18" stroke="white" strokeWidth="1" fill="none" />

                {/* Lightning bolt */}
                <path d="M18 6 L15 12 L17 13 L14 18 L18 15 L16 14 Z" fill="white" />
            </Box>

            {showText && (
                <Text
                    fontSize={textSizeMap[size]}
                    fontWeight="bold"
                    color={color}
                    letterSpacing="tight"
                >
                    cavar.ai
                </Text>
            )}
        </HStack>
    );
};

export default Logo; 