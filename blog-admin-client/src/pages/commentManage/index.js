import React, { useRef, useState, useEffect, Fragment } from 'react';
import { Modal, Row, Col, Form, Input, Table, Button, Select, message } from 'antd';
const { Option } = Select;
import { commentService } from '@api';

export default props => {
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
  const pagesize = 5; //每页的条数
  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
    },
    {
      title: '文章标题',
      dataIndex: 'title',
    },
    {
      title: '评论内容',
      dataIndex: 'content',
    },
    {
      title: '昵称',
      dataIndex: 'nick_name',
    },
    {
      title: '赞',
      dataIndex: 'zan',
    },
    {
      title: '踩',
      dataIndex: 'cai',
    },
    {
      title: '评论日期',
      dataIndex: 'create_at',
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
              delComment(record);
            }}
            loading={record.loading}
          >
            删除
          </Button>
        </>
      ),
    },
  ];
  const dataSource = [
    {
      key: 1,
      id: 1,
      title: '11',
      nick_name: 'qingh',
      content: 'aaaaaaaaaaaa',
      zan: 23,
      cai: 5,
      create_at: Date.now(),
    },
    {
      key: 2,
      id: 2,
      title: '22',
      nick_name: 'blue',
      content: 'bbbbbbbb',
      zan: 67,
      cai: 3,
      create_at: Date.now(),
    },
  ];

  useEffect(() => {
    commentList();
  }, []);

  const onReset = () => {
    form.resetFields();
    setCurrent(1);
    setQueryData({
      comment_id: '',
      content: '',
      title: '',
    });
    commentList({
      label_id: '',
      label_name: '',
      author: '',
    });
  };

  //查询列表
  const commentList = async values => {
    setTableLoading(true);
    for (const key in values) {
      if (typeof values[key] === 'string') {
        values[key] = values[key].trim();
      }
    }
    const [err, res] = await commentService.commentList({ current: 1, pagesize, ...queryData, ...values });
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

  const onFinish = values => {
    console.log(values);
  };

  const onChange = (num, val) => {
    console.log(`selected ${num},${val}`);
  };

  const onSearch = (num, val) => {
    console.log('search:', val);
  };

  const [form] = Form.useForm();

  return (
    <Fragment>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Form.Item name="comment_id" label="评论ID">
              <Input placeholder="请输入评论ID" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="content" label="评论内容">
              <Input placeholder="请输入评论内容" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="title" label="文章标题">
              <Input placeholder="请输入文章标题" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="author" label="作者">
              <Select
                showSearch
                placeholder="请选择作者"
                optionFilterProp="children"
                onChange={value => {
                  onChange(1, value);
                }}
                onSearch={() => {
                  onSearch(1, value);
                }}
                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="tom">Tom</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
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
      <Table dataSource={dataSource} columns={columns} />
    </Fragment>
  );
};
