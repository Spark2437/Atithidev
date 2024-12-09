import React, { useRef, useState } from "react";
import { View, Image, FlatList, Dimensions, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Ensure you have this dependency installed

const { width, height } = Dimensions.get("window");

function GroomFamilyDetails({ route }) {
  const { familyDetails } = route.params;
  const members = familyDetails.Data || [];
  const flatListRef = useRef(null); // Reference to the FlatList
  const [currentIndex, setCurrentIndex] = useState(0); // State to track the current index

  const renderItem = ({ item }) => (
    <View style={styles.imageWrapper}>
      <Image source={{ uri: item.Image }} style={styles.fullScreenImage} />
      <View style={styles.textOverlay}>
        <Text style={styles.memberName}>{item.MemberName}</Text>
        <Text style={styles.relation}>{item.Relation}</Text>
        <Text style={styles.description}>{item.ShortDescription}</Text>
      </View>
    </View>
  );

  const goToNextSlide = () => {
    if (currentIndex < members.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPreviousSlide = () => {
    if (currentIndex > 0) {
      flatListRef.current.scrollToIndex({ index: currentIndex - 1 });
      setCurrentIndex(currentIndex - 1);
    }
  };

  const onScroll = (event) => {
    const index = Math.floor(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={members}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll} // Track scrolling
        scrollEventThrottle={16} // For smoother updates
      />
      <TouchableOpacity style={styles.arrowButtonLeft} onPress={goToPreviousSlide}>
        <Ionicons name="arrow-back" size={30} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.arrowButtonRight} onPress={goToNextSlide}>
        <Ionicons name="arrow-forward" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

export default GroomFamilyDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageWrapper: {
    width,
    height,
    position: "relative",
  },
  fullScreenImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  textOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  memberName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  relation: {
    fontSize: 18,
    color: "#fff",
  },
  description: {
    fontSize: 16,
    color: "#fff",
  },
  arrowButtonLeft: {
    position: "absolute",
    top: "50%",
    left: 10,
    zIndex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 25,
    padding: 10,
  },
  arrowButtonRight: {
    position: "absolute",
    top: "50%",
    right: 10,
    zIndex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 25,
    padding: 10,
  },
});
