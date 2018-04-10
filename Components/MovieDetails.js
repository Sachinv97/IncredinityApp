import React, {Component} from 'react'
import {ScrollView, Alert, FlatList, Image, BackHandler, ActivityIndicator, Linking} from 'react-native'
import {Card,Button} from 'react-native-elements'
import HTML from 'react-native-render-html'
import RNFetchBlob from "react-native-fetch-blob";

export default class MovieDetails extends Component{

    state={
        movieData:{},
        response:false,
    };

    static navigationOptions = ({navigation}) => ({
        title:'Movie Details',
        headerStyle: {
            backgroundColor: '#424242',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
    });

    componentWillMount(){
        this.requestRefresh();
    }

    requestRefresh(){
        this.setState({response:false});
        const {params} = this.props.navigation.state;
        const movieId = params ? params.movieId : null;
        fetch('http://movies.incredinity.com/mobile/movie.py?id='+movieId,{
            method:'GET'
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({movieData: responseJson.data, response:true});
            })
            .catch((error)=>{
                console.error(error);
                Alert.alert(
                    'Something Went Wrong.!',
                    'It seems you are not connected to the Internet.',
                    [
                        {text: 'Exit', onPress: () => BackHandler.exitApp()},
                        {text: 'Try Again', onPress: () =>this.requestRefresh()}
                    ],
                    { cancelable: false })
            })
    }

    renderScreenShotList(screenshot,screenshotIndex){
        if((screenshot.link).contains('uppit')){
            return null
        } else if((screenshot.link).contains('zippyshare')){
            return null
        } else if((screenshot.link).contains('multiup')){
            return null
        } else if((screenshot.link).contains('clicknupload')){
            return null
        } else {
            return (
                <Image
                    source={{uri: screenshot.link}}
                    resizeMode='contain'
                    style={{height: 150, width: '100%', marginBottom:10}}
                />
            )
        }
    }
    download(downloadLink){
        if(downloadLink !== null){
            if ((downloadLink).contains('upfile.mobi')){
                Linking.canOpenURL(downloadLink).then(supported => {
                    if (supported) {
                        Linking.openURL(downloadLink);
                    } else {
                        alert("Don't know how to open URI: " + downloadLink);
                    }
                })
            } else if((downloadLink).contains('drive.google')){
                Linking.openURL(downloadLink);
            } else {
                RNFetchBlob.config({
                    addAndroidDownloads: {
                        useDownloadManager: true,
                        description:'My Movie'
                    }
                })
                    .fetch('GET',downloadLink)
                    .then((response) => {
                        response.path()
                    })
            }
        }
    }

    renderDownloadList(downloadLink,downloadLinkIndex){
        //alert(JSON.stringify(downloadLink));
        return(
            <Button
                onPress={()=>this.download(downloadLink.link)}
                title={'Download From Server ' + (downloadLinkIndex+1)}
                buttonStyle={{backgroundColor:'#424242',borderRadius:20,marginBottom:10}}
                iconRight={{name:'download', type:'feather', color:'white'}}
            />
        )
    }

    render(){
        return(
            (this.state.response)?
                <ScrollView>
                    <Card title={this.state.movieData.title}
                          titleStyle={{color:'black', fontSize:16, fontWeight:'bold'}}
                    >
                        <HTML html={''+this.state.movieData.description}/>
                        <FlatList
                            key={'ScreenShotList'}
                            keyExtractor={(item, index) => JSON.stringify(item)}
                            data={this.state.movieData.screenshots}
                            renderItem={({item,index})=>this.renderScreenShotList(item,index)}
                            ListEmptyComponent={<ActivityIndicator size='large' color='#424242'/>}
                        />
                        <FlatList
                            key={'DownloadLinkList'}
                            keyExtractor={(item, index) => JSON.stringify(item)}
                            data={this.state.movieData.download}
                            renderItem={({item,index})=>this.renderDownloadList(item,index)}
                            ListEmptyComponent={<ActivityIndicator size='large' color='#424242'/>}
                        />
                    </Card>
                </ScrollView>
                :<ActivityIndicator style={{flex:1}} size='large' color='#424242'/>
        )
    }
}