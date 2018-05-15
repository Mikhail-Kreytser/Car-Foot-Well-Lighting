import React from 'react';
import { StyleSheet, Text, View, Picker, Alert, Button, TouchableOpacity, Image, ImageBackground, ActivityIndicator} from 'react-native';
import FlipToggle from 'react-native-flip-toggle-button'
import PresetButton from './components/PresetButton.js'
// import CustomButton from '.components/CustomButton.js'
import CustomPage from './components/CustomPage.js'
import ColorWheel from './components/ColorWheel.js'
import Lock from './components/Lock.js'
import WS from 'react-native-websocket'

export default class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = { gray:true, preset:'customColor', pageToggle:true, connected:false, lockState: false,
                }
    this.sendPreset = this.sendPreset.bind(this)
    this.sendLockState = this.sendLockState.bind(this)
    this.sendPresetSpeed = this.sendPresetSpeed.bind(this)
  }

  

  sendLockState(lockState){
    // if(this.state.connected){
    //   if(lockState)
    //     this.ws.send('mishaOnline')
    //   else
    //     this.ws.send('mishaOFFOnline')
    // }
    // else
    //   Alert.alert('Not Connected')
  }

  sendPreset(preset){
    // if(this.state.connected){
    //   this.setState({gray:true, preset:preset})
    //   this.ws.send(preset)
    // }
    // else
    //   Alert.alert('Not Connected')
  }

  sendPresetSpeed(action){
    // if(this.state.connected)
    //   this.ws.send(action)
    // else
    //   Alert.alert('Not Connected')
  }

  render() {
    return (      
      <View style={styles.container}>
        <WS
          ref={ref => {this.ws = ref}}
          url="ws://192.168.4.1:81/"
          onOpen={() => {
            this.ws.send('Hello');
            this.setState({connected:true})}}
          onMessage={()=>{}}
          onError={()=>{this.setState({connected:false})}}
          onClose={()=>{this.setState({connected:false})}}
          reconnect // Will try to reconnect onClose
        />

        <Text style={styles.title}>ColorPicker</Text>
        <View style={styles.buttons}>
          <FlipToggle
            onLabel = 'Custom Color'
            offLabel = 'Presets'
            sliderOnColor='white'
            sliderOffColor='white'
            value={this.state.pageToggle}
            buttonWidth={200}
            buttonHeight={35}
            buttonRadius={50}
            onToggle={(value) => {this.setState({ pageToggle: value })}}
            // onToggleLongPress={() => {console.log('Long Press')}}
          />
        </View>
        <View style={styles.body}>
          {this.state.pageToggle && <CustomPage send={ /*this.ws.send*/ console.log()}/>}
          {!this.state.pageToggle && <View>
            <PresetButton preset={'rainbow'} currentPreset={this.state.preset} sendPresetSpeed={this.sendPresetSpeed} sendPreset={this.sendPreset}/>
            <PresetButton preset={'police'} currentPreset={this.state.preset} sendPresetSpeed={this.sendPresetSpeed} sendPreset={this.sendPreset}/>
          </View>}
        </View>
        <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator animating ={!this.state.connected} size={100} color='white' />
        </View>
        <Lock lockState={this.lockState} sendLockState={this.sendLockState}/>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212021',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title:{ 
    flex: .5,
    paddingTop: 20,
    color: 'white',
    fontSize: 30,
  },
  buttons:{
    justifyContent: 'center',
    alignItems: 'stretch',
    flexDirection: 'row',
  },
  presets:{
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  button:{
    alignItems: 'center',
    justifyContent: 'center', 
    padding:10,
    flex:1,
  },
  buttonText:{
    color:'white',
    fontWeight: 'bold', 
    paddingTop:8,
  },
  body: {  
    flex: 5,
    minWidth: '100%',
    backgroundColor: '#212021',
  },
  wheel:{ 
    flex: 1,
  }, 
  picker:{
    color: 'black',
    backgroundColor: '#fff',
    maxWidth: '50%',
    left: '25%',
    alignSelf: 'stretch', 
            alignItems:'center', 
            justifyContent:'center',
  },
  pickerItem:{
    flex: 1,
    justifyContent: 'center',
    color: 'white',
    fontSize: 30,
  }
});


// style={styles.presets}>
//             <TouchableOpacity style={{borderRadius: 40, height: 35, width:310, marginTop: 20, alignItems: 'center'}}
//                               onPress={() => {
//                                 if(this.state.connected){
//                                   this.setState({gray:true, preset:'police'})
//                                   this.ws.send('police')
//                                 }
//                                 else
//                                   Alert.alert('Not Connected')
//                               }}>
//               <View style={{borderRadius: 40, height: 35, width:310, alignItems: 'center',overflow: 'hidden'}}>
//                 <ImageBackground
//                   style={{borderRadius: 40, height: 35, width:310, alignItems: 'center'}}
//                   source={require('./media/RedAndBlue2.jpg')}>
//                   <Text style={styles.buttonText}>Police</Text>
//                 </ImageBackground>
//               </View>
//             </TouchableOpacity>
//             {this.state.preset == 'police' && <View style={{flexDirection: 'row'}}>
//               <TouchableOpacity style={{borderRadius: 40, height: 35, width:145, marginTop: 20, marginRight: 20, alignItems: 'center', backgroundColor:'#696969'}}
//                                 onPress={() => {
//                                   if(this.state.connected)
//                                     this.ws.send('policeSpeedUp')
//                                   else
//                                     Alert.alert('Not Connected')
//                                 }}>

//                 <Text style={styles.buttonText}>+</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={{borderRadius: 40, height: 35, width:145, marginTop: 20, alignItems: 'center', backgroundColor:'#696969'}}
//                                 onPress={() => {
//                                   if(this.state.connected)
//                                     this.ws.send('policeSlowDown')
//                                   else
//                                     Alert.alert('Not Connected')
//                                 }}>

//                 <Text style={styles.buttonText}>-</Text>
//               </TouchableOpacity>
//             </View>}