import React, { Component } from "react";
import { connect } from "react-redux";
import { Spin, Col, Row, Switch } from "antd";
import PropTypes from "prop-types";
import CollapceContainer from "./CollapceContainer";
import SearchCompanyInput from "./SearchCompanyInput";
import "./open-bill.scss"

class OpenBill extends Component {
  static propTypes = {
    companyResponse: PropTypes.object,
    requestLoading: PropTypes.object,
    renderData: PropTypes.bool,
    errors: PropTypes.object
  }

  state = {
    showTable : false,
    loading : false,
    newBill: true
  }  

  componentWillReceiveProps(nextProps) {
    const { companyResponse } = this.props

    nextProps.requestLoading.companyMainInfoUpdate === true ?
      this.setState({
        loading: true
      }) :
      this.setState({
        loading: false,
        showTable: true
      })
    nextProps.companyResponse !== companyResponse && 
    this.setState({ 
      showTable: true 
    })
  }

  componentDidMount() {
    const { companyResponse } = this.props
    companyResponse &&
    this.setState({
      showTable: true
    })
  }

  toggleVersion = () => {
    const { newBill } = this.state;
    this.setState({
      newBill: !newBill
    })
  }

  toHideTableInfo = () => {
    this.setState({
      showTable: false
    })
  }

  render() {
    const { showTable, loading, newBill } = this.state
    const { renderData } = this.props

    const newOpenBill = (
      <Row className="credit-conveyor">
        <Col span={24}>
          <SearchCompanyInput toHideTableInfo={this.toHideTableInfo} />
          { showTable && renderData ?
            <CollapceContainer /> : 
            <Spin spinning={loading} size="large" tip="Идет поиск данных" >
              <div className="search-result-table">
                <div>Для поиска информации об организации введите ИНН или ОГРН в поисковую строку</div>
              </div>
            </Spin>
          }
        </Col>
      </Row>
    )

    return (
      <>
        <div className="conveyor-version"><Switch onChange={this.toggleVersion} checkedChildren="new" unCheckedChildren="old" /></div>
        { newBill ?
          newOpenBill :
          <iframe src="https://10.96.205.191/cgi-bin/serg/0/6/9/reports/276/konttur_focus_viewer_new2.pl" title="open-bill" width="100%" height="890px"></iframe>
        }
      </>
    );
  }
}

const putStateToProps = state => {
  const {openBill : { companyResponse, requestLoading, renderData, errors }} = state
  return {
    companyResponse,
    requestLoading,
    renderData,
    errors
  }
}

export default connect(putStateToProps)(OpenBill);


