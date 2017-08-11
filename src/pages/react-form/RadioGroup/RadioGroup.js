import React, { Component } from 'react';
import PropTypes from 'prop-types';

class RadioGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.defaultValue || props.value || undefined,
      children: props.children,
    }
    this.radioRef = []
  }

  // getCheckedValue = () => {
  //   let value = undefined
  //   React.Children.forEach(this.props.children, (child, index) => {
  //     if (child.props && child.props.type == "radio" && child.props.checked) {
  //       value = child.props.value
  //     }
  //   })
  //   return value
  // }

  //组件的value对应回某个input的checked-true
  setCheckedValue = (children, value) => {
    return React.Children.map(children, (child, index) => {
      if (child.type === 'input' && child.props.type === 'radio') {
        return React.cloneElement(
          child,
          {
            checked: child.props.value === value,
            onChange: this.childOnChange,
            // key: index
          }
        )
      }
      return child
    })

  }

  childOnChange = (e) => {
    this.setState({
      value: e.target.value,
      children: this.setCheckedValue(this.props.children, e.target.value)
    });
    this.props.onChange(e)
  }

  componentDidMount() {
    this.setState({
      children: this.setCheckedValue(this.props.children, this.state.value)
    })
  }

  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.value !== 'undefined' && nextProps.value != this.state.value) {
      this.setState({
        value: nextProps.value,
        children: this.setCheckedValue(this.props.children, nextProps.value)
      });
    }
  }

  render() {
    return (
      <div className="RadioGroup">
        {this.state.children}
      </div>
    );
  }
}

RadioGroup.propTypes = {

};

export default RadioGroup;
