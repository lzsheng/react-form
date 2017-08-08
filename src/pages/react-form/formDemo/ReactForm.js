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

      //给input输出指定的属性
      getFieldProps = (fieldName, options = {}) => {
        return {
          ...this.props,
          ref: (e) => { this.bindRef(fieldName, options, e) },
          onChange: (e) => { this.handleChange(e, fieldName, options) }
        }
      }

      // submit = () => {
      //   console.log('submit')
      //   if (this.validateFields()) {
      //     console.log("验证通过，提交数据")
      //   } else {
      //     console.log("验证不通过")
      //   }
      // }

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
        this.setValueFromEvent(fieldName, value)
      }

      bindRef = (fieldName, options, component) => {
        const { rule } = options
        this.inputStore[fieldName] = {}
        this.inputStore[fieldName].fieldName = fieldName
        this.inputStore[fieldName].refName = `${fieldName}__ref`
        this.inputStore[fieldName].ref = component//ref实例
        this.inputStore[fieldName].options = options
        // this.inputStore[fieldName].isNested = false//是否组合名称

        //组合名称 例如fieldName="sex.female"
        // const nameIfNested = this.getNameIfNested(fieldName)
        // if (nameIfNested.isNested) {
        //   this.inputStore[fieldName].isNested = true
        //   this.inputStore[fieldName].nestedName = nameIfNested.name//sex
        //   this.inputStore[fieldName].nestedValue = nameIfNested.value//female
        //   this.bindRef(nameIfNested.name,{},undefined)
        // }

        //设置初始值
        if ('initialValue' in options) {
          this.setValueFromEvent(fieldName, options.initialValue)
        }
        console.log(this.inputStore)
      }

      handleChange = (e, fieldName, options) => {
        const { target } = e
        console.log(target.type)
        const value = this.getValueFromEvent(fieldName)
        const { rule } = options
        const { pattern, required, message } = rule
        console.log(value)
        if (required && pattern) {
          console.log("handleChange", pattern.test(value) === false ? '验证不通过' : '验证通过')
        }
        this.hideWarn(fieldName)
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
          const value = this.getValueFromEvent(fieldName)
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
          if (required) {
            if (value === "") {
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
        this.getRefByFieldName(fieldName).style.borderColor = "red"
      }

      hideWarn = (fieldName) => {
        this.getRefByFieldName(fieldName).style.borderColor = ""
      }

      //判断fieldName是否为组合名称
      // getNameIfNested = (fieldName) => {
      //   const NAME_KEY_SEP = '.';
      //   const NAME_INDEX_OPEN_SEP = '[';
      //   const keyIndex = fieldName.indexOf(NAME_KEY_SEP);
      //   const arrayIndex = fieldName.indexOf(NAME_INDEX_OPEN_SEP);

      //   let index;

      //   if (keyIndex === -1 && arrayIndex === -1) {
      //     return {
      //       name: fieldName,
      //     };
      //   } else if (keyIndex === -1) {
      //     index = arrayIndex;
      //   } else if (arrayIndex === -1) {
      //     index = keyIndex;
      //   } else {
      //     index = Math.min(keyIndex, arrayIndex);
      //   }

      //   return {
      //     name: fieldName.slice(0, index),
      //     isNested: true,
      //     value: fieldName.slice(index + 1, fieldName.length)
      //   };
      // }

      render() {
        const mapFunToProps = {
          form: {
            getFieldProps: this.getFieldProps,
            validateFields: this.validateFields,
            getFieldValue: this.getFieldValue,
            getFieldsValue: this.getFieldsValue,
            setFieldValue: this.setFieldValue,
            setFieldsValue: this.setFieldsValue,
          }
        }
        return (
          <WrappedComponent
            {...mapFunToProps}
          />
        );
      }

    }
  }
}

export default FormDecorate
