import React, {Component} from 'react'
import { Collapse, Icon, Descriptions, Button, Input, Select, Checkbox } from "antd"
import { uuid } from "../../../../../../../services/utils";

class AddNewUser extends Component {
  state = {
    error: false,
    checkbox: false,
    user: {
      inn: "",
      first_name: "",
      last_name: "",
      middle_name: "",
      position: "",
    },
    organisation: {
      org_name: "",
      org_inn: "",
      org_ogrn: "",
    }
  };

  componentDidCatch(err) {
    console.log('err', err)
    return this.setState({
      error: true
    })
  }

  renderFoulderFlItem = () => {
    const { Item: DescriptionsItem } = Descriptions
    const{ Option }= Select
    const { onSave, addUser, companySrc } = this.props
    const { user, organisation } = this.state
    const { Panel } = Collapse;
    const id = "add-new-descr-items"
    const key = "add-user"

    const BtnExtra = ({user}) => {
      const isUserTrue = user.first_name && user.first_name && user.last_name && user.middle_name && user.position && organisation.org_inn && organisation.org_ogrn
      const addUserInCheckList = e => {
        e.stopPropagation();
        addUser({
          inn: user.inn ? user.inn : "Не найден",
          first_name: user.first_name,
          last_name: user.last_name,
          middle_name: user.middle_name,
          newUser: true,
          id: uuid(),
          fio: `${user.last_name} ${user.first_name} ${user.middle_name}`,
          ActualDate: Date.now(),
          timeRequest: Date.now(),
          organisation: {
            name: organisation.org_name ? organisation.org_name : "",
            inn: organisation.org_inn,
            ogrn: organisation.org_ogrn
          },
          position: [{
            tagName : user.position,
            organisation: {
              name: organisation.org_name ? organisation.org_name : "",
              inn: organisation.org_inn,
              ogrn: organisation.org_ogrn
            }
          }]
        })
        onSave(false)
      };

      return (
        <span className="heads-search" style={{width: 48}}>
          <Button
            size="small"
            title="Добавить в проверку"
            icon="usergroup-add"
            style={{color: isUserTrue ? "#52c41a" : "gray", marginRight: 5}}
            onClick={e => addUserInCheckList(e)}
            disabled={!isUserTrue}
          />
        </span>
      );
    };

    const handleChangeInn = e => { const value = e.target.value; return this.setState(({ user }) => ({user: { ...user, inn: value}})) }
    const handleChangeLastName = e => { const value = e.target.value; return this.setState(({ user }) => ({user: { ...user, last_name: value}})) }
    const handleChangeFirstName = e => { const value = e.target.value; return this.setState(({ user }) => ({user: { ...user, first_name: value}})) }
    const handleChangeMiddletName = e => { const value = e.target.value; return this.setState(({ user }) => ({user: { ...user, middle_name: value}})) }
    const handleChangePosition = value => this.setState(({ user }) => ({user: { ...user, position: value}}))
    // const handleChangeOrgName = e => { const value = e.target.value; return this.setState(({ organisation }) => ({organisation: { ...organisation, org_name: value}})) }
    const handleChangeOrgInn = e => { const value = e.target.value; return this.setState(({ organisation }) => ({organisation: { ...organisation, org_inn: value}})) }
    const handleChangeOrgOgrn = e => { const value = e.target.value; return this.setState(({ organisation }) => ({organisation: { ...organisation, org_ogrn: value}})) }
    
    const changeCheckbox = ({target: {checked}}) => {
      this.setState((checkbox) => {
        if(checked) return {
          checkbox: checked,
          organisation: {
            org_name: companySrc.name,
            org_inn: companySrc.inn,
            org_ogrn: companySrc.ogrn
          }
        } 
        else return {
          checkbox: checked,
          organisation: {
            org_name: '',
            org_inn: '',
            org_ogrn: ''
          }
        }
      })
    }

    const RenderOrgDescr = (
      <>
        <div> Организация </div>
        <Checkbox onChange={changeCheckbox} >Текущая</Checkbox>
      </>
    )

    return (
      <Panel
        key={"1"}
        header="Добавление нового объекта проверки"
        extra={<BtnExtra user={user}/>}
      >
        <Descriptions
          className="description-border"
          size="small"
          bordered
          border
          column={{ md: 4, sm: 2, xs: 1 }}
        >
          <DescriptionsItem key={`${id}-${key}-1`} id={`${id}-${key}`} label="ФИО" span={1} >
            <>
              <Input onChange={handleChangeLastName}  placeholder="Фамилия" style={{ width: 150 }} size="small"/>
              <Input onChange={handleChangeFirstName}  placeholder="Имя" style={{ width: 150 }} size="small"/>
              <Input onChange={handleChangeMiddletName}  placeholder="Отчество" style={{ width: 150 }} size="small"/>
            </>
          </DescriptionsItem>
          <DescriptionsItem  key={`${id}-${key}-2`} id={`${id}-${key}`} label="ИНН" span={1} >
            <Input onChange={handleChangeInn} placeholder="ИНН" style={{ width: 200 }} size="small"/>
          </DescriptionsItem>
          <DescriptionsItem key={`${id}-${key}-3`} id={`${id}-${key}`} label="Должность в организации" span={1} >
            <Select onChange={handleChangePosition} placeholder="Должность" style={{ width: 200 }} size="small">
              <Option value="Руководитель"> Руководитель </Option>
              <Option value="Совладелец"> Совладелец </Option>
              <Option value="Бенефициар"> Бенефициар </Option>
              <Option value="Другое"> Другое </Option>
            </Select>
          </DescriptionsItem>
          <DescriptionsItem key={`${id}-${key}-4`} id={`${id}-${key}`} label={RenderOrgDescr} span={1} >
            <Input onChange={handleChangeOrgInn} value={this.state.organisation.org_inn} placeholder="ИНН организации" style={{ width: 150 }} size="small"/>
            <Input onChange={handleChangeOrgOgrn} value={this.state.organisation.org_ogrn} placeholder="ОГРН организации" style={{ width: 150 }} size="small"/>
          </DescriptionsItem>
        </Descriptions>
      </Panel>
    );
  };

  render() {
    const { error } = this.state

    if(error) return <div>В компоненте AddNew User произошла ошибка</div>
    return (
      <Collapse
        key="add-new-user"
        className="managment"
        defaultActiveKey={["1"]}
        bordered={false}
        expandIcon={({ isActive }) => (
          <Icon type={!isActive ? "plus-square" : "minus-square"} />
        )}
      >
        { this.renderFoulderFlItem()}
      </Collapse>
    );
  }
}

export default AddNewUser
