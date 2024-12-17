import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';

const Gift = ({ navigation }) => {
  const handlePress = () => {
    
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20, 
    zIndex: 1, 
  },
  backgroundImage: {
    width: '100%',
    height: '100%', 
    justifyContent: 'flex-start',
    alignItems: 'center', 
  },
  text: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    position: 'absolute', 
    top: 190, 
    left: '50%', 
    transform: [{ translateX: -150 }], 
    zIndex: 1, 
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 177, 
    left: '50%', 
    transform: [{ translateX: -55 }], 
    zIndex: 1, 
  },
  button: {
    backgroundColor: '#D08A76',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25, 
   marginRight: 20,
  },
  buttonText: {
    color: 'white', 
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Gift;
