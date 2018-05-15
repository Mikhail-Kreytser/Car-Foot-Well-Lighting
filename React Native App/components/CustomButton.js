import React from 'react'
import {View, TouchableOpacity, ImageBackground, Text} from 'react-native'

class CustomButton extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return ( 
      <View style={{alignItems: 'center'}}>        
        <TouchableOpacity style={{borderRadius: 40, height:this.props.height, width:this.props.width, marginTop: 20, marginRight:5,marginLeft:5, alignItems: 'center', backgroundColor:`${this.props.gray ? '#696969': this.props.color}`}}
                          onPress={() => {this.props.changeSelection(this.props.text)}}
                          color={this.props.gray ? '#696969': this.props.color}>
          <Text style={{color:'white', fontWeight: 'bold', paddingTop:8}}>{this.props.text}</Text>
        </TouchableOpacity>
      </View>
    )
  }

}
export default CustomButton;
