import React, { Component } from "react";
import { connect } from "react-redux";
import { Spin } from "antd";
import CollapceContainer from "./CollapceContainer";
import SearchCompanyInput from "./SearchCompanyInput";
import "./сredit-сonveyor.scss"

class CreditConveyor extends Component {
  state = {
    /** showTable : false */
    showTable : true,
    loading : false
  }  

  componentWillReceiveProps(nextProps) {
    const { companyResponse } = this.props
    if(nextProps.searchLoading === true) {
      this.setState({
        loading: true
      })
    } else {
      this.setState({
        loading: false
      })
    }
    if(nextProps.companyResponse !== companyResponse) {
      this.setState({
        showTable: true
      })
    }
  }

  componentDidMount() {
    const { companyResponse } = this.props
    if(companyResponse) {
      this.setState({
        showTable: true
      })
    }
  }

  render() {
    const { showTable, loading } = this.state

    return (
      <div className="credit-conveyor">
        <SearchCompanyInput />
        { showTable ?
          <CollapceContainer /> : 
          <div className="search-result-table">
            { loading ?
              <Spin size="large" /> :
              <div>Для поиска информации об организации введите ИНН или ОГРН в поисковую строку</div>
            }
          </div>
        }
      </div>
    );
  }
}

const putStateToProps = state => {
  const {creditConveyor : { companyResponse, searchLoading }} = state
  return {
    companyResponse,
    searchLoading
  }
}

export default connect(putStateToProps)(CreditConveyor);
