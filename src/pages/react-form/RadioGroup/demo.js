import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RadioGroup from './index'

class RadioGroupDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'male'
    }
  }

  componentWillMount() {

  }

  componentDidMount() {

  }

  radioGroupChange = (e) => {
    console.log('radioGroupChange', e.target.value)
    console.log(this.demoRef)
    this.setState({
      value: e.target.value
    });
  }

  saveRef = (ref) => {
    this.demoRef = ref
    console.log(this.demoRef)
  }

  onClick = () => {
    console.log(this.demoRef.props.value)
  }

  render() {
    return (
      <div>
        <RadioGroup ref={this.saveRef} value={this.state.value} onChange={(e) => { this.radioGroupChange(e) }}>
          男<input type="radio" name="sex" value="male" />
          女<input type="radio" name="sex" value="female" />
        </RadioGroup>
        <button onClick={this.onClick}>获取RadioGroup的prop-value</button>
      </div>
    );
  }
}

export default RadioGroupDemo;
