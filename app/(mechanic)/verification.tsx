import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { Upload, CheckCircle, FileText } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';

export default function MechanicVerificationScreen() {
  const [certificateUri, setCertificateUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { colors } = useTheme();
  const { mechanic } = useAuth();
  const router = useRouter();

  // Handle navigation when mechanic is verified
useEffect(() => {
  if (mechanic.isVerified && router.canGoBack()) {
    router.replace('/(tabs)');
  }
}, [mechanic.isVerified, router]);

  const pickDocument = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setCertificateUri(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!certificateUri) return;
    
    setUploading(true);
    try {
      await mechanic.uploadCertificate(certificateUri);
      // In a real app, you'd wait for verification
      // For now, we'll mock the verification success
      setTimeout(() => {
        setUploading(false);
        router.replace('/(tabs)');
      }, 2000);
    } catch (error) {
      console.error('Error uploading certificate:', error);
      setUploading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      padding: 24,
    },
    header: {
      alignItems: 'center',
      marginTop: 40,
      marginBottom: 30,
    },
    title: {
      fontSize: 28,
      fontFamily: 'Poppins-Bold',
      color: colors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      fontFamily: 'Poppins-Regular',
      color: colors.tabIconDefault,
      textAlign: 'center',
      marginBottom: 16,
    },
    uploadSection: {
      marginTop: 20,
    },
    uploadTitle: {
      fontSize: 18,
      fontFamily: 'Poppins-Medium',
      color: colors.text,
      marginBottom: 16,
    },
    uploadContainer: {
      height: 200,
      borderWidth: 2,
      borderColor: colors.border,
      borderStyle: 'dashed',
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.card,
      marginBottom: 20,
    },
    uploadIcon: {
      marginBottom: 16,
      padding: 16,
      borderRadius: 50,
      backgroundColor: 'rgba(255, 215, 0, 0.1)',
    },
    uploadText: {
      fontSize: 16,
      fontFamily: 'Poppins-Regular',
      color: colors.tabIconDefault,
      textAlign: 'center',
      marginHorizontal: 32,
    },
    certificatePreview: {
      width: '100%',
      height: 200,
      borderRadius: 16,
      marginBottom: 20,
    },
    requirementSection: {
      marginTop: 20,
      marginBottom: 30,
    },
    requirementTitle: {
      fontSize: 18,
      fontFamily: 'Poppins-Medium',
      color: colors.text,
      marginBottom: 16,
    },
    requirementItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    checkIcon: {
      marginRight: 10,
      marginTop: 2,
    },
    requirementText: {
      flex: 1,
      fontSize: 14,
      fontFamily: 'Poppins-Regular',
      color: colors.text,
    },
    uploadButton: {
      marginTop: 20,
      overflow: 'hidden',
      borderRadius: 12,
    },
    uploadGradient: {
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 12,
    },
    uploadButtonText: {
      textAlign: 'center',
      fontSize: 16,
      fontFamily: 'Poppins-Bold',
      color: colors.secondary,
    },
    noteText: {
      fontSize: 14,
      fontFamily: 'Poppins-Regular',
      color: colors.tabIconDefault,
      textAlign: 'center',
      marginTop: 16,
    },
  });

  if (uploading) {
    return (
      <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{marginTop: 20, fontFamily: 'Poppins-Medium', color: colors.text}}>
          Uploading your certificate...
        </Text>
      </View>
    );
  }

  // Don't render anything if mechanic is verified (navigation will handle it)
  if (mechanic.isVerified) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <FileText size={60} color={colors.primary} />
          <Text style={styles.title}>Mechanic Verification</Text>
          <Text style={styles.subtitle}>
            Please upload your mechanic certification to get verified
          </Text>
        </View>
        
        <View style={styles.uploadSection}>
          <Text style={styles.uploadTitle}>Upload Certification</Text>
          
          {!certificateUri ? (
            <TouchableOpacity 
              style={styles.uploadContainer}
              onPress={pickDocument}
            >
              <View style={styles.uploadIcon}>
                <Upload size={32} color={colors.primary} />
              </View>
              <Text style={styles.uploadText}>
                Tap to upload a photo of your mechanic certification or license
              </Text>
            </TouchableOpacity>
          ) : (
            <Image source={{ uri: certificateUri }} style={styles.certificatePreview} />
          )}
          
          {certificateUri && (
            <TouchableOpacity 
              style={styles.uploadButton}
              onPress={handleUpload}
            >
              <LinearGradient
                colors={['#FFD700', '#FFC000']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.uploadGradient}
              >
                <Text style={styles.uploadButtonText}>
                  Submit for Verification
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.requirementSection}>
          <Text style={styles.requirementTitle}>Requirements</Text>
          
          <View style={styles.requirementItem}>
            <CheckCircle size={18} color={colors.success} style={styles.checkIcon} />
            <Text style={styles.requirementText}>
              Valid professional mechanic certification or license
            </Text>
          </View>
          
          <View style={styles.requirementItem}>
            <CheckCircle size={18} color={colors.success} style={styles.checkIcon} />
            <Text style={styles.requirementText}>
              Clear, readable image showing your name and certification details
            </Text>
          </View>
          
          <View style={styles.requirementItem}>
            <CheckCircle size={18} color={colors.success} style={styles.checkIcon} />
            <Text style={styles.requirementText}>
              Proof of current employment at an auto repair shop (optional, but recommended)
            </Text>
          </View>
          
          <View style={styles.requirementItem}>
            <CheckCircle size={18} color={colors.success} style={styles.checkIcon} />
            <Text style={styles.requirementText}>
              Any specialized training certificates (optional)
            </Text>
          </View>
          
          <Text style={styles.noteText}>
            Your certification will be reviewed by our team. This process usually takes 1-2 business days.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}