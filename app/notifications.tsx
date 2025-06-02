import React from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
import { useNotificationsContext } from '@/context/NotificationsContext';
import Colors from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';


interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'engine_result' | 'dashboard_result' | 'mechanic_message';
  linkId?: string;
}

export default function NotificationsScreen() {
  const router = useRouter();
  const { notifications, markAsRead } = useNotificationsContext();
  const { colors } = useTheme();
  const colorScheme = useColorScheme();

  const renderItem = ({ item }: { item: NotificationItem }) => (
    <Pressable
      style={[
        styles(colors).notificationItem,
        !item.read && styles(colors).notificationItemUnread
      ]}
      onPress={() => {
        markAsRead(item.id);
        if (item.type === 'engine_result') {
          router.push({ pathname: '/(tabs)/diagnose/engine_result', params: { id: item.linkId } });
        } else if (item.type === 'dashboard_result') {
          router.push({ pathname: '/(tabs)/diagnose/dashboard_result', params: { id: item.linkId } });
        } else if (item.type === 'mechanic_message') {
          router.push({ pathname: '/mechanics', params: { id: item.linkId } });
        }
      }}
    >
      <View style={styles(colors).notificationItemIcon}>
        <Bell size={24} color={colors.primary} />
      </View>
      <View style={styles(colors).notificationItemContent}>
        <Text style={styles(colors).notificationItemTitle}>{item.title}</Text>
        <Text style={styles(colors).notificationItemMessage}>{item.message}</Text>
        <Text style={styles(colors).notificationItemDate}>
          {new Date(item.date).toLocaleDateString()}
        </Text>
      </View>
      {!item.read && <View style={styles(colors).unreadDot} />}
      <ChevronRight size={20} color={colors.tabIconDefault} />
    </Pressable>
  );

  return (
    <SafeAreaView style={styles(colors).container}>
      <LinearGradient
        colors={colorScheme === 'dark' ? [colors.primary, colors.secondary] : [colors.primary, '#0f1a6b']}
        style={styles(colors).header}
      >
        <View style={styles(colors).headerContent}>
          <Text style={styles(colors).headerTitle}>Notifications</Text>
        </View>
      </LinearGradient>

      <View style={styles(colors).content}>
        {notifications.length > 0 ? (
          <FlatList
            data={notifications}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles(colors).list}
          />
        ) : (
          <View style={styles(colors).emptyState}>
            <Bell size={48} color={colors.tabIconDefault} />
            <Text style={styles(colors).emptyStateTitle}>No notifications</Text>
            <Text style={styles(colors).emptyStateText}>
              You'll receive notifications here when your diagnostics are complete or when mechanics respond
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = (colors: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    height: 100,
    paddingHorizontal: 16,
    paddingBottom: 16,
    justifyContent: 'flex-end',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  list: {
    paddingBottom: 24,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  notificationItemUnread: {
    backgroundColor: colors.border,
    borderColor: colors.primary,
    borderWidth: 1,
  },
  notificationItemIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  notificationItemContent: {
    flex: 1,
  },
  notificationItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  notificationItemMessage: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.8,
    marginBottom: 4,
    lineHeight: 20,
  },
  notificationItemDate: {
    fontSize: 12,
    color: colors.tabIconDefault,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginRight: 10,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.tabIconDefault,
    textAlign: 'center',
    lineHeight: 22,
  },
});