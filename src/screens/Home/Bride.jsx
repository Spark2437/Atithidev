import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const Bride = () => {
  const brideDescription =
    "Ritika, a creative soul with roots in Delhi, is an MBA graduate with a flair for innovation. Her hobbies include painting, baking delightful treats, and curling up with a good book. Ritika’s warm personality and zest for life bring energy to every room she enters.";

  return (
    <LinearGradient colors={["#f4f4f4", "#d3c6b3"]} style={styles.gradientContainer}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Meet the Bride</Text>
          <Text style={styles.description}>{brideDescription}</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 30,
    width: "90%",
    borderColor: "#D4AF37",
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    color: "#C19264",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
  },
});

export default Bride;
