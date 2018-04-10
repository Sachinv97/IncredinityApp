import React, {Component} from 'react'
import {Image,RefreshControl,ActivityIndicator,Alert,BackHandler} from 'react-native'
import {Icon,Card,Button,Divider,SearchBar} from 'react-native-elements'
import SearchableFlatlist from '../utils/FlatListSearch'


export default class Movies extends Component{

    static navigationOptions ={
        headerStyle: {
            backgroundColor: '#424242',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
        drawerIcon:(
            <Icon name='video-camera' type='entypo' />
        ),
        drawerLabel: 'Movies'
    };

    state={
        pageId:10,
        movieList:[],
        searchTerm:'',
        response:false,
        refreshing:false,
    };

    componentWillMount(){
        this.requestRefresh();
    }

    requestRefresh(){
        this.setState({refreshing:true});
        fetch('http://movies.incredinity.com/mobile/index.py?id='+this.state.pageId,{
            method:'GET'
        })
            .then((response) => response.json())
            .then((responseJson) => {
                //alert(JSON.stringify(responseJson))
                this.setState({movieList: [...this.state.movieList, ...responseJson.movieList],response:true})
                //alert(JSON.stringify(this.state.movieList))
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
            });
        this.setState({refreshing:false});
    }

    renderMovieList(movie,movieIndex){
        //alert(movie.poster);
        return(
            <Card title={movie.title}
                  titleStyle={{fontWeight:'bold',fontSize:16,color:'black'}}
            >
                <Image
                    source={{ uri: movie.poster }}
                    resizeMode='contain'
                    style={{height: 150, width: '100%'}}
                />
                <Divider style={{margin:10}}/>
                <Button
                    title='View More'
                    buttonStyle={{backgroundColor:'#424242',}}
                    iconRight={{name:'chevron-thin-right', type:'entypo', color:'white'}}
                    onPress={()=>this.props.navigation.navigate('MovieDetails',{
                        movieId: movie.id,
                    })}
                />
            </Card>
        )
    }

    loadMore(){
        this.setState({pageId: this.state.pageId + 10}, ()=> this.requestRefresh());
       // this.setState({loadMoreState:false});
    }

    render(){
        return(
            (this.state.response)?
            <SearchableFlatlist
                searchProperty={'title'}
                searchTerm={this.state.searchTerm}
                ListHeaderComponent={
                    <SearchBar
                        lightTheme={true}
                        round={true}
                        showLoading={true}
                        placeholder='Type Here'
                        onChangeText={(text)=>this.setState({searchTerm:text})}
                        inputStyle={{color:'black'}}
                    />
                }
                key={'MovieList'}
                keyExtractor={(item, index) => JSON.stringify(item)}
                data={this.state.movieList}
                renderItem={({item,index})=>this.renderMovieList(item,index)}
                ListEmptyComponent={<ActivityIndicator size='large'/>}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={()=>this.requestRefresh()}
                    />
                }
                ListFooterComponent={
                    <ActivityIndicator style={{flex:1}} color='#424242'/>
                }
                onEndReached={()=>this.loadMore()}
            />
            :<ActivityIndicator size='large' style={{flex:1}} color='#424242'/>
        )
    }
}