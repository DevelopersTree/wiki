import React from 'react';
import {
  Card, Button,
  Row, Col, Badge, Select, Empty, Spin,
} from 'antd';
import uniqid from 'uniqid';
import { parse } from 'json2csv';
import _ from 'lodash';
import {
  GiftOutlined, LoadingOutlined, CloudDownloadOutlined, GithubOutlined,
} from '@ant-design/icons';

import superagent from 'superagent';
import queryBuilder from '../queries/suggest';
import InstanceOf from '../components/InstanceOf';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      downloading: false,
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
      this.setState({ loading: true });
      this.fetchData();
    };
    this.downloadCsv = (csvString) => {
      const blob = new Blob([csvString]);
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, 'filename.csv');
      } else {
        const a = window.document.createElement('a');

        a.href = window.URL.createObjectURL(blob, {
          type: 'text/plain',
        });
        a.download = 'export.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    };
    this.exportClicked = () => {
      this.setState({ downloading: true });

      this.fetchData((data) => {
        this.setState({ downloading: false });
        const csv = parse(data, _.keys(data));
        this.downloadCsv(csv);
      });
    };
    this.fetchData = (calback = undefined) => {
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
            if (!calback) {
              this.setState({
                entities: this.resultMapper(body.results.bindings),
              });
            } else {
              calback(this.resultMapper(body.results.bindings));
            }
          }
        });
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.fetchData();
  }

  render() {
    const {
      loading, entities, limit, downloading,
    } = this.state;
    return (
      <>
        <Row justify="center" gutter={[10, 10, 10, 10]} style={{ marginBottom: 20 }}>
          <Col xl={3} md={3} sm={24} xs={24}>
            <a style={{ color: '#696969' }} alt="Github" href="https://github.com/DevelopersTree/wiki">
              <GithubOutlined style={{ fontSize: 30 }} />
            </a>
          </Col>
          <Col xl={8} md={8} sm={24} xs={24}>
            <InstanceOf onChange={this.subjectChanged} />
          </Col>
          <Col xl={2} md={2} sm={24} xs={24}>
            <Select style={{ width: '100%' }} onChange={this.limitChanged} placeholder="Choose Result Limit" value={limit}>
              <Select.Option value={12}>12</Select.Option>
              <Select.Option value={20}>20</Select.Option>
              <Select.Option value={40}>40</Select.Option>
              <Select.Option value={50}>50</Select.Option>
              <Select.Option value={100}>100</Select.Option>
              <Select.Option value={100} style={{ color: 'red' }}>500</Select.Option>
              <Select.Option value={100} style={{ color: 'red' }}>1000</Select.Option>
              {/* <Select.Option value={500}>500</Select.Option>
              <Select.Option value={1000}>1000</Select.Option> */}
            </Select>
          </Col>
          <Col xl={4} md={4} sm={24} xs={24}>
            <Button block icon={<GiftOutlined />} loading={loading} onClick={this.fetchClicked} type="primary">Suggest</Button>
          </Col>
          <Col xl={4} md={4} sm={24} xs={24}>
            <Button block icon={<CloudDownloadOutlined />} loading={downloading} onClick={this.exportClicked} type="dashed">Download</Button>
          </Col>
        </Row>
        <Row gutter={[20, 20, 20, 20]} justify="center" align="middle">
          {
            entities.map((e) => (
              <Col xl={6} md={12} sm={24} xs={24} key={uniqid()}>
                <a href={e.wikipediaUrl} target="_blank" rel="noreferrer" key={uniqid()}>
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
