import React from 'react'
import { Tag, AutoComplete, Badge, Input, Popover, Button } from 'antd'
import { getDate, uuid, parsingFio, sumTrans } from '../../../../../../../services/utils'

const styleCss = {
  historyTitle: {
    color: "gray",
    fontStyle: "italic",
    marginLeft: 5
  },
  popover: {
    maxWidth: 300,
    maxHeight: 102,
    overflowY: "auto"
  },
  bange: {
    blue: {
      backgroundColor: "#e6f7ff",
      color: "#1890ff",
      boxShadow: "0 0 0 1px #91d5ff inset"
    },
    cyan: {
      backgroundColor: "#e6fffb",
      color: "#13c2c2",
      boxShadow: "0 0 0 1px #87e8de inset"
    },
    volcano: {
      backgroundColor: "#fff2e8",
      color: "#fa541c",
      boxShadow: "0 0 0 1px #ffbb96 inset"
    },
    red: {
      backgroundColor: "rgb(255, 241, 240)",
      color: "#f5222d",
      boxShadow: "0 0 0 1px #ffa39e inset"
    },
    gray: {
      backgroundColor: "#fafafa",
      color: "rgba(0, 0, 0, 0.65)",
      boxShadow: "0 0 0 1px #d9d9d9 inset"
    },
    green: {
      backgroundColor: "#f6ffed",
      color: "#52c41a",
      boxShadow: "0 0 0 1px #b7eb8f inset"
    },
  },
  stopList: {
    title: {
      color: "red",
      fontWeight: 500
    },
    rowTitle: {
      fontWeight: 600
    },
    text: {
      color: "red"
    },
    rowKey: {
      fontWeight: 600,
      marginTop: 5
    }
  },
  tagInfo: {
    fontStyle: "italic"
  },
  posTitle: {
    color: "rgba(0, 0, 0, 0.85)",
    fontWeight: 500,
    borderBottom: "1px #d9d9d9 solid",
    margin: "10px 0"
  }
}

/** Рендеринг компонента изменения LeaderHeader при редактировании записи */
const RenderEditedLeader = props => {
  const { Option } = AutoComplete;
  const { 
    user,
    item: {
      id: itemId,
      position, 
      ActualDate, 
      organisation,
      history = false,
      newUser = false,
    },
    digets,
    stopLists,
    userSelected,
    identifyUserloading,
    croinformRes = {},
    companyName,
    fssp,
    onAction: {
      handleSelectOption,
      handleChangeInn,
      handleChangeSurName,
      handleChangeMiddleName,
      handleChangeFirstName,
      showDrawer
    }
  } = props

  const renderPositionTag = () => {
    if(position.length) {
      const tag = position[0]

      const posType = {
        color: history ? false : newUser ? "green" : "blue",
        tag: history ? styleCss.bange.gray : newUser ? styleCss.bange.green : styleCss.bange.blue
      }

      const content = (
        <div style={styleCss.popover}>
          { position.map((item, index, tagTitle="") => {
            switch (item.tagName) {
              case "Акционер":
                tagTitle = 
                  <Tag key={uuid()} color={ posType.color }>
                    { `${item.tagName}${item.share && item.share.hasOwnProperty('capitalSharesPercent') ? ` (${item.share.capitalSharesPercent} / ${item.share.capitalSharesPercent})` : ""}` }
                  </Tag>
                break;
              case "Учредитель":
                tagTitle = 
                  <Tag key={uuid()} color={ posType.color }>
                    { `${item.tagName}${item.share && item.share.hasOwnProperty('sum') ? ` (${sumTrans(item.share.sum)})` : ""}` }
                  </Tag>
                break;
              default:
                tagTitle = 
                <Tag key={uuid()} color={ posType.color } style={history ? styleCss.historyTitle : null}>
                  { item.tagName }
                </Tag>
            }
            return (
              <div style={styleCss.tagContent} key={`tag-content-${index}`}>
                { index !== 0 ?  <div style={styleCss.posTitle}> {tagTitle} </div> : <div style={{margin: "0 0 10px 0"}}> {tagTitle} </div> }
                <div>Организация: {item.organisation.name}</div>
                <div>ИНН: {item.organisation.inn}</div>
                <div>ОГРН: {item.organisation.ogrn}</div>
                {
                  item.organisation.hasOwnProperty('share') && item.organisation.share.hasOwnProperty('sum') && item.organisation.share.sum ?
                  <div style={styleCss.tagInfo}> {`Учредитель владеет: ${sumTrans(item.organisation.share.sum)}`} </div> : null
                }
              </div>
            )})
          }
        </div>
      )

      return (
        <Popover 
          key={`position-tag-${itemId}` }
          content={content} 
          trigger="hover" 
          style={{...styleCss.popover, maxHeight: 150}}
          title={ posType.title }
        >
          <Badge count={position.length} offset={[-9,1]} style={posType.tag}>
            <Tag key={uuid()} color={ posType.color } >{tag.tagName}</Tag>
          </Badge>
        </Popover>
      )
    }
  }

  // Рендеринг опций выпадающего меню
  const renderFioOption = item =>  <Option key={item} text="SurName" title={item} value={parsingFio(item).SurName}> {item} </Option>
  const renderInnOption = item =>  <Option key={`header-list-inn-${item}`} text="inn" title={item} value={item}> {item} </Option>

  const renderTagsInfo = (arr =[]) => {
    const vector = croinformRes.vector ? croinformRes.vector : []
    const lists = croinformRes.lists ? croinformRes.lists : []
    if(vector.length) {
      const content = <div style={styleCss.popover}>{vector.map((item, index) => <div key={index} >{item}</div>)}</div>
      arr.push(
        <Popover key="vector" title="Найден в списках" content={content} trigger="hover" >
          <Badge count={vector.length} offset={[-9,1]} style={styleCss.bange.cyan}>
            <Tag color="cyan" > Вектор заемщика </Tag> 
          </Badge>
        </Popover>
      )
    } else if (croinformRes.hasOwnProperty("vector")) {
      const content = <div style={styleCss.popover}>Данных вектора заемщика по данному запросу не найдено</div>
      arr.push(
        <Popover key="vector" title="Данных в списках не найдено" content={content} trigger="hover" >
          <Badge count={0} showZero offset={[-9,1]} style={styleCss.bange.cyan}>
            <Tag color="cyan" > Вектор заемщика </Tag> 
          </Badge>
        </Popover>
      )
    }
    if(lists.length) {
      const content = <div style={styleCss.popover}>{lists.map((item, index) => <div key={index} >{item}</div>)}</div>
      arr.push(
        <Popover key="lists" title="Найден в списках" content={content} trigger="hover" style={styleCss.popover}>
          <Badge count={lists.length} offset={[-9,1]} style={styleCss.bange.volcano}>
            <Tag color="volcano" > Списки </Tag> 
          </Badge>
        </Popover>
      )
    } else if (croinformRes.hasOwnProperty("lists")) {
      const content = <div style={styleCss.popover}>Данных состояния в списках по данному запросу не найдено</div>
      arr.push(
        <Popover key="lists" title="Данных в списках не найдено" content={content} trigger="hover" >
          <Badge count={0} showZero offset={[-9,1]} style={styleCss.bange.volcano}>
            <Tag color="volcano" > Списки </Tag> 
          </Badge>
        </Popover>
      )
    }

    try {
      if(stopLists && stopLists.length) {
        const content = 
          <div style={styleCss.popover}>
            {
              stopLists.map((item, index) => {
                return (
                  <div key={index}>
                    <label style={styleCss.stopList.rowTitle}> {`${item.report_name ? item.report_name : "Без названия"} ${item.ID_base ? `( ${item.ID_base} ${item.ID_table ? `/ ${item.ID_table} ` : ""})` : ""}`}</label>
                  </div>
                )
              })
            }
          </div>
        arr.push(
          <Popover key="stop-lists" title={`Найден в ${stopLists.length} базах стоп-листов`} content={content} trigger="hover" >
            <Badge count={stopLists.length} offset={[-9,1]} style={styleCss.bange.red}>
              <Tag color="red" > Стоп-листы </Tag> 
            </Badge>
          </Popover>
        )
      } else if (stopLists) {
        const content = <div style={styleCss.popover}>Данных состояния в стоп-листах по данному запросу не найдено</div>
        arr.push(
          <Popover key="stop-lists" title="Данные стоп-листов" content={content} trigger="hover" >
            <Badge count={0} showZero offset={[-9,1]} style={styleCss.bange.red}>
              <Tag color="red" > Стоп-листы </Tag> 
            </Badge>
          </Popover>
        )
      }
    } catch (error) {
      console.log('Stop lists', error)
    }

    try {
      if(digets.history.length) {
        const content = 
          <div style={styleCss.popover}>
            Найдены исторические данные с предыдущих проверок
            <Button
              title="Показать найденные риск факторы"
              size="small"
              type="link"
              onClick={e => showDrawer(e)}
            >
              Подробнее
            </Button>
          </div>
        arr.push(
          <Popover key="risk-factors" title="Найдены риск факторы" content={content} trigger="hover" >
            <Badge count={digets.digets.length} offset={[-9,1]} style={styleCss.bange.red}>
              <Tag color="red" > Риск факторы </Tag> 
            </Badge>
          </Popover>
        )
      }
    } catch (error) {
      console.log('Risk fastors', error)
    }

    if(fssp && fssp.length) {
      const content = (
        <div style={styleCss.popover}>
          {
            fssp.indexOf("По вашему запросу ничего не найдено") === -1 ?
            <div>Данные из ФССП получены</div> : <div>Данные в ФССП отсутствуют</div>
          }
        </div>)
      arr.push(
        <Popover key="fssp" title="Данные из ФССП" content={content} trigger="hover" style={styleCss.popover}>
          <Tag color="purple" > ФССП </Tag> 
        </Popover>
      )
    }

    return arr
  }

  return (
    <div className="leader-name-header">
      <span onClick={e => e.stopPropagation()} style={{marginRight: 10}}>
          <span className="leader-name-header_fio" >
            <Badge count={user.fio.length > 1 ? user.fio.length : null }>
              <AutoComplete
                size="small"
                key="last_name"
                style={{ width: 150 }}
                optionLabelProp={""}
                dataSource={user.fio.map(renderFioOption)}
                onSelect={handleSelectOption}
                onChange={handleChangeSurName}
                value={userSelected.SurName}
                placeholder="Фамилия"
                filterOption={(value, option) =>  option.props.title.toUpperCase().indexOf(value.toUpperCase()) !== -1}
                allowClear
                disabled={identifyUserloading}
              />
            </Badge>
            <Input 
              size="small"
              placeholder="Имя" 
              style={{ width: 150 }}
              value={userSelected.FirstName} 
              onChange={handleChangeFirstName}
              disabled={identifyUserloading} 
            />
            <Input 
              size="small"
              placeholder="Отчество" 
              style={{ width: 150 }} 
              value={userSelected.MiddleName} 
              onChange={handleChangeMiddleName}
              disabled={identifyUserloading} 
            />
          </span>
          <span className="leader-name-header_position">
            <Badge count={user.inn.length > 1 ? user.inn.length : null }>
              <AutoComplete
                size="small"
                key="header-list-inn"
                optionLabelProp={""}
                style={{ width: 125 }}
                value={userSelected.inn}
                dataSource={user.inn.map(renderInnOption)}
                onSelect={handleSelectOption}
                onChange={handleChangeInn}
                placeholder="ИНН"
                filterOption={(value, option) =>  option.props.title.toUpperCase().indexOf(value.toUpperCase()) !== -1}
                allowClear
                disabled={identifyUserloading}
              />
            </Badge>
          </span>
      </span>
      <label className="leader-name-header_position">
        { renderPositionTag() }
      </label>
      <label className="leader-name-header_position">
        {`${organisation ? organisation.name : companyName}`}
      </label>
      <label className="leader-name-header_date">
        { getDate(ActualDate) }
      </label>
      <label className="leader-name-header_date" onClick={e => e.stopPropagation(e)}>
        { renderTagsInfo() }
      </label>
    </div>
  )
}

export default RenderEditedLeader