import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SendHere = () => {
  const [thoughts, setThoughts] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');

  const handleSubmit = () => {
    // Handle submission (e.g., send data to backend)
    console.log('Thoughts:', thoughts);
    console.log('Payment Amount:', paymentAmount);
  };

  const flowerIcon = <Ionicons name="flower" size={24} color="#D08A76" />; // Flower icon from Ionicons
  
  const renderFlowerIcons = () => {
    const icons = [];
    for (let i = 0; i < 20; i++) {
      icons.push(
        <View
          key={i}
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`, // Random horizontal position
            top: `${Math.random() * 100}%`, // Random vertical position
            opacity: 0.3 + Math.random() * 0.5, // Random opacity for subtle background effect
            transform: [{ scale: 0.8 + Math.random() * 0.4 }], // Random scale for variety
          }}
        >
          {flowerIcon}
        </View>
      );
    }
    return icons;
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Render flower icons in the background */}
        <View style={styles.flowerIconsContainer}>{renderFlowerIcons()}</View>

        <Text style={styles.headerText}>Send your Blessings to the Bride and Groom.</Text>
        
        {/* Text Input for writing thoughts with placeholder */}
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.largeTextBox}
            multiline
            value={thoughts}
            onChangeText={setThoughts}
            placeholder="Write your message here to send"
            placeholderTextColor="transparent" // Hide the default placeholder
          />
          {!thoughts && <Text style={styles.placeholderText}>Write your message here </Text>}
        </View>
        
        {/* Button to submit thoughts */}
        <View style={styles.buttonContainer}>
          <Button title="Share Your Thoughts" onPress={handleSubmit} color="#D08A76" />
        </View>

        <Text style={styles.headerText}>
          Send Your Shagun ka Lifafa
        </Text>
        
        {/* Button to submit payment */}
        <View style={styles.buttonContainer}>
          <Button title="Pay Now" onPress={handleSubmit} color="#D08A76" />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white', // Ensure white background for contrast
  },
  scrollContainer: {
    flexGrow: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flowerIconsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1, // Place icons behind the content
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    marginTop: 60,
    color: 'black', 
  },
  textInputContainer: {
    width: 300, // Adjust width to fit better
    height: 150,
    position: 'relative',
    marginBottom: 20,
  },
  largeTextBox: {
    width: '100%',
    height: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: 'white', // Ensure the background is white for text input
  },
  placeholderText: {
    position: 'absolute',
    top: 10,
    left: 15,
    fontSize: 16,
    color: 'grey',
    fontStyle: 'italic',
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 10,
  },
});

export default SendHere;
