import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient"; 
import { BlurView } from 'expo-blur'; 

const OurStory = ({ route }) => {
  const { eventUUID } = route.params;
  const [storyData, setStoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isHolding, setIsHolding] = useState(false);

  useEffect(() => {
    fetch(`https://guest-event-app.onrender.com/api/EventStorybyuuid`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ EventUUID: eventUUID }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status_code === 200 && data.Data.length > 0) {
          setStoryData(data.Data);
        } else {
          setError("No stories found for this event.");
        }
      })
      .catch((err) => {
        setError("Error fetching stories: " + err.message);
      })
      .finally(() => setLoading(false));
  }, [eventUUID]);

  const startTimer = () => {
    const id = setInterval(() => {
      setElapsedTime((prevTime) => prevTime + 1);
    }, 1000);
    setIntervalId(id);
  };

  const stopTimer = () => {
    clearInterval(intervalId);
  };

  const moveToNextStory = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % storyData.length);
    setElapsedTime(0);
  };

  const handleTap = () => {
    stopTimer();
    moveToNextStory();
    setTimeout(startTimer, 500);
  };

  const handleLongPressIn = () => {
    stopTimer();
    setIsHolding(true);
  };

  const handleLongPressOut = () => {
    setIsHolding(false);
    startTimer();
  };

  useEffect(() => {
    if (storyData.length > 0) {
      startTimer();
    }

    return () => clearInterval(intervalId);
  }, [storyData]);

  useEffect(() => {
    if (elapsedTime >= 5 && !isHolding) {
      moveToNextStory();
    }
  }, [elapsedTime]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  const currentStory = storyData[currentIndex];

  return (
    <LinearGradient
      colors={["rgba(232, 198, 188, 0.8)", "rgba(146, 101, 89, 0.5)"]}
      style={styles.gradientContainer}
    >
      <View style={styles.container}>

        <Image
          source={{ uri: currentStory.Image }}
          style={[styles.storyImage, { opacity: elapsedTime >= 5 ? 0.5 : 1 }]}
        />

        <BlurView intensity={50} style={styles.blurContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.storyTitle}>{currentStory.Title}</Text>
            <Text style={styles.storyDescription}>{currentStory.Short_description}</Text>
          </View>
        </BlurView>

        <Text style={styles.pageTitle}>#OUR STORY</Text>
        
        <TouchableOpacity
          onPress={handleTap}
          onLongPress={handleLongPressIn}
          onPressOut={handleLongPressOut}
          delayLongPress={500}
          activeOpacity={1}
          style={styles.touchableArea}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,  
    color: "black", 
    position: "absolute",
    top: 20, 
  },
  touchableArea: {
    flex: 1,
    justifyContent: "flex-end", 
    alignItems: "center",
    width: "100%",
  },
  storyImage: {
    width: "100%",
    height: "100%",  
    resizeMode: "cover",
    position: "absolute",
    top: 0,
    left: 0,
  },
  blurContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)", 
  },
  storyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    marginBottom: 10,
  },
  storyDescription: {
    fontSize: 18,
    fontStyle: "italic", 
    color: "white",
    textAlign: "center",
  },
  errorText: {
    textAlign: "center",
    color: "red",
    fontSize: 18,
  },
});

export default OurStory; 