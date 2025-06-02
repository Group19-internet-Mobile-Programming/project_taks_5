import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Lock, Mail, User, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import React from 'react';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'user' | 'mechanic'>('user');
  const [error, setError] = useState('');
  
  const router = useRouter();
  const { signUp, isLoading } = useAuth();
  const { colors } = useTheme();

  const handleRegister = async () => {
    if (!email || !password || !name) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      setError('');
      await signUp(email, password, name, role);
      
      if (role === 'mechanic') {
        router.replace('/(mechanic)/verification');
      } else {
        router.replace('/(tabs)');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 30,
    },
    logo: {
      width: 100,
      height: 100,
      marginBottom: 10,
    },
    title: {
      fontSize: 28,
      fontFamily: 'Poppins-Bold',
      color: colors.primary,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      fontFamily: 'Poppins-Regular',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 30,
      paddingHorizontal: 20,
    },
    form: {
      paddingHorizontal: 24,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 12,
      paddingHorizontal: 16,
      marginBottom: 16,
      height: 56,
      borderWidth: 1,
      borderColor: colors.border,
    },
    inputIcon: {
      marginRight: 12,
    },
    input: {
      flex: 1,
      color: colors.text,
      fontFamily: 'Poppins-Regular',
    },
    errorText: {
      color: colors.error,
      marginBottom: 16,
      fontFamily: 'Poppins-Regular',
      textAlign: 'center',
    },
    roleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 24,
    },
    roleOption: {
      flex: 1,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginHorizontal: 5,
      borderWidth: 2,
    },
    activeRole: {
      borderColor: colors.primary,
      backgroundColor: 'rgba(255, 215, 0, 0.1)',
    },
    inactiveRole: {
      borderColor: colors.border,
      backgroundColor: colors.card,
    },
    roleText: {
      fontFamily: 'Poppins-Medium',
      marginTop: 8,
    },
    activeRoleText: {
      color: colors.primary,
    },
    inactiveRoleText: {
      color: colors.text,
    },
    buttonContainer: {
      marginTop: 10,
      overflow: 'hidden',
      borderRadius: 12,
    },
    button: {
      height: 56,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      color: colors.secondary,
      fontSize: 16,
      fontFamily: 'Poppins-Bold',
    },
    loginContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 24,
      marginBottom: 40,
    },
    loginText: {
      color: colors.text,
      fontFamily: 'Poppins-Regular',
    },
    loginLink: {
      color: colors.primary,
      fontFamily: 'Poppins-Medium',
      marginLeft: 4,
    },
    image: {
      width: 44,
      height: 44,
      marginBottom: 8,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/3807386/pexels-photo-3807386.jpeg' }} 
            style={styles.logo} 
            resizeMode="contain"
          />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join our community to diagnose car issues</Text>
        </View>
        
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <User size={20} color={colors.primary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor={colors.tabIconDefault}
              value={name}
              onChangeText={setName}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Mail size={20} color={colors.primary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={colors.tabIconDefault}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Lock size={20} color={colors.primary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={colors.tabIconDefault}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          
          <View style={styles.roleContainer}>
            <TouchableOpacity 
              style={[
                styles.roleOption, 
                role === 'user' ? styles.activeRole : styles.inactiveRole
              ]}
              onPress={() => setRole('user')}
            >
              <User size={24} color={role === 'user' ? colors.primary : colors.text} />
              <Text style={[
                styles.roleText, 
                role === 'user' ? styles.activeRoleText : styles.inactiveRoleText
              ]}>
                User
              </Text>
              {role === 'user' && <Check size={16} color={colors.primary} style={{position: 'absolute', top: 8, right: 8}} />}
            </TouchableOpacity>
            
          <TouchableOpacity 
            style={[
              styles.roleOption, 
              role === 'mechanic' ? styles.activeRole : styles.inactiveRole
            ]}
            onPress={() => setRole('mechanic')}
          >
            <Image
              source={require('../../assets/images/mech.jpg')}
              style={styles.image}
              resizeMode="contain"
            />

              <Text style={[
                styles.roleText, 
                role === 'mechanic' ? styles.activeRoleText : styles.inactiveRoleText
              ]}>
                Mechanic
              </Text>
              {role === 'mechanic' && <Check size={16} color={colors.primary} style={{position: 'absolute', top: 8, right: 8}} />}
            </TouchableOpacity>
          </View>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <View style={styles.buttonContainer}>
            <LinearGradient
              colors={['#FFD700', '#FFC000']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <TouchableOpacity onPress={handleRegister} disabled={isLoading} style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={styles.buttonText}>
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
          
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}