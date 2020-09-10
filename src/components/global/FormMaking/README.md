# 表单设计器



## 封装说明

---

该组件基于ant design vue表单组件及各种基础表单控件封装<br />
<br />目的是为了解决简单重复性表单反复书写的痛点，可直接传入基础配置，即可生成表单并校验成功后返回数据<br />

## 配置说明

---

### 已支持控件


- input
- select
- date
- radio
- editor



### formConfig字段说明
| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| labelCol | label 标签布局 | Number | 6 |
| wrapperCol | 输入控件布局样式 | Number | 16 |
| width | form-model-item所占一行的宽度 | String | 400 |
| initForm | 初始化数据 | Obejct | {} |
| formList | 具体见下表 | Object |  |



### formList字段说明
| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 控件类型 | String |  |
| label | label 标签的文本 | String |  |
| key | 表单字段key | String |  |
| labelCol | 单个form-model-item的label所占,设置则覆盖formConfig的设置 | Number | 6 |
| wrapperCol | 单个form-model-item的控件所占,设置则覆盖formConfig的设置 | Number | 16 |
| width | form-model-item所占一行的宽度,设置则覆盖formConfig的设置 | String | 400 |
| props | 各个表单控件的参数，具体参照Ant design vue | Object |  |
| rule | 对应的常用表单校验类型string或者表单校验方法 | [String, Array] |  |
| dicOption | 设置时代表option通过字典获取,值为字典数据名 | String |  |
| apiOption | 设置时代表option通过接口获取,值为接口名 | String |  |
| replaceFields | 设置apiOption时，为数据的替换字段 | Obejct | {label:'label',value:'value'} |
| required | 表单校验是否必填 | Boolean | true |
| dividerName | 头部标题内容 | Stirng |  |
| tipName | 控件后提示内容 | String |  |
| subType | 控件内子类型字段 | Stirng |  |
| isShow | 控件是否显示的判断函数，传入参数为表单对象 | Function |  |



## 内置方法


### 表单校验方法

<br />提交表单方法，该方法返回一个promise对象，可以参照以下示例使用：<br />

```
this.$refs.formMaking.handleSubmit().then(formData => {
    // do something
})
```


### 初始化方法

<br />对表单的formData和rules进行初始化
