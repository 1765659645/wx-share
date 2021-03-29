import { Table, Button, Form, Modal, Input, message } from 'antd';
import React, { useState, useEffect } from 'react';
import http from '@/services';

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};

const TableList: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [stateSelectedRows, setStateSelectedRows] = useState([]);
  const [stateSelectedRowKeys, setStateSelectedRowKeys] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    const res = await http.get('list');
    if (res.status === 200) {
      setData(res.data);
      setStateSelectedRowKeys([]);
      setStateSelectedRows([]);
    }
  }

  function handleAdd() {
    setIsEdit(false);
    setVisible(true);
  }

  function onCancel() {
    setVisible(false);
    form.resetFields();
  }

  function handleOk() {
    form.validateFields().then(async (values) => {
      const res = isEdit
        ? await http.put('updateShare', { ...values, id: stateSelectedRowKeys[0] })
        : await http.post('addShare', values);
      console.log(res);
      if (res.status === 200 && res.data) {
        getData();
        onCancel();
        message.success(isEdit ? '资源编辑成功' : '资源添加成功');
        return;
      }
      message.warning(res.data);
    });
  }

  function handleEdit() {
    if (stateSelectedRowKeys.length !== 1) {
      message.warning('请选择一个需要编辑的资源');
      return;
    }
    form.setFieldsValue({
      shareKey: stateSelectedRows[0].shareKey,
      shareUrl: stateSelectedRows[0].shareUrl,
      sharePsw: stateSelectedRows[0].sharePsw,
      shareRemark: stateSelectedRows[0].shareRemark,
    });
    setIsEdit(true);
    setVisible(true);
  }

  async function handleDelete() {
    if (stateSelectedRowKeys.length !== 1) {
      message.warning('请选择一条需要删除的资源');
      return;
    }
    const res = await http.delete('deleteShare', { data: { id: stateSelectedRowKeys[0] } });
    if (res.status === 200) {
      message.success('删除成功');
      getData();
    }
  }

  const column: any[] = [
    {
      key: 'shareKey',
      title: '资源关键词',
      dataIndex: 'shareKey',
    },
    {
      key: 'shareUrl',
      title: '资源链接',
      dataIndex: 'shareUrl',
    },
    {
      key: 'sharePsw',
      title: '链接密码',
      dataIndex: 'sharePsw',
    },
    {
      key: 'shareRemark',
      title: '资源备注',
      dataIndex: 'shareRemark',
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys: [], selectedRows: []) => {
      setStateSelectedRows(selectedRows);
      setStateSelectedRowKeys(selectedRowKeys);
    },
    selectedRowKeys: stateSelectedRowKeys,
  };

  return (
    <div>
      <Button onClick={handleAdd} style={{ marginBottom: '20px' }} type="primary">
        新增资源
      </Button>
      <Button onClick={handleEdit} style={{ margin: '0 20px 20px 20px' }} type="primary">
        编辑资源
      </Button>
      <Button onClick={handleDelete} style={{ marginBottom: '20px' }} type="primary" danger>
        删除资源
      </Button>
      <Table
        rowKey="id"
        columns={column}
        dataSource={data}
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
      />
      <Modal
        title={isEdit ? '编辑资源' : '新增资源'}
        destroyOnClose
        visible={visible}
        onCancel={onCancel}
        onOk={handleOk}
      >
        <Form {...layout} form={form} name="nest-messages">
          <Form.Item name={'shareKey'} label="资源关键词" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name={'shareUrl'} label="资源链接" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name={'sharePsw'} label="链接密码">
            <Input />
          </Form.Item>
          <Form.Item name={'shareRemark'} label="资源备注">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TableList;
