import React from 'react'
import { View, TouchableOpacity, Image} from 'react-native'

class Lock extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (        
      <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 5, justifyContent: 'flex-end', alignItems: 'flex-start'}}>
        <TouchableOpacity style={{borderRadius: 40, height: 75, width:75, alignItems: 'center'}} onPress={() => {this.props.sendLockState(!this.props.lockState)}}>
          <Image
            style={{borderRadius: 40, height: 75, width:75, alignItems: 'center',tintColor:'white'}}
            source={this.props.lockState ? require('../media/lock.png') : require('../media/unlock.png')}>
          </Image>
        </TouchableOpacity>
      </View>
    )
  }

}
export default Lock;