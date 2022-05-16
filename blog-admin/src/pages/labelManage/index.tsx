import React, { useRef, useState, useEffect, Fragment } from 'react';
import { Modal, Row, Col, Form, Input, Table, Button, message } from 'antd';
import { labelService } from '../../api';

export default () => {
  const [dataSource, setDataSource] = useState([]);
  const [visible, showModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0); //此state只是为了表格里的按钮loading时能重新渲染
  const [tableLoading, setTableLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [id, setId] = useState(0);
  const [current, setCurrent] = useState(1);
  const [type, setType] = useState(0); //0:新建；1:编辑
  const [queryData, setQueryData] = useState({
    label_id: '',
    label_name: '',
    author: '',
  });
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const pagesize = 5; //每页的条数
  const columns = [
    {
      title: 'id',
      dataIndex: 'label_id',
    },
    {
      title: '标签名称',
      dataIndex: 'label_name',
    },
    {
      title: '创建人',
      dataIndex: 'author',
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
    },
    {
      title: '操作',
      width: 200,
      dataIndex: 'operate',
      render: (text, record) => (
        <>
          <Button
            danger
            size="small"
            onClick={() => {
              delLabel(record);
            }}
            loading={record.loading}
          >
            删除
          </Button>
          &nbsp;&nbsp;&nbsp;
          <Button
            size="small"
            onClick={() => {
              setType(1);
              setId(record.label_id);
              showModal(true);
              form2.setFieldsValue({
                label_name: record.label_name,
              });
            }}
          >
            编辑
          </Button>
        </>
      ),
    },
  ];

  useEffect(() => {
    labelList();
  }, []);

  //重置
  const onReset = async () => {
    form1.resetFields();
    setCurrent(1);
    setQueryData({
      label_id: '',
      label_name: '',
      author: '',
    });
    labelList({
      label_id: '',
      label_name: '',
      author: '',
    });
  };

  //查询列表
  const labelList = async values => {
    setTableLoading(true);
    for (const key in values) {
      if (typeof values[key] === 'string') {
        values[key] = values[key].trim();
      }
    }
    const [err, res] = await labelService.labelList({ current: 1, pagesize, ...queryData, ...values });
    setTableLoading(false);
    if (err) {
      return message.error(err.message);
    }
    const { code, msg, data } = res.data;
    if (code) {
      data.records.forEach(item => {
        item.loading = false;
      });
      setDataSource(data.records);
      setTotal(data.total);
    } else {
      message.error(msg);
    }
  };

  //创建标签
  const addLabel = async values => {
    const [err, res] = await labelService.addLabel(values);
    setLoading(false);
    if (err) {
      return message.error(err.message);
    }
    const { code, msg } = res.data;
    if (code) {
      message.success(msg);
      showModal(false);
      setCurrent(1);
      labelList();
    } else {
      message.error(msg);
    }
  };

  //删除标签
  const delLabel = async record => {
    record.loading = true;
    setCount(1);
    const [err, res] = await labelService.delLabel(record.label_id);
    record.loading = false;
    setCount(2);
    if (err) {
      return message.error(err.message);
    }
    const { code, msg } = res.data;
    if (code) {
      setDataSource(dataSource.filter(item => item.label_id != record.label_id));
      setTotal(total - 1);
    } else {
      message.error(msg);
    }
  };

  //编辑标签
  const editLabel = async values => {
    const [err, res] = await labelService.editLabel({
      ...values,
      id,
    });
    setLoading(false);
    if (err) {
      return message.error(err.message);
    }
    const { code, msg } = res.data;
    if (code) {
      showModal(false);
      setCurrent(1);
      labelList();
    } else {
      message.error(msg);
    }
  };

  //表单提交
  const onFinish = async (num, values) => {
    if (num === 1) {
      //查询列表
      setCurrent(1);
      labelList(values);
    } else {
      //创建标签 or 编辑标签
      setLoading(true);
      type ? editLabel(values) : addLabel(values);
    }
  };

  return (
    <Fragment>
      <Form
        layout="vertical"
        form={form1}
        onFinish={values => {
          onFinish(1, values);
        }}
      >
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Form.Item name="label_id" label="标签ID">
              <Input
                placeholder="请输入标签ID"
                onChange={event => {
                  console.log(event.target.value);
                  setQueryData({
                    ...queryData,
                    label_id: event.target.value,
                  });
                }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="label_name" label="标签名称">
              <Input
                placeholder="请输入标签名称"
                onChange={event => {
                  setQueryData({
                    ...queryData,
                    label_name: event.target.value,
                  });
                }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="author" label="创建人">
              <Input
                placeholder="请输入创建人名称"
                onChange={event => {
                  setQueryData({
                    ...queryData,
                    author: event.target.value,
                  });
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Button
              type="primary"
              onClick={() => {
                setType(0);
                showModal(true);
              }}
            >
              新建标签
            </Button>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Button htmlType="button" onClick={onReset}>
              重置
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Col>
        </Row>
      </Form>
      <br />
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={item => item.label_id}
        loading={tableLoading}
        pagination={{
          total,
          current,
          pageSize: pagesize,
          showTotal() {
            return `共${total}条`;
          },
          onChange(cur) {
            setCurrent(cur);
            labelList({
              current: cur,
              pagesize: pagesize,
            });
          },
        }}
      />

      {/* 新建标签 or 编辑标签*/}
      <Modal
        title={type ? '编辑标签' : '新建标签'}
        destroyOnClose
        visible={visible}
        maskClosable={false}
        onOk={() => {
          form2.submit();
        }}
        onCancel={() => {
          showModal(false);
        }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              showModal(false);
            }}
          >
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={() => {
              form2.submit();
            }}
          >
            确定
          </Button>,
        ]}
      >
        <Form
          layout="vertical"
          form={form2}
          preserve={false}
          onFinish={values => {
            onFinish(2, values);
          }}
        >
          <Form.Item label="标签名称" name="label_name" rules={[{ required: true, message: '请输入标签名称' }]}>
            <Input placeholder="请输入标签名称" rules={[{ required: true, message: '请输入标签名称' }]} />
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};
