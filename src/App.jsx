import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
// import { UserProvider, useUserContext } from "./contexts/UserContext";  // Commented out UserContext logic
import AuthNavigator from "./Navigator/AuthNavigator";
import MainNavigator from "./Navigator/MainNavigator";
// import AsyncStorage from "@react-native-async-storage/async-storage"; // Commented out AsyncStorage logic

const App = () => {
  // const { UserID, setUserID } = useUserContext(); // Commented out UserID and state logic
  // const [isChecked, setIsChecked] = useState(false); // Commented out state logic

  // useEffect(() => {
  //   const checkUserStatus = async () => {
  //     try {
  //       const storedUserID = await AsyncStorage.getItem("UserID"); // Commented out AsyncStorage logic
  //       if (storedUserID) {
  //         setUserID(storedUserID); // Commented out UserID setting logic
  //       }
  //     } catch (error) {
  //       console.error("Error fetching UserID from AsyncStorage", error);
  //     } finally {
  //       setIsChecked(true); // Commented out state update logic
  //     }
  //   };

  //   checkUserStatus();
  // }, [setUserID]);

  // if (!isChecked) {
  //   return null; // Commented out logic for loading state
  // }

  return (
    <NavigationContainer>
      {/* Always start from AuthNavigator */}
      <AuthNavigator />
    </NavigationContainer>
  );
};

// const AppWithProvider = () => (
//   <UserProvider>
//     <App />
//   </UserProvider>
// ); // Commented out UserProvider logic

export default App;
