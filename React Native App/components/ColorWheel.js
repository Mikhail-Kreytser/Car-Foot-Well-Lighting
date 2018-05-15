import React from 'react'
import { View, Text } from 'react-native'
import { ColorPicker, toHsv, fromHsv} from 'react-native-color-picker'

class ColorWheel extends React.Component {

  constructor(props) {
    super(props)
    this.state = { color: {h:120,s:1,v:1} } 
    this.onColorChange = this.onColorChange.bind(this)
  }

  onColorChange(color) {
    this.setState({ color })
    function hsvToRgb(h, s, v) {
  	  var r, g, b;
  	  h = h/360;

  	  var i = Math.floor(h * 6);
  	  var f = h * 6 - i;
  	  var p = v * (1 - s);
  	  var q = v * (1 - f * s);
  	  var t = v * (1 - (1 - f) * s);

  	  switch (i % 6) {
  	    case 0: r = v, g = t, b = p; break;
  	    case 1: r = q, g = v, b = p; break;
  	    case 2: r = p, g = v, b = t; break;
  	    case 3: r = p, g = q, b = v; break;
  	    case 4: r = t, g = p, b = v; break;
  	    case 5: r = v, g = p, b = q; break;
  	  }
	  return [ r * 255, g * 255, b * 255 ];
	}  
    this.props.currentColor(fromHsv(this.state.color));
    this.props.sendCustomColor(hsvToRgb(color.h,1,1));
  }

  

  render() {
    return (        
      <View style={{flex: 1, padding: 15, backgroundColor: '#212021'}}>
        <ColorPicker
          color={this.state.color}
          onColorChange={this.onColorChange}
          //onColorSelected={color => alert(`Color selected: ${color}`)}
          //onOldColorSelected={color => alert(`Old color selected: ${color}`)}
          style={{flex: 1}}
          hideSliders={true}
        />
      </View>
    )
  }

}
export default ColorWheel;