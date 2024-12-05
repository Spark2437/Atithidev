import React from "react";
import { View, Text, Image, FlatList, Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

function BrideFamilyDetails({ route }) {
  const { familyDetails } = route.params;

  // Extract the necessary data for rendering
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

export default BrideFamilyDetails;

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
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Black background with transparency for better contrast
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
});
