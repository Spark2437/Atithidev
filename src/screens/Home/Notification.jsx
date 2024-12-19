import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons"; 



Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Notification = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [expoPushToken, setExpoPushToken] = useState("");

  useEffect(() => {
    registerForPushNotifications();
    fetchNotifications();
  }, []);


  
  const registerForPushNotifications = async () => {
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log("Expo Push Token:", token);
      setExpoPushToken(token);
    } else {
      alert("Must use a physical device for Push Notifications");
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        "https://guest-event-app.onrender.com/api/Notifiactionpopup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.status_code === 200 && data.status === "Success") {
        const notificationsData = data.Data;

        notificationsData.forEach((notification) => {
          scheduleNotificationOnce(
            notification.Title,
            notification.Body,
            notification.NotificationTiming,
            notification.EventUUID
          );
        });

        setNotifications(notificationsData);
      } else {
        console.log("Error: Invalid response from API");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const scheduleNotificationOnce = async (title, body, timing, eventId) => {
    const isNotificationSent = await AsyncStorage.getItem(
      `notification_${eventId}`
    );
    if (isNotificationSent) {
      return;
    }

    const triggerTime = new Date(timing);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        sound: true,
      },
      trigger: {
        date: triggerTime,
      },
    });

    await AsyncStorage.setItem(`notification_${eventId}`, "true");
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["rgba(232, 198, 188, 0.8)", "rgba(146, 101, 89, 0.5)"]}
        locations={[0.3, 0.9]}
        style={styles.gradientContainer}
      >
        {/* Header with Back Button */}
        <View style={[styles.header]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Notifications</Text>
        </View>

        <ScrollView style={styles.scrollContainer}>
          {notifications.map((notif, index) => {
            return (
              <TouchableOpacity key={index} style={styles.card}>
                <View style={styles.textBox}>
                  <View style={styles.textContent}>
                    <Text style={styles.h1} numberOfLines={1}>
                      {notif.Title}
                    </Text>
                    <Text style={styles.relativeTime}>
                      {notif.RelativeTime}
                    </Text>
                  </View>
                  <Text style={styles.p}>{notif.Body}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
          
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientContainer: {
    flex: 1,
  },
  header: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    
  },
  backButton: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 24,
    color: "black",
    fontFamily: 'Baskervville_400Regular',
  },
  scrollContainer: {
    padding: 10,
  
  },
  card: {
      width: "100%",
      height: 80,
      backgroundColor: "#F0F0F0",
      borderRadius: 20,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      marginBottom: 10,
      backdropFilter: "blur(10px)",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
      transition: "0.5s",
  },
  textBox: {
    flex: 1,
  },
  textContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 2, 
  },
  
  h1: {
    fontSize: 16,
    color: "black",
    flex: 1,
    marginLeft: 20,
    fontFamily: 'Poppins_400Regular',
  },
  relativeTime: {
    fontSize: 14,
    color: "gray",
    fontFamily: 'Roboto_400Regular',
  },
  p: {
    fontSize: 12,
    color: "black",
    marginTop: 5,
    marginLeft: 20,
    fontFamily: 'PTSans_400Regular',
  },
});

export default Notification;
