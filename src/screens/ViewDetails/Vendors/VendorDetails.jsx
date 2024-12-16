import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const VendorDetails = ({ route }) => {
  const { vendorUUID, eventUUID } = route.params; 
  const [vendorDetails, setVendorDetails] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        const response = await fetch('https://guest-event-app.onrender.com/api/VendorDetailsbypage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            VendorUUID: vendorUUID,
            EventUUID: eventUUID,
          }),
        });

        const data = await response.json();
        if (data.status_code === 200 && data.Details.length > 0) {
          setVendorDetails(data.Details[0]);
        } else {
          console.error('Failed to fetch vendor details');
        }
      } catch (error) {
        console.error('Error fetching vendor details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorDetails();
  }, [vendorUUID, eventUUID]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.loadingText}>Loading vendor details...</Text>
      </View>
    );
  }

  if (!vendorDetails) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.errorText}>No details available for this vendor.</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['rgba(232, 198, 188, 0.8)', 'rgba(146, 101, 89, 0.5)']}
      locations={[0.3, 0.9]}
      style={styles.gradientContainer}
    >
      <ScrollView style={styles.container}>
        <Text style={styles.title}>{vendorDetails.VendorName}</Text>
        {vendorDetails.VendorImage && (
          <Image source={{ uri: vendorDetails.VendorImage }} style={styles.image} />
        )}
        <Text style={styles.shortDescription}>{vendorDetails.VendorDescription}</Text>
        <Text style={styles.location}>Location: {vendorDetails.VendorLocation}</Text>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 10,
    marginTop: 40,
  },
  image: {
    width: '100%', 
    height: 400,   
    resizeMode: 'contain', 
},

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  shortDescription: {
    fontSize: 16,
    color: 'black',
    marginBottom: 10,
    marginTop:10, 
  },
  location: {
    fontSize: 14,
    color: 'black',
    marginBottom: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
  },
});

export default VendorDetails;
