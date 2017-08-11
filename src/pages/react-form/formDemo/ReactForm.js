import React, { Component } from 'react';

//获取component的名称
function getDisplayName(component) {
  return component.displayName || component.name || 'Component';
}

const FormDecorate = () => {
  return function (WrappedComponent) {
    return class HOC_FormDecorate extends Component {
      constructor(props) {
        super(props);
        this.inputStore = {}
      }

      static displayName = `HOC(${getDisplayName(WrappedComponent)})`//更改组件名称

      handleChange = (e, fieldName, options) => {
        const { target } = e
        // const value = this.getValueFromEvent(fieldName)
        const value = target.value
        console.log(fieldName, value)
        const { rule } = options
        const { pattern, required, message } = rule
        if (required && pattern) {
          console.log("handleChange", pattern.test(value) === false ? '验证不通过' : '验证通过')
        }
        this.hideWarn(fieldName)
        this.setFieldValue(fieldName, value)
      }

      //给input输出指定的属性（写在input属性内的）
      getFieldProps = (fieldName, options = {}) => {
        // console.log('getFieldProps', { ...this.props })
        return {
          ref: (e) => { this.bindRef(fieldName, options, e) },
          onChange: (e) => { this.handleChange(e, fieldName, options) },
        }
      }

      setValueFromStore = (fieldName, value) => {
        this.inputStore[fieldName].value = value
        this.forceUpdate()
      }

      getValueFromStore = (fieldName) => {
        // console.log('getValueFromStore')
        if (this.inputStore[fieldName] && (typeof (this.inputStore[fieldName].value) !== 'undefined')) {
          return this.inputStore[fieldName].value
        } else {
          return undefined
        }
      }

      //包裹input，跟getFieldProps的结果一样，只是调用方法不一样
      getFieldDecorator = (fieldName, options = {}) => {
        this.getInputStoreCache(fieldName)
        const _props = this.getFieldProps(fieldName, options)
        let _value = this.getValueFromStore(fieldName)
        _value = typeof (_value) === 'undefined' ? options.initialValue : _value
        _value = typeof (_value) === 'undefined' ? '' : _value//HACK:initialValue为undefined的情况
        // console.log('getFieldDecorator', fieldName, _value)
        return (fieldElem) => {
          //判断该fieldName是否使用了getFieldDecorator来包装
          //isDecoratorElem字段后续用来判断set value和get value的方法
          this.inputStore[fieldName].isDecoratorElem = true
          //使用React.cloneElement给组件添加新的props
          return React.cloneElement(
            fieldElem,
            {
              value: _value,
              ..._props
            }
          );

        }
      }

      /**
       * 获取一组输入控件的值，如不传入参数，则获取全部组件的值
       * 参数: 空 或 数组[fieldName1,fieldName2,...]
       */
      getFieldsValue = (fieldNames = []) => {
        let vals_obj = {}

        for (let key in this.inputStore) {
          const item = this.inputStore[key]
          if (fieldNames.length === 0 || fieldNames.includes(item.fieldName)) {
            vals_obj[item.fieldName] = this.getFieldValue(item.fieldName)
          }
        }

        return vals_obj
      }

      /**
       * 获取一个输入控件的值
       * 参数: fieldName
       */
      getFieldValue = (fieldName = '') => {
        if (fieldName && typeof (fieldName) === 'string') {
          if (this.inputStore[fieldName].isDecoratorElem) {
            return this.getValueFromStore(fieldName)
          }
          return this.getValueFromEvent(fieldName)
        } else {
          throw `getFieldValue参数fieldName类型错误`
        }
      }

      /**
       * 设置一组输入控件的值
       * 参数: { fieldName: value },{ fieldName2: value2 },...
       */
      setFieldsValue = (...fieldName_value) => {
        fieldName_value.forEach((item) => {
          console.log(item)
          const fieldName = Object.keys(item)[0]
          this.setFieldValue(fieldName, item[fieldName])
        })
      }

      /**
       * 设置单个输入控件的值
       * 参数: fieldName, value
       */
      setFieldValue = (fieldName, value) => {
        // console.log('setFieldValue', fieldName, value)
        if (this.inputStore[fieldName].isDecoratorElem) {
          this.setValueFromStore(fieldName, value)
        } else {
          this.setValueFromEvent(fieldName, value)
        }
      }

      bindRef = (fieldName, options, component) => {
        //判断是否已经存在cache了
        if (typeof this.getInputStoreCache(fieldName).fieldName !== 'undefined') {
          return false
        }
        const { rule } = options

        this.inputStore[fieldName].fieldName = fieldName
        this.inputStore[fieldName].refName = `${fieldName}__ref`
        this.inputStore[fieldName].ref = component//ref实例
        this.inputStore[fieldName].options = options
        //设置初始值
        if ('initialValue' in options) {
          this.setFieldValue(fieldName, options.initialValue)
        }
      }

      validateFields = () => {
        let formValid_isPass = true
        const fieldNames = Object.keys(this.inputStore)//遍历出所有的字段名称
        let valid_arr = new Array(fieldNames.length)
        for (let i = 0; i < fieldNames.length; i++) {
          const fieldName = fieldNames[i];
          const that = this.inputStore[fieldName]
          const { options } = that
          if (typeof (options.rule) === 'undefined') { continue }
          const value = this.getFieldValue(fieldName)
          const {
            message,//校验文案
            pattern,//正则表达式
            required,//是否必填
            min,//最小长度
            max,//最大长度
          } = options.rule//验证规则

          //---验证开始---
          valid_arr[i] = {
            fieldName: fieldName,
            pass: false,
            message: message
          }//pass-该字段是否验证通过,message-验证不通过时的提示语
          console.log(fieldName, required, value)
          if (required) {
            if (value === "" || typeof value === 'undefined') {
              //值为空
              this.showWarn(fieldName)
              continue
            } else if ((min > 0 && value.length < min) || (max > 0 && value.length > max)) {
              //不大于最小长度&&不小于最大长度
              console.log(`是否小于最小长度:${min > 0 && value.length < min},是否大于最大长度:${max > 0 && value.length > max}`)
              this.showWarn(fieldName)
              continue
            }
            if (pattern && !pattern.test(value)) {
              //值为空
              this.showWarn(fieldName)
              continue
            }
          }
          valid_arr[i].pass = true
        }
        console.log(valid_arr)

        let err_arr = []
        valid_arr.forEach((item) => {
          if (!item.pass) {
            formValid_isPass = false
            err_arr.push({ ...item })
            console.warn(`验证不通过提示信息：${item.message}`)
          }
        })
        if (formValid_isPass) {
          return {
            isPass: true
          }
        } else {
          return {
            isPass: false,
            err: err_arr
          }
        }
      }

      getRefByFieldName = (fieldName = '') => {
        if (this.inputStore[fieldName]) {
          return this.inputStore[fieldName].ref
        } else {
          throw `没找到fieldName为"${fieldName}"的数据`
        }
      }

      getValueFromEvent = (fieldName = '') => {
        const ref = this.getRefByFieldName(fieldName)
        return (ref.type === 'checkbox' || ref.type === 'radio') ? ref.checked : ref.value;
      }

      setValueFromEvent = (fieldName, value) => {
        const ref = this.getRefByFieldName(fieldName)
        return (ref.type === 'checkbox' || ref.type === 'radio') ? ref.checked = !!value : ref.value = value;
      }

      showWarn = (fieldName) => {
        try {
          this.getRefByFieldName(fieldName).style.borderColor = "red"
        } catch (error) {

        }
      }

      hideWarn = (fieldName) => {
        try {
          this.getRefByFieldName(fieldName).style.borderColor = ""
        } catch (error) {

        }
      }

      getInputStore = () => {
        return this.inputStore
      }

      getInputStoreCache = (fieldName) => {
        if (typeof this.inputStore[fieldName] === 'undefined') {
          //如果没有fieldName的cache，则会创建一个
          this.inputStore[fieldName] = {}
        }
        return this.inputStore[fieldName]
      }

      render() {
        const mapFunToProps = {
          form: {
            getFieldProps: this.getFieldProps,
            getFieldDecorator: this.getFieldDecorator,
            validateFields: this.validateFields,
            getFieldValue: this.getFieldValue,
            getFieldsValue: this.getFieldsValue,
            setFieldValue: this.setFieldValue,
            setFieldsValue: this.setFieldsValue,
            getInputStore: this.getInputStore,
          }
        }
        return (
          <WrappedComponent
            {...this.props}
            {...mapFunToProps}
          />
        );
      }

    }
  }
}

export default FormDecorate
