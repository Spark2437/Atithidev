import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const LoginScreen = ({ navigation }) => {
  const [mobile, setMobile] = useState(''); // State for mobile number
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    // Validate input
    if (!mobile || mobile.length !== 10 || isNaN(mobile)) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://guest-event-app.onrender.com/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile, // Only send mobile
        }),
      });

      // Check if the response was successful
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error Response:', errorData);
        alert(`Error: ${errorData.reason || 'Failed to send OTP'}`);
        return;
      }

      const data = await response.json();

      // Log the API response to the debugger
      console.log('API Response:', data);

      // Check for a successful OTP response
      if (data.status_code === 200) { // Assuming 200 indicates success
        console.log('OTP sent successfully');
        alert(data.message); // Show success message
        navigation.navigate('OTPScreen', { mobile }); // Pass only mobile to OTPScreen
      } else {
        alert('Error in sending OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Icon name="call" size={50} color="#333" style={styles.icon} />
      <Text style={styles.heading}>Enter Your Mobile Number</Text>
      <Text style={styles.subheading}>We will send you a confirmation code</Text>

      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        value={mobile}
        onChangeText={setMobile}
        keyboardType="numeric"
        maxLength={10}
      />

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Verify</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 20,
  },
  icon: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subheading: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  input: {
    width: '100%',
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#7da3d3',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default LoginScreen;