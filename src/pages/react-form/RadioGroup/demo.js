import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RadioGroup from './index'

class RadioGroupDemo extends Component {
  constructor(props) {
    super(props);

  }

  componentWillMount() {

  }

  componentDidMount() {

  }

  radioGroupChange = (e) => {
    console.log('radioGroupChange', e.target.value)
  }

  render() {
    return (
      <RadioGroup value="male" onChange={(e) => { this.radioGroupChange(e) }}>
        <input type="radio" name="sex" value="male" />
        <input type="radio" name="sex" value="female" />
      </RadioGroup>
    );
  }
}

export default RadioGroupDemo;
