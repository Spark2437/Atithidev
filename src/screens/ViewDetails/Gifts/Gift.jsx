import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';

const Gift = ({ navigation }) => {
  const handlePress = () => {
    // Navigate to the SendHere page when the button is pressed
    navigation.navigate('SendHere');
  };

  return (
    <View style={styles.container}>
      {/* Text above the ImageBackground */}
      <Text style={styles.headerText}>Your Gift Awaits!</Text>

      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1612611450279-51b46599e6ff?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }} 
        style={styles.backgroundImage}
      >
        {/* Text positioned at the top */}
        <Text style={styles.text}>Even if you're far away, send your blessings and shagun to join in the celebration of love and happiness.</Text>

        {/* Button below the text */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Text style={styles.buttonText}>Send from Here</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center the content vertically
    alignItems: 'center', // Center the content horizontally
  },
  headerText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20, // Space between text and the image
    zIndex: 1, // Ensure the header text stays on top
  },
  backgroundImage: {
    width: '100%',
    height: '100%', // Make the image cover the full screen
    justifyContent: 'flex-start', // Align the content at the top
    alignItems: 'center', // Center text horizontally within the image
  },
  text: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    position: 'absolute', // Position the text absolutely
    top: 190, // Distance from the top of the screen
    left: '50%', // Horizontally center the text
    transform: [{ translateX: -150 }], // Adjust for text width
    zIndex: 1, // Ensure the text stays on top
  },
  buttonContainer: {
    position: 'absolute', // Position the button absolutely
    bottom: 177, // Distance from the bottom
    left: '50%', // Horizontally center the button
    transform: [{ translateX: -55 }], // Adjust for button width
    zIndex: 1, // Ensure the button stays on top
  },
  button: {
    backgroundColor: '#D08A76', // Set button background color
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25, // Rounded corners for the button
   marginRight: 20,
  },
  buttonText: {
    color: 'white', // Set text color to white
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Gift;
