import React, { Fragment, useState, useEffect } from 'react';
import { Modal, Row, Col, Form, Input, Table, Button, Select, message } from 'antd';
import { articleService, labelService } from '../../api';
const { Option } = Select;
const { TextArea } = Input;

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
  const [labelListData, setLabelListData] = useState([]);
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
      dataIndex: 'article_id',
    },
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '分类',
      dataIndex: 'label_name',
    },
    {
      title: '发布日期',
      dataIndex: 'created_at',
    },
    {
      title: '更新日期',
      dataIndex: 'updated_at',
    },
    {
      title: '浏览量',
      dataIndex: 'browser',
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '操作',
      dataIndex: 'operate',
      render: (text, record) => (
        <>
          <Button
            danger
            size="small"
            onClick={() => {
              delArticle(record);
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
              setId(record.article_id);
              showModal(true);
              console.log(record);
              form2.setFieldsValue({
                title: record.title,
                content: record.content,
                label_id: record.label_id,
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
    articleList();
    labelList();
  }, []);

  const onReset = () => {
    form1.resetFields();
    setCurrent(1);
    setQueryData({
      article_id: '',
      title: '',
      label_name: '',
      author: '',
    });
    articleList({
      article_id: '',
      title: '',
      label_name: '',
      author: '',
    });
  };

  //文章列表
  const articleList = async values => {
    setTableLoading(true);
    for (const key in values) {
      if (typeof values[key] === 'string') {
        values[key] = values[key].trim();
      }
    }
    const [err, res] = await articleService.articleList({ current: 1, pagesize, ...queryData, ...values });
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

  //分类列表
  const labelList = async () => {
    const [err, res] = await labelService.labelList();
    if (err) {
      return message.error(err.message);
    }
    const { code, msg, data } = res.data;
    if (code) {
      setLabelListData(data.records);
    } else {
      message.error(msg);
    }
  };

  //创建文章
  const addArticle = async values => {
    const [err, res] = await articleService.addArticle(values);
    setLoading(false);
    if (err) {
      return message.error(err.message);
    }
    const { code, msg } = res.data;
    if (code) {
      message.success(msg);
      showModal(false);
      setCurrent(1);
      articleList();
    } else {
      message.error(msg);
    }
  };

  //删除标签
  const delArticle = async record => {
    record.loading = true;
    setCount(1);
    const [err, res] = await articleService.delArticle(record.article_id);
    record.loading = false;
    setCount(2);
    if (err) {
      return message.error(err.message);
    }
    const { code, msg } = res.data;
    if (code) {
      setDataSource(dataSource.filter(item => item.article_id != record.article_id));
      setTotal(total - 1);
    } else {
      message.error(msg);
    }
  };

  //编辑标签
  const editArticle = async values => {
    const [err, res] = await articleService.editArticle({
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
      articleList();
    } else {
      message.error(msg);
    }
  };

  //表单提交
  const onFinish = async (num, values) => {
    if (num === 1) {
      //查询列表
      setCurrent(1);
      articleList(values);
    } else {
      //创建标签 or 编辑标签
      setLoading(true);
      type ? editArticle(values) : addArticle(values);
    }
  };

  const onChange = (num, val) => {
    console.log(`selected ${num},${val}`);
  };

  const onSearch = (num, val) => {
    console.log('search:', val);
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
          <Col span={6}>
            <Form.Item name="article_id" label="文章ID">
              <Input placeholder="请输入文章ID" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="title" label="文章标题">
              <Input placeholder="请输入文章标题" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="label_id" label="文章分类">
              <Select
                showSearch
                placeholder="请选择分类"
                optionFilterProp="children"
                onChange={value => {
                  onChange(1, value);
                }}
                onSearch={value => {
                  onSearch(1, value);
                }}
                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {labelListData.map(item => (
                  <Option key={item.label_id} value={item.label_id}>
                    {item.label_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="author" label="作者">
              <Select
                showSearch
                placeholder="请选择作者"
                optionFilterProp="children"
                onChange={value => {
                  onChange(2, value);
                }}
                onSearch={() => {
                  onSearch(2, value);
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
          <Col span={12}>
            <Button
              type="primary"
              onClick={() => {
                setType(0);
                showModal(true);
              }}
            >
              新建文章
            </Button>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Button htmlType="button" onClick={onReset}>
              重置
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Button htmlType="submit" type="primary">
              查询
            </Button>
          </Col>
        </Row>
      </Form>
      <br />
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={item => item.article_id}
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
            articleList({
              current: cur,
              pagesize: pagesize,
            });
          },
        }}
      />
      {/* 新建文章 */}
      <Modal
        title={type ? '编辑文章' : '新建文章'}
        destroyOnClose
        visible={visible}
        maskClosable={false}
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
            发布
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
          <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入文章标题' }]}>
            <Input placeholder="请输入文章标题" />
          </Form.Item>
          <Form.Item label="文章分类" name="label_id" rules={[{ required: true, message: '请选择文章分类' }]}>
            <Select
              showSearch
              placeholder="请选择文章分类"
              optionFilterProp="children"
              onChange={value => {
                onChange(3, value);
              }}
              onSearch={value => {
                onSearch(3, value);
              }}
              filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {labelListData.map(item => (
                <Option key={item.label_id} value={item.label_id}>
                  {item.label_name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="内容" name="content" rules={[{ required: true, message: '请输入文章内容' }]}>
            {/* 此处应该是一个富文本 */}
            <TextArea rows={4} placeholder="请输入文章内容" />
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

// 发布泳道的qa
