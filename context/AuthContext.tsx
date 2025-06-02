import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const secureStoreWeb = {
  getItemAsync: (key: string) => {
    return localStorage.getItem(key);
  },
  setItemAsync: (key: string, value: string) => {
    localStorage.setItem(key, value);
    return Promise.resolve();
  },
  deleteItemAsync: (key: string) => {
    localStorage.removeItem(key);
    return Promise.resolve();
  },
};

const secureStore = Platform.OS === 'web' ? secureStoreWeb : SecureStore;

type MechanicInfo = {
  address: string;
  phone: string;
  specialization: string;
  experience: string;
};

type User = {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'mechanic';
  mechanicInfo?: MechanicInfo;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role: 'user' | 'mechanic') => Promise<void>;
  signOut: () => Promise<void>;
  updateMechanicInfo: (info: MechanicInfo) => Promise<void>;
  mechanic: {
    uploadCertificate: (certificateUri: string) => Promise<void>;
    isVerified: boolean;
  };
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMechanicVerified, setIsMechanicVerified] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userJSON = await secureStore.getItemAsync('user');
        if (userJSON) {
          const loadedUser = JSON.parse(userJSON);
          setUser(loadedUser);
          
          if (loadedUser.role === 'mechanic') {
            const verificationStatus = await secureStore.getItemAsync('mechanicVerified');
            setIsMechanicVerified(verificationStatus === 'true');
          }
        }
      } catch (error) {
        console.error('Failed to load user from storage', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const mockUser: User = {
        id: '1',
        email,
        name: 'John Doe',
        role: 'mechanic', // For testing mechanic flow
        mechanicInfo: {
          address: '',
          phone: '',
          specialization: '',
          experience: '',
        },
      };
      
      await secureStore.setItemAsync('user', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      console.error('Error signing in', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, role: 'user' | 'mechanic') => {
    setIsLoading(true);
    try {
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name,
        role,
        ...(role === 'mechanic' && {
          mechanicInfo: {
            address: '',
            phone: '',
            specialization: '',
            experience: '',
          },
        }),
      };
      
      await secureStore.setItemAsync('user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      if (role === 'mechanic') {
        setIsMechanicVerified(false);
      }
    } catch (error) {
      console.error('Error signing up', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateMechanicInfo = async (info: MechanicInfo) => {
    if (!user || user.role !== 'mechanic') return;

    try {
      const updatedUser = {
        ...user,
        mechanicInfo: info,
      };
      await secureStore.setItemAsync('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating mechanic info', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await secureStore.deleteItemAsync('user');
      setUser(null);
    } catch (error) {
      console.error('Error signing out', error);
      throw error;
    }
  };
  
  const uploadCertificate = async (certificateUri: string) => {
    try {
      console.log('Uploading certificate:', certificateUri);
      await secureStore.setItemAsync('mechanicVerified', 'true');
      setIsMechanicVerified(true);
    } catch (error) {
      console.error('Error uploading certificate', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider 
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        updateMechanicInfo,
        mechanic: {
          uploadCertificate,
          isVerified: isMechanicVerified,
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};