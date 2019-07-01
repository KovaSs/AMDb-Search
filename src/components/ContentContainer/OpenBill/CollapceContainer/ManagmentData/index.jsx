import React, { Component } from 'react'
import { Collapse, Icon, Spin, Descriptions, AutoComplete } from 'antd'
import RenderLeaderNameHeader from './RenderLeaderHeader'

  /** Вывод данных об руководстве */
class ManagmentData extends Component {
  state = {
    edited: false
  }

  /** Стандартный функционал отслеживания активный панелей */
  callback = key => {
  }

  toggleEdited = () => {
    this.setState(({edited}) => ({edited:!edited}))
  }

  render() {
    const activePanel = [];
    const { Panel } = Collapse;
    const { edited } = this.state
    const {searchData, dataFields, identifyUser, loading =false} = this.props
    const heads = dataFields.find( item => item.id === `${searchData}`);

    const renderInut = data => {
      if(Array.isArray(data)) {
        return (
          <AutoComplete
            style={{ width: 250 }}
            size="small"
            dataSource={data}
            placeholder="Введите значение"
            filterOption={(inputValue, option) =>  option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1 }
            defaultActiveFirstOption
          />
        )
      } else {
        return (
          <AutoComplete
            style={{ width: 250 }}
            size="small"
            dataSource={[data]}
            placeholder="Введите значение"
            filterOption={(inputValue, option) =>  option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1 }
          />
        )
      }
    }
  
    const renderFoulderFlItem = (item, key, id) => {
      const { Item : DescriptionsItem } = Descriptions;
      const { first_name, last_name, middle_name, inn, position} = item
      return (
        <Panel 
          key={String(key)}
          header={ <RenderLeaderNameHeader {...item} id={id}/> } 
          extra={<BtnExtra user={item} />}
        >
          <Spin spinning={loading}>
            <Descriptions size="small" bordered border column={{md:4, sm:2, xs:1}}>
              <DescriptionsItem id={ id } label="ИНН" span={1}>
                { edited ? renderInut(inn) : <span>{inn}</span> }
              </DescriptionsItem>
              <DescriptionsItem id={ id } label="ФИО" span={1}>
                { edited ? renderInut(`${last_name} ${first_name} ${middle_name}`) : <span>{`${last_name} ${first_name} ${middle_name}`}</span> } 
              </DescriptionsItem>
              <DescriptionsItem id={ id } label="Дата рождения" span={1}>
                { edited ? renderInut("28.09.2011") : <span>{"28.09.2011"}</span> }
              </DescriptionsItem>
              <DescriptionsItem id={ id } label="Должность" span={1}>
                { edited ? renderInut(position) : <span>{position}</span> } 
              </DescriptionsItem>
            </Descriptions>
          </Spin>
        </Panel>
      )
    } 
  
    const renderFoulderUlItem = ( item, key ) => {
      const { full_name, name, inn } = item
      return (
        <Panel 
          key={String(key)}
          header={ `${name}` } 
          extra={<BtnExtra user={item}/>}
        >
          <Spin spinning={loading}>
            <div>{`Название: ${full_name || name}`}</div>
            <div>{`ИНН: ${inn}`}</div>
          </Spin>
        </Panel>
      )
    }

    const BtnExtra = ({user}) => {
      const editUserInfo = e => {
        e.stopPropagation()
        console.log('edited', user)
        this.toggleEdited()
      }
      const identifyUserInfo = e => {
        e.stopPropagation()
        identifyUser(user)
      }
      return (
        <span className='heads-search'>
          <Icon title="Редактировать" className='heads-search-btn' type="form" onClick={ (e) => editUserInfo(e) }/>
          <Icon title="Поиск информации" className='heads-search-btn' type="file-search" onClick={ (e) => identifyUserInfo(e) }/>
        </span>
      )
    }

    const renderHeads = heads.data.map( (item, key) => {
      activePanel.push(String(key))
      const { inn } = item
      if( searchData === 'founders_fl' && dataFields.find( item => item.id === `heads`).data.find( el =>  el.inn === item.inn) ) {
        activePanel.pop()
      } else if(searchData === 'befenicials' 
        && dataFields.find( item => item.id === `founders_fl`).data.find( el =>  el.inn === item.inn)
        && dataFields.find( item => item.id === `heads`).data.find( el =>  el.inn === item.inn)) {
        activePanel.pop()
      } else if(searchData === 'leaders_list'){
        activePanel.pop()
      }
      return (
        <Collapse 
          key={inn}
          className="managment"
          defaultActiveKey={activePanel} 
          onChange={this.callback}
          bordered={false}
          expandIcon={({isActive}) => <Icon type={ !isActive ? "plus-square" : "minus-square"} />}
        >
          { item.name && renderFoulderUlItem(item, key) }
          { item.middle_name && renderFoulderFlItem(item, key, searchData) }
        </Collapse> 
      )
    })

    return <>{renderHeads}</>
  }
}

export default ManagmentData
