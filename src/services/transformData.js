import * as _ from 'lodash';
import { fieldsArr } from "./fields";

class TransformData {
  _transformAllData = inputData => {
    const Field = (title, data) => ({ title, data })
    let clgData = {}
    const cloneFieldsArr = _.cloneDeep(fieldsArr);
    const fullOrganistionInfo = cloneFieldsArr.map( item => {      
      const _arbiterTransform = item => {
        return item = [{
          key: '1',
          name: 'Истец',
          year: item.istec.year,
          year3: item.istec.year3,
        }, {
          key: '2',
          name: 'Ответчик',
          year: item.otvet.year,
          year3: item.otvet.year,
        }]
      };
  
      const _headersTransform = item => {
        let i=0, newArr =[]
        item.map( elem => {
          newArr.push({
            key: i,
            fio: `${elem.sur_name} ${elem.first_name} ${elem.last_name}`,
            inn: elem.inn,
          })
          i++
          return newArr
        })
        return newArr
      };
  
      for (const el in inputData) {
        if(item.id === el && item.id === "arbiter") {
          let newData = _arbiterTransform(inputData[el])
          clgData[el] = new Field(item.title, newData)
          return _.assign(item, { "data" : newData})
        } else if(item.id === el && item.id === "heads") {
          let newData = _headersTransform(inputData[el])
          clgData[el] = new Field(item.title, newData)
          return _.assign(item, { "data" : newData})
        } else if(item.id === el ) {
          clgData[el] = new Field(item.title, inputData[el])
          return _.assign(item, { "data" : inputData[el]})
        }
      }
      return item
    })
    console.table(clgData)
    return fullOrganistionInfo
  }

  _companySource = inputData => {
    const Field = (title, data) => ({ title, data })
    let clgData = {}
    const cloneFieldsArr = _.cloneDeep(fieldsArr);
    const fullOrganistionInfo = cloneFieldsArr.map( item => {
      for (const el in inputData) {
        if(item.id === el ) {
          clgData[el] = new Field(item.title, inputData[el])
          return _.assign(item, { "data" : inputData[el]})
        }
      }
      return item
    })
    console.table(clgData)
    return fullOrganistionInfo
  }

  _managementSource = inputData => {
    const Field = (title, data) => ({ title, data })
    let clgData = {}
    const cloneFieldsArr = _.cloneDeep(fieldsArr);
    const fullOrganistionInfo = cloneFieldsArr.map( item => {
      for (const el in inputData) {
        if(item.id === el ) {
          clgData[el] = new Field(item.title, inputData[el])
          return _.assign(item, { "data" : inputData[el]})
        }
      }
      return item
    })
    console.table(clgData)
    const filteredManagementInfo = fullOrganistionInfo.filter(item => (item.id === "befenicials" || item.id === "founders_fl" || item.id === "founders_ul" || item.id === "heads"  || item.id === "management_companies"))
    return filteredManagementInfo
  }

  _riskSource = inputData => {
    const Risk = (title, data) => ({ title, data })
    let clgRiskData = {}
    const cloneFieldsArr = _.cloneDeep(fieldsArr);
    const riskOrganistionInfo = cloneFieldsArr.map( item => {
      for (const el in inputData) {
        if(item.id === el ) {
          clgRiskData[el] = new Risk(item.title, inputData[el])
          return _.assign(item, { "data" : inputData[el]})
        }
      }
      return item
    })
    console.table(clgRiskData)
    return riskOrganistionInfo
  }



  _headersTransform = item => {
    let i=0, newArr =[]
    item.map( elem => {
      newArr.push({
        key: i,
        fio: `${elem.sur_name} ${elem.first_name} ${elem.last_name}`,
        inn: elem.inn,
      })
      i++
      return newArr
    })
    return newArr
  };

  _arbiterTransform = item => {
    return item = [{
      key: '1',
      name: 'Истец',
      year: item.istec.year,
      year3: item.istec.year3,
    }, {
      key: '2',
      name: 'Ответчик',
      year: item.otvet.year,
      year3: item.otvet.year,
    }]
  };
}

export const trasform = new TransformData();
export default TransformData;