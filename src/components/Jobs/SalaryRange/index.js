import {Component} from 'react'

import './index.css'

class SalaryRange extends Component {
  onChangeRadio = () => {
    const {updateRange, rangeDetails} = this.props
    const {salaryRangeId} = rangeDetails

    updateRange(salaryRangeId)
  }

  render() {
    const {rangeDetails, rangeValue} = this.props
    const {salaryRangeId, label, id} = rangeDetails

    return (
      <li className="emp-type-list-container">
        <input
          className="box"
          type="radio"
          value={salaryRangeId}
          id={id}
          checked={rangeValue === salaryRangeId}
          onChange={this.onChangeRadio}
        />
        <label className="emp-label" htmlFor={id}>
          {label}
        </label>
      </li>
    )
  }
}

export default SalaryRange
