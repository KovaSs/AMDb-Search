import React from 'react'
import { Collapse, Col, Row, Icon, Table, Descriptions, Divider } from 'antd';
import { trasform } from "../../../../../services/transformData";

const CollapceItem = props => {
  const { Panel } = Collapse;
  const { companySource, riskSource } = props


  /** Преобразование входящих данных из props */
  const fullOrganistionInfo = trasform._companySource(companySource)
  // const managementInfo = trasform._managementSource(managementSource)
  const riskInfo = trasform._riskSource(riskSource)

  // console.log('object', managementInfo)

  /** Стандартный функционал отслеживания активный панелей */
  const callback = key => {
  }

  /** Рендеринг информационных полей организации */
  const renderFieldArr = fullOrganistionInfo.map(item => {
    if(item.data && 
      item.id !== "arbiter" && 
      item.id !== "befenicials" && 
      item.id !== "founders_fl" && 
      item.id !== "founders_ul" && 
      item.id !== "heads"  && 
      item.id !== "management_companies" && 
      item.id !== "name"  && 
      item.id !== "fns"  && 
      item.id !== "sanctions"  && 
      item.id !== "inn"  && 
      item.id !== "ogrn"  && 
      item.id !== "isponlit_proizvodstva"  && 
      item.id !== "full_name") {
      const red = (item.id === "fns" || item.id === "sanctions") ? " red" : ''
      return (
        <Row key={item.id} className="tabs-info__organisation-info">
          <Col span={8} className="lable">{ item.title }</Col>
          <Col span={16} className={'descr' + red}>{`${item.data}` }</Col>
        </Row>
      )
    } else {
      return null
    }
  })

  const renderLeftSideInfo = () => {
    return (
      <>
        <Panel header="Общая информация" key="1" showArrow={false}>
          <div>{renderFieldArr}</div>
        </Panel>
        <Panel header="Руководящие органы" key="2" forceRender>
          <Collapse onChange={callback} expandIcon={({isActive}) => <Icon type="plus-square" rotate={isActive ? 90 : 0}/>}>
            <Panel header="Связанные лица" key="1" forceRender>
              <Collapse onChange={callback} expandIcon={({isActive}) => <Icon type="plus-square" rotate={isActive ? 90 : 0}/>}>
                <Panel header="Руководство" key="1" forceRender>
                  <div>{text}</div>
                </Panel>
                <Panel header="Собственники" key="2" forceRender>
                  <div>{text}</div>
                </Panel>
                <Panel header="Бенефициары" key="3" forceRender>
                  <div>{text}</div>
                </Panel>
              </Collapse>
            </Panel>
            <Panel header="Совладельцы" key="2" forceRender>
              <div>{text}</div>
            </Panel>
          </Collapse>
        </Panel>
      </>
    )
  }

  /** Рендерин данных по стоплистам */
  const renderStopListsInfo = () => {
    const { arbiter } = riskSource
    /** Табилица арбитраж */
    const renderAbiterTable = () => {
      const arbiterData = trasform._arbiterTransform(arbiter)
      const columns = [
        { title: 'Роль', dataIndex: 'name'},
        { title: 'За 12 месяцев', dataIndex: 'year' }, 
        { title: 'За 3 года', dataIndex: 'year3' }
      ];
      return (
        <Table
          columns={columns}
          dataSource={arbiterData}
          bordered
          pagination={false}
        />
      )
    }

    const renderStopListFields = riskInfo.map(item => {
      const red = (item.id === "fns" || item.id === "sanctions" || item.id === "isponlit_proizvodstva") ? " red" : ''
      if( item.data !== "" && item.id !== "arbiter") {
        return (
          <Row key={item.id}>
            <Divider orientation="left">{ item.title }</Divider>
            <Col span={24} className={'descr' + red}>{`${item.data}` }</Col>
          </Row>
        )
      } else {
        return null
      }
    })

    return (
      <>
        <Panel header="Арбитраж" key="1" showArrow={false}>
          { renderAbiterTable() }
        </Panel>
        <Panel header="Стоп-листы" key="2" forceRender showArrow={false}>
          { renderStopListFields }
        </Panel>
      </>
    )
  }

  /** Рендеринг информационных полей об организации */
  const renderCompanySourceDescriptionFields = fullOrganistionInfo.filter(item => {
    return item.data && 
      item.id !== "arbiter" && 
      item.id !== "befenicials" && 
      item.id !== "founders_fl" && 
      item.id !== "founders_ul" && 
      item.id !== "heads"  && 
      item.id !== "management_companies" && 
      item.id !== "name"  && 
      item.id !== "fns"  && 
      item.id !== "sanctions"  && 
      item.id !== "inn"  && 
      item.id !== "ogrn"  && 
      item.id !== "isponlit_proizvodstva"  && 
      item.id !== "full_name"
  }).map(item => {
    const { Item : DescriptionsItem } = Descriptions;
    return <DescriptionsItem id={ item.id } key={ item.id } label={ item.title }>{ item.data }</DescriptionsItem>
  })

  const text = `A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome guest in many households across the world.`;

  return (
    <>
      { companySource ?
        <Collapse 
          defaultActiveKey={['1', '2']} 
          onChange={callback}
          expandIcon={({isActive}) => <Icon type="plus-square" rotate={isActive ? 90 : 0}/> }
        >
          <Panel header="Общая информация" key="1" showArrow={false}>
            <Row>
              <Col span={18}>
                <Descriptions bordered border size="small" column>
                  { renderCompanySourceDescriptionFields }
                </Descriptions>
              </Col>
              <Col span={6}>
                <Collapse 
                  defaultActiveKey={['1', '2']} 
                  onChange={callback}
                  expandIcon={({isActive}) => <Icon type="plus-square" rotate={isActive ? 90 : 0}/>}
                >
                  { renderStopListsInfo() }
                </Collapse> 
              </Col>
            </Row>
          </Panel>

        </Collapse>: null
      }
    </>
  )
}

export { CollapceItem }
