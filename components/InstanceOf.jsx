import React from 'react';
import debounce from 'lodash/debounce';
import {
  Select, Spin, Empty, List,
} from 'antd';
import superagent from 'superagent';

const defualtData = [
  {
    id: 'Q515',
    label: 'City',
  },
  {
    id: 'Q5',
    label: 'Human',
  },
];
class InstanceOf extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetching: false,
      data: defualtData,
    };
    this.instanceOfMapper = (rawData) => rawData.map((r) => ({
      id: r.id,
      label: r.label,
      description: r.description,
    }));
    this.getData = (value) => {
      this.setState({
        fetching: true,
      });
      if (value.trim() === '' || value === undefined) {
        this.setState({
          data: defualtData,
          fetching: false,
        });
      } else {
        superagent
          .get('https://www.wikidata.org/w/api.php')
          .query({
            origin: '*',
            action: 'wbsearchentities',
            format: 'json',
            limit: 20,
            continue: 0,
            language: 'en',
            uselang: 'en',
            type: 'item',
            search: value,
          })
          .end((err, info) => {
            this.setState({ fetching: false });
            if (!err) {
              const { body } = info;
              const rawSearch = body.search;
              this.setState({
                data: this.instanceOfMapper(rawSearch),
              });
            }
          });
      }
    };
    this.handleChange = (v) => {
      try {
        // eslint-disable-next-line react/destructuring-assignment
        this.props.onChange(v);
      } catch (e) {
        //   who caress
      }
    };
    this.handleSearch = (v) => {
      this.fetchData(v);
    };

    this.fetchData = debounce(this.getData, 300);
  }

  render() {
    const { fetching, data } = this.state;
    return (
      <Select
        labelInValue
        // value={value}
        defaultValue={data[0]}
        loading={fetching}
        allowClear
        showSearch
        placeholder="Select a subject"
        notFoundContent={fetching ? <Spin size="small" /> : <Empty />}
        filterOption={false}
        onSearch={this.handleSearch}
        onChange={this.handleChange}
        onDropdownVisibleChange={this.handleVisiblity}
        style={{ width: '100%' }}
        {...this.props}
      >
        {data.map((d) => (
          <Select.Option key={d.id}>
            {/* <List.Item> */}
            <List.Item.Meta
              title={(
                <>
                  <b>
                    (
                    {d.id}
                    )
                  </b>
                    &nbsp;
                  {d.label}
                </>
                )}
              description={d.description}
            />
            {/* </List.Item> */}
          </Select.Option>
        ))}
      </Select>

    );
  }
}

export default InstanceOf;
