import React, { Suspense } from "react";
import { createStackNavigator } from "@react-navigation/stack";

const AllEvents = React.lazy(() => import("../screens/Home/AllEvents"));
const SplashScreenEvents = React.lazy(() => import("../screens/Home/SplashScreenEvents"));
const EventDetailsScreen = React.lazy(() => import("../screens/Home/EventDetailsScreen")); 
const OurStory = React.lazy(() => import("../screens/Home/OurStory"));
const ViewDetails = React.lazy(() => import("../screens/ViewDetails/ViewDetails"));
const MediaScreen = React.lazy(() => import("../screens/Media/MediaScreen"));
const CategoryImages = React.lazy(() => import("../screens/Media/CategoryImages"));
const HostFamily = React.lazy(() => import("../screens/ViewDetails/FamilyDetails/HostFamily"));
const GroomFamilyDetails = React.lazy(() => import("../screens/ViewDetails/FamilyDetails/GroomFamilyDetails"));
const BrideFamilyDetails = React.lazy(() => import("../screens/ViewDetails/FamilyDetails/BrideFamilyDetails"));
const Gift = React.lazy(() => import("../screens/ViewDetails/Gifts/Gift"));
const EventSchedule = React.lazy(() => import("../screens/ViewDetails/EventDetails/EventSchedule"));
const Schedule = React.lazy(() => import("../screens/ViewDetails/EventDetails/Schedule"));
const Travel = React.lazy(() => import("../screens/ViewDetails/Travel/Travel"));
const TravelDetails = React.lazy(() => import("../screens/ViewDetails/Travel/TravelDetails"));
const SendHere = React.lazy(() => import("../screens/ViewDetails/Gifts/SendHere"));
const Vendors = React.lazy(() => import("../screens/ViewDetails/Vendors/Vendors"));
const VendorDetails = React.lazy(() => import("../screens/ViewDetails/Vendors/VendorDetails"));
const NextEvent = React.lazy(() => import("../screens/ViewDetails/NextEvent/NextEvent"));

const Stack = createStackNavigator();

const MainNavigator = () => (
  <Suspense fallback={<Text>Loading...</Text>}>
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
  </Suspense>
);

export default MainNavigator;
