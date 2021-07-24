#!/usr/bin/env python3
# coding=utf-8

# sendEmail title content
import sys
import smtplib
from email.mime.text import MIMEText
from email.header import Header

#配置发送的邮箱
sender = '121914336@qq.com;'
#配置接收的邮箱
receiver = 'kasia0001@126.com;'
#SMTP邮件服务器 以QQ邮箱配置的
smtpserver = 'smtp.qq.com'
#smtpserver = 'smtp.exmail.qq.com'
#配置SMTP开启服务的账号和授权密码密码
username = '121914336@qq.com'
password = 'sypxipakkbyicbaa'

#这是配置发送邮件的python代码
def send_mail(title, content):
    #title代表标题 content代表邮件内容
    print(title,content)
    try:
        msg = MIMEText(content,'plain','utf-8')
        msg['Subject'] = title
        msg['From'] = sender
        msg['To'] = receiver
        msg["Accept-Language"]="zh-CN"
        msg["Accept-Charset"]="ISO-8859-1,utf-8"

        smtp = smtplib.SMTP_SSL(smtpserver,465)
        smtp.login(username, password)
        smtp.sendmail(sender, receiver, msg.as_string())
        smtp.quit()
        return True
    except Exception as e:
        print(str(e))
        return False


