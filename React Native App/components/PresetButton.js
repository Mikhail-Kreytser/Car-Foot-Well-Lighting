import {
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  View,
  Text
} from 'react-native'
import React from 'react'

class PresetButton extends React.Component {

  constructor(props) {
    super(props)
    this.state={
       buttonText: this.props.preset.charAt(0).toUpperCase() + this.props.preset.slice(1),
       imageSource: {
        police : require('../media/police.jpg'),
        rainbow: require('../media/rainbow.jpg')
      }
    }
  }

  render() {
    return (
      // flex: 1, flexDirection: 'column', 
      <View style={{alignItems: 'center'}}>
        <TouchableOpacity style={{borderRadius: 40, height: 35, width:310, marginTop: 20, alignItems: 'center'}}
                          onPress={() => {this.props.sendPreset(this.props.preset)}}>
          <View style={{borderRadius: 40, height: 35, width:310, alignItems: 'center',overflow: 'hidden'}}>
            <ImageBackground
              style={{borderRadius: 40, height: 35, width:310, alignItems: 'center'}}
              source={this.state.imageSource[this.props.preset]}> 
              <Text style={{color:'white', fontWeight: 'bold', paddingTop:8}}>{this.state.buttonText}</Text>
            </ImageBackground>
          </View>
        </TouchableOpacity> 
        {this.props.preset == this.props.currentPreset && <View style={{flexDirection: 'row'}}>
          <TouchableOpacity style={{borderRadius: 40, height: 35, width:145, marginTop: 20, marginRight: 20, alignItems: 'center', backgroundColor:'#696969'}}
                            onPress={() => {this.props.sendPresetSpeed(this.props.preset+'SpeedUp')}}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{borderRadius: 40, height: 35, width:145, marginTop: 20, alignItems: 'center', backgroundColor:'#696969'}}
                            onPress={() => {this.props.sendPresetSpeed(this.props.preset+'SlowDown')}}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
        </View>}

      </View>
    )
  }

}
export default PresetButton;

const styles = StyleSheet.create({
    buttonText:{
    color:'white',
    fontWeight: 'bold', 
    paddingTop:8,
  },
  // container: {
  //   flex: 1,
  //   backgroundColor: '#212021',
  //   flexDirection: 'column',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // title:{ 
  //   flex: .5,
  //   paddingTop: 20,
  //   color: 'white',
  //   fontSize: 30,
  // },
  // buttons:{
  //   justifyContent: 'center',
  //   alignItems: 'stretch',
  //   flexDirection: 'row',
  // },
  // presets:{
  //   flex: 1,
  //   flexDirection: 'column',
  //   alignItems: 'center',
  // },
  // button:{
  //   alignItems: 'center',
  //   justifyContent: 'center', 
  //   padding:10,
  //   flex:1,
  // },
  // body: {  
  //   flex: 5,
  //   minWidth: '100%',
  //   backgroundColor: '#212021',
  // },
  // wheel:{ 
  //   flex: 1,
  // }, 
  // picker:{
  //   color: 'black',
  //   backgroundColor: '#fff',
  //   maxWidth: '50%',
  //   left: '25%',
  //   alignSelf: 'stretch', 
  //           alignItems:'center', 
  //           justifyContent:'center',
  // },
  // pickerItem:{
  //   flex: 1,
  //   justifyContent: 'center',
  //   color: 'white',
  //   fontSize: 30,
  // }
});
