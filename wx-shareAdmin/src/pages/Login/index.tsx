import React from 'react';
import { Form, Input, Button } from 'antd';
import http from '@/services';
import bgJpg from '@/assets/banner.jpg';
import styles from './index.less';

const FormItem = Form.Item;

const Login: React.FC = () => {
  const [form] = Form.useForm();

  async function submit() {
    const values = form.getFieldsValue();
    console.log(values);
    const res = await http.post('login', values);
    console.log(res);
  }

  return (
    <div className={styles.bg} style={{ backgroundImage: `url(${bgJpg})` }}>
      <div className={styles.container}>
        <div className={styles.box}>
          <div className={styles.inset}>
            <h2 className={styles.title}>码蚁分享后台管理系统</h2>
            <Form className={styles.form} form={form} layout="vertical">
              <FormItem name="account" label="用户名" required>
                <Input style={{ width: '100%' }} />
              </FormItem>
              <FormItem name="password" label="密码" required>
                <Input style={{ width: '100%' }} type="password" />
              </FormItem>
            </Form>
            <div style={{ textAlign: 'center' }}>
              <Button className={styles.login} onClick={submit}>
                登录
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
