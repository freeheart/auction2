/**
 * 云通信基础能力业务短信发送、查询详情以及消费消息示例，供参考。
 * Created on 2017-07-31
 */
const SMSClient = require('@alicloud/sms-sdk')
// ACCESS_KEY_ID/ACCESS_KEY_SECRET 根据实际申请的账号信息进行替换
const accessKeyId = 'LTAIQ1c2fBzTaNcG'
const secretAccessKey = 'PPIFlVzyM2QzcXJyTZZZ4KSkmJ47Vv'
//初始化sms_client
let smsClient = new SMSClient({accessKeyId, secretAccessKey})
//发送短信
exports.sendsms=function(phone,template,code,name){
    smsClient.sendSMS({
        PhoneNumbers: phone,
        SignName: name,
        TemplateCode: template, //'SMS_105125087',
        TemplateParam: '{"code":"'+code+'","product":"'+name+'"}'
    }).then(function (res) {
        let {Code}=res
        if (Code === 'OK') {
            //处理返回参数
            console.log(res)
        }
    }, function (err) {
        console.log(err)
    })
}
