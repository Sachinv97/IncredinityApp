import React from 'react'
import {View,Text,StyleSheet} from 'react-native'
import TimerMixin from 'react-timer-mixin'
import Shimmer from 'react-native-shimmer';


export default class Splash extends React.Component{
    componentDidMount(){
        TimerMixin.setTimeout(()=>this.props.navigation.navigate('Movies'),2000)
    }
    render(){
        return(
            <View style={styles.splashStyle}>
                <Shimmer>
                    <Text style={[styles.drawerHeaderText, {fontWeight:'bold',fontSize:40}]}>Incredinity</Text>
                </Shimmer>
                <Shimmer>
                    <Text style={[styles.drawerHeaderText, {marginTop:20}]}>Movies | Songs | Games | Secure Torrent</Text>
                </Shimmer>
            </View>
        )
    }
}

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
    splashStyle:{
        alignItems:'center',
        justifyContent:'center',
        flex:1,
        backgroundColor:'#424242'
    }
});
