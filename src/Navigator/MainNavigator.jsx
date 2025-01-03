import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useUserContext } from "../contexts/UserContext";
import AllEvents from "../screens/Home/AllEvents";
import Notification from "../screens/Home/Notification";
import SplashScreenEvents from "../screens/Home/SplashScreenEvents";
import EventDetailsScreen from "../screens/Home/EventDetailsScreen";
import ProfileScreen from "../screens/Home/ProfileScreen";
import OurStory from "../screens/Home/OurStory";
import Groom from "../screens/Home/Groom";
import Bride from "../screens/Home/Bride";
import ViewDetails from "../screens/ViewDetails/ViewDetails";
import RSVP from "../screens/Home/RSVPScreen";
import MediaScreen from "../screens/Media/MediaScreen";
import CategoryImages from "../screens/Media/CategoryImages";
import HostFamily from "../screens/ViewDetails/FamilyDetails/HostFamily";
import GroomFamilyDetails from "../screens/ViewDetails/FamilyDetails/GroomFamilyDetails";
import BrideFamilyDetails from "../screens/ViewDetails/FamilyDetails/BrideFamilyDetails";
import Gift from "../screens/ViewDetails/Gifts/Gift";
import EventSchedule from "../screens/ViewDetails/EventDetails/EventSchedule";
import Schedule from "../screens/ViewDetails/EventDetails/Schedule";
import Travel from "../screens/ViewDetails/Travel/Travel";
import TravelDetails from "../screens/ViewDetails/Travel/TravelDetails";
import SendHere from "../screens/ViewDetails/Gifts/SendHere";
import Vendors from "../screens/ViewDetails/Vendors/Vendors";
import VendorDetails from "../screens/ViewDetails/Vendors/VendorDetails";
import NextEvent from "../screens/ViewDetails/NextEvent/NextEvent";


const Stack = createStackNavigator();

const MainNavigator = () => {
  const { UserId, token } = useUserContext();  // Access UserId and token

  console.log("UserId in MainNavigator:", UserId);
  console.log("Token in MainNavigator:", token);

  return (
    <Stack.Navigator
      initialRouteName="AllEvents"
      screenOptions={{
        headerStyle: { backgroundColor: "#d8b4a0" },
        headerTintColor: "#000",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen
        name="AllEvents"
        component={AllEvents}
        options={{ headerShown: false }}
      />
         <Stack.Screen
      name="Notification"
      component={Notification}
      options={{ headerShown: false }}
    />

    <Stack.Screen
      name="SplashScreenEvents"
      component={SplashScreenEvents}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="EventDetails"
      component={EventDetailsScreen}
      options={{ headerShown: false }}
    />

    <Stack.Screen
      name="OurStory"
      component={OurStory}
      options={{ headerShown: false }}
    />

<Stack.Screen
      name="ProfileScreen"
      component={ProfileScreen}
      options={{ headerShown: false }}
    />

<Stack.Screen
      name="Groom"
      component={Groom}
      options={{ headerShown: false }}
    />

<Stack.Screen
      name="Bride"
      component={Bride}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ViewDetails"
      component={ViewDetails}
      options={{ headerShown: false }}
    />

    <Stack.Screen
      name="RSVPScreen"
      component={RSVP}
      options={{ headerShown: false }}
    />

    <Stack.Screen
      name="MediaScreen"
      component={MediaScreen}
      options={{ headerShown: false }}
    />

    <Stack.Screen
      name="CategoryImages"
      component={CategoryImages}
      options={{ headerShown: false }}
    />

    <Stack.Screen
      name="NextEvent"
      component={NextEvent}
      options={{ headerShown: false }}
    />

    <Stack.Screen
      name="HostFamily"
      component={HostFamily}
      options={{ headerShown: false }}
    />

    <Stack.Screen
      name="BrideFamilyDetails"
      component={BrideFamilyDetails}
      options={{ headerShown: false }}
    />

    <Stack.Screen
      name="GroomFamilyDetails"
      component={GroomFamilyDetails}
      options={{ headerShown: false }}
    />

    <Stack.Screen
      name="EventSchedule"
      component={EventSchedule}
      options={{ headerShown: false }}
    />

    <Stack.Screen
      name="Schedule"
      component={Schedule}
      options={{ headerShown: false }}
    />

    <Stack.Screen
      name="Travel"
      component={Travel}
      options={{ headerShown: false }}
    />

    <Stack.Screen
      name="TravelDetails"
      component={TravelDetails}
      options={{ headerShown: false }}
    />

    <Stack.Screen
      name="Gift"
      component={Gift}
      options={{ headerShown: false }}
    />

    <Stack.Screen
      name="SendHere"
      component={SendHere}
      options={{ headerShown: false }}
    />

    <Stack.Screen
      name="Vendors"
      component={Vendors}
      options={{ headerShown: false }}
    />

    <Stack.Screen
      name="VendorDetails"
      component={VendorDetails}
      options={{ headerShown: false }}
    />
    </Stack.Navigator>
  );
};

export default MainNavigator;
