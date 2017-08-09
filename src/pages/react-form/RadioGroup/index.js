import React, { Component } from 'react';
import PropTypes from 'prop-types';

class RadioGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || undefined,
      children: props.children,
    }
    this.radioRef = []
  }

  getCheckedValue = () => {
    let value = undefined
    React.Children.forEach(this.props.children, (child, index) => {
      if (child.props && child.props.type == "radio" && child.props.checked) {
        value = child.props.value
      }
    })
    return value
  }

  setCheckedValue = (value) => {
    return React.Children.map(this.props.children, (child, index) => {
      return React.cloneElement(
        child,
        {
          checked: child.props.value === value,
          onChange: this.childOnChange,
          key: index
        }
      )
    })
  }

  childOnChange = (e) => {
    this.setState({
      value: e.target.value,
      children: this.setCheckedValue(e.target.value)
    });
    this.props.onChange(e)
  }

  componentWillMount() {

  }

  componentDidMount() {
    this.setState({
      children: this.setCheckedValue(this.state.value)
    });
    console.log("该组件未完成")
  }

  componentWillReceiveProps(nextProps) {

  }

  render() {
    return (
      <div>
        {this.state.children}
      </div>
    );
  }
}

RadioGroup.propTypes = {

};

export default RadioGroup;
