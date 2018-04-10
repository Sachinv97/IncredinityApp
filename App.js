import React from 'react';
import {DrawerNavigator, DrawerItems, StackNavigator} from 'react-navigation'
import {ScrollView, StyleSheet,Text, View} from 'react-native';
import Movies from "./Components/Movies";
import {Icon,Button} from 'react-native-elements'
import MovieDetails from "./Components/MovieDetails";
import Splash from "./Components/Splash";

const CustomDrawerContent = (props) => (
    <ScrollView>
        <View style={styles.drawerHeader}>
            <Text style={[styles.drawerHeaderText, {fontWeight:'bold',fontSize:40}]}>Incredinity</Text>
            <Text style={[styles.drawerHeaderText, {marginTop:20}]}>Movies | Songs | Games | Secure Torrent</Text>
        </View>
        <DrawerItems {...props}/>
    </ScrollView>
);

const MovieStack = StackNavigator({
    Movies:{
        screen:Movies,
        navigationOptions:({navigation})=>({
            title:'Movies',
            headerLeft:<Button icon={{
                name: 'menu', color: 'white'
            }} buttonStyle={{backgroundColor:'transparent',height:"100%",}} onPress={()=>navigation.navigate('DrawerOpen')}/>
        })
    },
    MovieDetails:{
        screen:MovieDetails,
    }
});


const Drawer = DrawerNavigator({
    Splash:{
        screen:Splash
    },
    Movies:{
        screen:MovieStack,
    },
},  {
    initialRouteName: 'Splash',
    drawerPosition: 'left',
    contentComponent: CustomDrawerContent,
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
    }
);


const styles = StyleSheet.create({
   drawerHeader:{
       alignItems:'center',
       justifyContent:'center',
       height:150,
       backgroundColor:'#424242'
   },
   drawerHeaderText:{
       color:'white',
       textAlign:'center'
   },
});

export default Drawer;


