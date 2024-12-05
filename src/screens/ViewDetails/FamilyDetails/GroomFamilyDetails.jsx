import React from "react";
import { View, Image, FlatList, Dimensions, StyleSheet, Text } from "react-native";

const { width, height } = Dimensions.get("window");

function GroomFamilyDetails({ route }) {
  const { familyDetails } = route.params;

  const members = familyDetails.Data || [];

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

  return (
    <FlatList
      data={members}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
    />
  );
}

export default GroomFamilyDetails;

const styles = StyleSheet.create({
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
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Same overlay style
    padding: 20,
  },
  memberName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff", // Consistent white text color
  },
  relation: {
    fontSize: 18,
    color: "#fff",
  },
  description: {
    fontSize: 16,
    color: "#fff",
  },
});
