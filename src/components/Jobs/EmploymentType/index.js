import {Component} from 'react'

import './index.css'

class EmploymentType extends Component {
  state = {check: false}

  checkedState = () => {
    const {updateEmptype, typeDetails, activeTypes} = this.props
    const {employmentTypeId} = typeDetails

    const {check} = this.state
    if (check) {
      activeTypes.push(employmentTypeId)
      updateEmptype(activeTypes)
    } else {
      const func = element => element === employmentTypeId
      const index = activeTypes.findIndex(func)
      const newActiveTypes = activeTypes.slice(0, index)
      updateEmptype(newActiveTypes)
    }
  }

  onChangeCheckBox = () => {
    const {check} = this.state
    this.setState({check: !check}, this.checkedState)
  }

  render() {
    const {typeDetails} = this.props
    const {check} = this.state
    const {employmentTypeId, label, id} = typeDetails
    return (
      <li className="emp-type-list-container">
        <input
          className="box"
          type="checkbox"
          value={employmentTypeId}
          id={id}
          onChange={this.onChangeCheckBox}
          checked={check}
        />
        <label className="emp-label" htmlFor={id}>
          {label}
        </label>
      </li>
    )
  }
}

export default EmploymentType
