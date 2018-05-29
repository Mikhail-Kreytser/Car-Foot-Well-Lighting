import CustomButton from './CustomButton.js'
import ColorWheel from './ColorWheel.js'
import React from 'react'
import {
  StyleSheet,
  Alert,
  View
  } from 'react-native'

class CustomPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      rearRight: '#696969', 
      rearLeft: '#696969', 
      shotgun: '#696969', 
      driver: '#696969', 
      selection:"AL", 
      all: '#696969',
      lastMsg: "", 
      gray: true,
    }

    this.setColor = this.setColor.bind(this)
    this.sendCustomColor = this.sendCustomColor.bind(this)
    this.changeSelection = this.changeSelection.bind(this)
  }

  static navigationOptions = {
    header: null,
  };

  setColor(color){
    if(this.props.connected){
      switch(this.state.selection){
        case 'FD':
          this.setState({driver:color})
          break;
        case 'FP':
          this.setState({shotgun:color})
          break; 
        case 'RD':
          this.setState({rearLeft:color})
          break;
        case 'RP':
          this.setState({rearRight:color})
          break;
        default:
          this.setState({
            rearRight: color,
            rearLeft: color,
            shotgun: color,
            driver: color,
            all:color,
          })
      }
    }
  }

  changeSelection(select){
    var gray = false;
    switch(select){
      case 'Driver':
        this.setState({selection : 'FD'})
        break;
      case 'Shotgun':
        this.setState({selection : 'FP'})
        break;
      case 'Rear Left':
        this.setState({selection : 'RD'})
        break;
      case 'Rear Right':
        this.setState({selection : 'RP'})
        break;
      default:
        this.setState({selection : 'AL'})
        gray = true;
    }
    this.setState({preset:'customColor', gray:gray})
  }

  sendCustomColor(color){
    if(this.props.connected){
      var r = "000"
      var g = "000"
      var b = "000"
      var red = parseInt(color[0])
      var green = parseInt(color[1])
      var blue = parseInt(color[2])
      if(red >= 100)
        r = "R"+red
      else if(red >= 10)
        r = "R0"+red
      else if(red >= 0)
        r = "R00"+red
      if(green >= 100)
        g = "G"+green
      else if(green >= 10)
        g = "G0"+green
      else if(green >= 0)
        g = "G00"+green
      if(blue >= 100)
        b = "B"+blue
      else if(blue >= 10)
        b = "B0"+blue
      else if(blue >= 0)
        b = "B00"+blue

      var msg = r+g+b+this.state.selection
      if( msg !== this.state.lastMsg){
        this.setState({lastMsg:msg})
        this.props.send(msg)
      }
    }
    // else
    //   Alert.alert('Not Connected')
  }

  render() {
    return ( 
      //style={{alignItems: 'center'}}>        
      <View>
        <View style={{justifyContent: 'center', alignItems: 'stretch', flexDirection: 'row'}}>
          <CustomButton text={'Driver'} color={this.state.driver} gray={this.gray} changeSelection={this.changeSelection} height={35} width={70}/>
          <CustomButton text={'Shotgun'} color={this.state.shotgun} gray={this.gray} changeSelection={this.changeSelection} height={35} width={70}/>
          <CustomButton text={'Rear Left'} color={this.state.rearLeft} gray={this.gray} changeSelection={this.changeSelection} height={35} width={70}/>
          <CustomButton text={'Rear Right'} color={this.state.rearRight} gray={this.gray} changeSelection={this.changeSelection} height={35} width={70}/>
        </View>
        <View style={{justifyContent: 'center', alignItems: 'stretch', flexDirection: 'row'}}>
          <CustomButton text={'All Sections'} color={this.state.all} gray={!this.gray} changeSelection={this.changeSelection} height={35} width={310}/>
        </View>
        <ColorWheel style={styles.wheel} currentColor={this.setColor} sendCustomColor={this.sendCustomColor}/>
      </View>
    )
  }

}
export default CustomPage;
const styles = StyleSheet.create({
  wheel:{ 
    flex: 1,
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
  // buttonText:{
  //   color:'white',
  //   fontWeight: 'bold', 
  //   paddingTop:8,
  // },
  body: {  
    flex: 5,
    minWidth: '100%',
    backgroundColor: '#212021',
  },
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

