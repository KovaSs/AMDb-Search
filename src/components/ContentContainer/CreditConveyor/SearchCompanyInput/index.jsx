import React from 'react'
import { connect } from "react-redux";
import { actionChangeInn, actionChangeOgrn, loadCompanyInfo, loadingCompanyInfo } from "../../../../store/actions";
import SearchCompanyInput from "./SearchCompanyInput";

const Container = props => <SearchCompanyInput store={props}/>

const putActionsToProps =  {
    actionChangeInn,
    actionChangeOgrn,
    loadingCompanyInfo,
    loadCompanyInfo
}

export default connect(null, putActionsToProps)(Container)