import React, { Component } from 'react';
import ReactForm from './ReactForm'

class DemoForm extends Component {
  constructor(props) {
    super(props);
    console.log(props)
  }

  saveData = () => {
    const { validateFields } = this.props.form
    const _validate = validateFields()
    if (_validate.isPass) {
      console.log("发起请求!")
    } else {
      console.log("验证不通过", _validate.err)
    }
  }

  toGetFieldValue = () => {
    // const value = this.props.form.getFieldsValue(['username'])
    const value = this.props.form.getFieldValue('username')
    console.log("获取单个值", value)
  }

  toGetFieldsValue = () => {
    const values = this.props.form.getFieldsValue(['username', 'phone'])
    console.log("获取多个值", values)
  }

  toGetAllFieldsValue = () => {
    const values = this.props.form.getFieldsValue()
    console.log("获取全部值", values)
  }

  toSetFieldValue = () => {
    this.props.form.setFieldValue('phone', 12345678901)
  }

  toSetFieldsValue = () => {
    const arr = [
      { username: "lzs" },
      { phone: 12345678901 },
      { year: "1992" },
      { job_fee: true },
      { job_java: false }
    ]
    this.props.form.setFieldsValue(...arr)
  }

  render() {
    const { getFieldProps } = this.props.form
    return (
      <div style={{ padding: '30px', fontSize: '14px' }}>
        <input
          type="hidden"
          {...getFieldProps('formId', {
            initialValue: 'lzs-form'
          }) }
        />
        <input
          type="hidden"
          {...getFieldProps('emptyOptionsTestInput') }
        />
        <input
          type="text"
          maxLength={10}
          placeholder="请输入用户名"
          {...getFieldProps('username', {
            rule: {
              message: "请输入正确的用户名",
              pattern: /^[0-9a-zA-Z\u4e00-\u9fa5]{1,10}$/,
              required: true,
              min: 1,
              max: 10,
            }
          }) }
        />
        <br />
        <br />
        <input
          type="text"
          maxLength={11}
          placeholder="请输入手机号码"
          {...getFieldProps('phone', {
            rule: {
              message: "请输入正确的手机号码",
              pattern: /^1\d{10}$/,
              required: true,
              min: 11,
              max: 11
            }
          }) } />
        <br />
        <br />
        <p>出生年:</p>
        <select
          {...getFieldProps('year', {
            initialValue: "",
            rule: {
              message: "请选择出生年",
              required: true,
            }
          }) }
        >
          <option value="">请选择</option>
          <option value="1990">1990</option>
          <option value="1991">1991</option>
          <option value="1992">1992</option>
          <option value="1993">1993</option>
          <option value="1994">1994</option>
        </select>
        <br />
        <br />
        <p>职业:</p>
        <label htmlFor="fee">
          <input
            id="fee"
            type="checkbox"
            {...getFieldProps('job_fee', {
              initialValue: true,
              rule: {}
            }) } />
          <span> web前端开发工程师</span>
        </label>
        <br />
        <label htmlFor="java">
          <input
            id="java"
            type="checkbox"
            {...getFieldProps('job_java', {
              rule: {}
            }) } />
          <span> java开发工程师</span>
        </label>
        <br />
        <br />
        <div>
          <p>性别</p>
          <label htmlFor="sex_male">
          <input
            id="sex_male"
            name="sex"
            type="radio"
            checked={true}
            {...getFieldProps('sex.male', {
              rule: {}
            }) } />
          <span> 男</span>
          </label>
          <label htmlFor="sex_female" style={{marginLeft:'10px'}}>
          <input
            id="sex_female"
            name="sex"
            type="radio"
            {...getFieldProps('sex.female', {
              rule: {}
            }) } />
          <span> 女</span>
          </label>
        </div>

        <br />
        <br />
        <button onClick={this.saveData}>提交验证</button>
        <br />
        <br />
        <button onClick={this.toGetFieldValue}>获取单个值</button>
        <br />
        <br />
        <button onClick={this.toGetFieldsValue}>获取多个值</button>
        <br />
        <br />
        <button onClick={this.toGetAllFieldsValue}>获取全部值</button>
        <br />
        <br />
        <button onClick={this.toSetFieldValue}>设置值(单个)</button>
        <br />
        <br />
        <button onClick={this.toSetFieldsValue}>设置值(多个)</button>
        <br />
        <br />
      </div>
    );
  }
}

export default ReactForm()(DemoForm);
