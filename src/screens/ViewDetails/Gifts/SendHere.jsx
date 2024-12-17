import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SendHere = () => {
  const [thoughts, setThoughts] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');

  const handleSubmit = () => {
 
    console.log('Thoughts:', thoughts);
    console.log('Payment Amount:', paymentAmount);
  };

  const flowerIcon = <Ionicons name="flower" size={24} color="#D08A76" />; 
  
  const renderFlowerIcons = () => {
    const icons = [];
    for (let i = 0; i < 20; i++) {
      icons.push(
        <View
          key={i}
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`, 
            opacity: 0.3 + Math.random() * 0.5, 
            transform: [{ scale: 0.8 + Math.random() * 0.4 }], 
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
       
        <View style={styles.flowerIconsContainer}>{renderFlowerIcons()}</View>

        <Text style={styles.headerText}>Send your Blessings to the Bride and Groom.</Text>
        
      
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.largeTextBox}
            multiline
            value={thoughts}
            onChangeText={setThoughts}
            placeholder="Write your message here to send"
            placeholderTextColor="transparent" 
          />
          {!thoughts && <Text style={styles.placeholderText}>Write your message here </Text>}
        </View>
        
    
        <View style={styles.buttonContainer}>
          <Button title="Share Your Thoughts" onPress={handleSubmit} color="#D08A76" />
        </View>

        <Text style={styles.headerText}>
          Send Your Shagun ka Lifafa
        </Text>
        
      
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
    paddingHorizontal: 20,
    backgroundColor: 'white', 
  },
  scrollContainer: {
    flexGrow: 1,
    width: '100%',
    justifyContent: 'flex-start',
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
    zIndex: -1, 
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
    width: '90%', 
    height: 150,
    position: 'relative',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeTextBox: {
    width: '100%',
    height: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: 'white', 
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
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 10,
  },
});

export default SendHere;
