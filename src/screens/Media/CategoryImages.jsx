import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const CategoryImages = ({ route }) => {
  const { category, images } = route.params;
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>{category}</Text>
      <FlatList
        data={images}
        numColumns={3}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={() => setSelectedImage(item)}
          >
            <Image
              source={{ uri: item.Image }}
              style={styles.image}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.gridContainer}
      />

      {/* Full-Screen Image Modal */}
      {selectedImage && (
        <Modal
          visible={!!selectedImage}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setSelectedImage(null)}
        >
          <TouchableOpacity
            style={styles.fullScreenContainer}
            onPress={() => setSelectedImage(null)}
          >
            <Image
              source={{ uri: selectedImage.Image }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 15,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  gridContainer: {
    justifyContent: "space-between",
  },
  imageContainer: {
    margin: 2,
    width: "31%", 
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: 8,
  },
  fullScreenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: width,
    height: height,
    backgroundColor:'black', 
  },
});

export default CategoryImages;
