import React from 'react';
import {
  Card, Button,
  Row, Col, Badge, Select, Empty, Spin,
} from 'antd';
import { GiftOutlined, LoadingOutlined } from '@ant-design/icons';

import superagent from 'superagent';
import queryBuilder from '../queries/suggest';
import InstanceOf from '../components/InstanceOf';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      entities: [],
      limit: 12,
      instanceOf: 'Q515', // city ID
    };
    this.resultMapper = (rawData) => rawData.map((r) => {
      const idParts = `${r.id.value}`.split('/');
      return {
        id: idParts[idParts.length - 1],
        name: r.name.value,
        description: `${r.description.value}`.charAt(0).toUpperCase() + `${r.description.value}`.slice(1),
        image: r.image.value,
        linkCount: r.linkCount.value,
        wikipediaUrl: `https://en.wikipedia.org/wiki/${r.name.value}`,
      };
    });
    this.limitChanged = (limit) => {
      this.setState({ limit });
    };
    this.subjectChanged = (v) => {
      if (v) {
        this.setState({ instanceOf: v.value });
      }
    };
    this.fetchClicked = () => {
      this.fetchData();
    };
    this.fetchData = () => {
      this.setState({ loading: true, entities: [] });
      const { instanceOf, limit } = this.state;
      superagent.get('https://query.wikidata.org/sparql')
        .query({
          query: queryBuilder(instanceOf, limit),
          format: 'json',
        })
        .end((err, info) => {
          this.setState({ loading: false });
          if (!err) {
            const { body } = info;
            this.setState({
              entities: this.resultMapper(body.results.bindings),
            });
          }
        });
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  render() {
    const { loading, entities, limit } = this.state;
    return (
      <>
        <Row justify="center" gutter={(10, 10)} style={{ marginBottom: 20 }}>
          <Col offset={3} span={8}>
            <InstanceOf onChange={this.subjectChanged} />
          </Col>
          <Col span={2}>
            <Select style={{ width: '100%' }} onChange={this.limitChanged} placeholder="Choose Result Limit" value={limit}>
              <Select.Option value={12}>12</Select.Option>
              <Select.Option value={20}>20</Select.Option>
              <Select.Option value={40}>40</Select.Option>
              <Select.Option value={50}>50</Select.Option>
              <Select.Option value={100}>100</Select.Option>
              {/* <Select.Option value={500}>500</Select.Option>
              <Select.Option value={1000}>1000</Select.Option> */}
            </Select>
          </Col>
          <Col span={4}>
            <Button icon={<GiftOutlined />} loading={loading} onClick={this.fetchClicked} type="primary">Suggest</Button>
          </Col>
        </Row>
        <Row gutter={(10)} justify="center" align="middle">
          {
            entities.map((e) => (
              <Col span={6} style={{ paddingBottom: 10 }}>
                <a href={e.wikipediaUrl} target="_blank" rel="noreferrer">
                  <Card
                    style={{ width: '100%' }}
                    cover={(
                      <div style={{ height: 200, backgroundImage: `url(${e.image})`, backgroundSize: 'cover' }} />
                  )}
                  >
                    <Card.Meta
                      title={(
                        <>
                          {e.name}
                          {' '}
                          <Badge count={e.linkCount} overflowCount={2000} />
                        </>
                      )}
                      description={`${e.description}`.substr(0, 300)}
                    />
                  </Card>
                </a>
              </Col>
            ))
          }
          {
           loading ? (
             <Col span={24} style={{ textAlign: 'center' }}>
               <Spin indicator={<LoadingOutlined style={{ fontSize: 30 }} spin />} />
             </Col>
           ) : null
          }
          {
            entities.length === 0 && !loading ? <Empty /> : null
          }
        </Row>
      </>
    );
  }
}
export default Index;
