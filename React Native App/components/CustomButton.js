import React from 'react'
import {
  TouchableOpacity, 
  ImageBackground, 
  Text,
  View
  } from 'react-native'

class CustomButton extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return ( 
      <View style={{alignItems: 'center'}}>        
        <TouchableOpacity 
          style={{
            backgroundColor:`${this.props.gray ? '#696969': this.props.color}`,
            height:this.props.height,
            width:this.props.width,
            alignItems: 'center',
            borderRadius: 40,
            marginTop: 20,
            marginRight:5,
            marginLeft:5
          }}
          onPress={() => {this.props.changeSelection(this.props.text)}}
          color={this.props.gray ? '#696969': this.props.color}>
          <Text 
            style={{
              fontWeight: 'bold', 
              color:'white', 
              paddingTop:8
            }}>
            {this.props.text}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default CustomButton;
