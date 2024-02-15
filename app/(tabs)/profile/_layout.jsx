import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { Stack, useSegments, useRouter, Slot } from 'expo-router'
import { useAuth } from '@/context/AuthContext';

const ProfileLayout = () => {
    const {isAuthenticated} = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (typeof isAuthenticated == 'undefined') {
            router.push('/profile/login'); //TODO: Replace with loading screen...
        }
        // check if user is in user segment
        const isInUserPage = (segments.includes('user'));
        if (isAuthenticated && !isInUserPage) {
            router.push('/profile/user');
        } else if (!isAuthenticated) {
            router.push('/profile/login');
        }
    }, [isAuthenticated]);
    return <Slot />
}

export default function _layout() {
  return (
    <ProfileLayout />
  )
}