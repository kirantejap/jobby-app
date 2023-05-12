import {v4 as uuidv4} from 'uuid'
import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import Profile from '../Profile'
import EmploymentType from './EmploymentType'
import SalaryRange from './SalaryRange'
import JobsList from './JobsList'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const salaryRangesList = [
  {
    id: uuidv4(),
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    id: uuidv4(),
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {id: uuidv4(), salaryRangeId: '3000000', label: '30 LPA and above'},
  {id: uuidv4(), salaryRangeId: '4000000', label: '40 LPA and above'},
]

const employmentTypesList = [
  {
    id: uuidv4(),
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    id: uuidv4(),
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    id: uuidv4(),
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    id: uuidv4(),
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

class Jobs extends Component {
  state = {
    jobsList: [],
    activeRange: '',
    searchInput: '',
    activeTypes: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobs()
  }

  getJobs = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const {activeTypes, activeRange, searchInput} = this.state
    const string = activeTypes.join(',')

    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${string}&minimum_package=${activeRange}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const fetchedData = await response.json()

      const updatedData = fetchedData.jobs.map(job => ({
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        id: job.id,
        jobDescription: job.job_description,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
        title: job.title,
      }))

      this.setState({
        jobsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    }

    if (response.status === 400 || response.status === 401) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onChangeSearch = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearch = () => {
    this.getJobs()
  }

  updateEmptype = typeList => {
    this.setState({activeTypes: typeList}, this.getJobs)
  }

  updateRange = RangeId => {
    this.setState({activeRange: RangeId}, this.getJobs)
  }

  renderLoadingView = () => (
    <div className="loading-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onClickRetry = () => this.getJobs()

  renderNoJobsView = () => (
    <div className="no-jobs-container">
      <img
        className="no-jobs-image"
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
      />
      <h1 className="no-jobs-head">No Jobs Found</h1>
      <p className="no-jobs-desc">
        We could not find any jobs. Try other filters
      </p>
    </div>
  )

  renderFailureView = () => {
    console.log('called')

    return (
      <div className="no-jobs-container">
        <img
          className="no-jobs-image"
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
        />
        <h1 className="no-jobs-head">Oops! Something Went Wrong</h1>
        <p className="no-jobs-desc">
          We cannot seem to find the page you are looking for.
        </p>
        <button
          data-testid="retryButton"
          type="button"
          className="logout-desktop-btn"
          onClick={this.onClickRetry}
        >
          Retry
        </button>
      </div>
    )
  }

  renderSuccessView = () => {
    const {jobsList} = this.state
    console.log(jobsList)

    if (jobsList.length !== 0) {
      return (
        <ul className="ul-jobsList-container">
          {jobsList.map(eachJob => (
            <JobsList jobDetails={eachJob} key={eachJob.id} />
          ))}
        </ul>
      )
    }

    return this.renderNoJobsView()
  }

  renderSwitchForJobs = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {
      jobsList,
      activeRange,
      activeTypes,
      searchInput,
      apiStatus,
    } = this.state
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="first-container">
            <Profile />
            <hr className="line" />

            <ul className="emp-type-container">
              <h1 className="sort-heading">Type of Employment</h1>
              {employmentTypesList.map(eachType => (
                <EmploymentType
                  updateEmptype={this.updateEmptype}
                  typeDetails={eachType}
                  activeTypes={activeTypes}
                  key={eachType.id}
                />
              ))}
            </ul>

            <hr className="line" />

            <ul className="emp-type-container">
              <h1 className="sort-heading">Salary Range</h1>
              {salaryRangesList.map(eachRange => (
                <SalaryRange
                  updateRange={this.updateRange}
                  rangeDetails={eachRange}
                  rangeValue={activeRange}
                  key={eachRange.id}
                />
              ))}
            </ul>
          </div>

          <div className="second-container">
            <div className="input-container">
              <input
                className="input-element"
                type="search"
                value={searchInput}
                placeholder="Search"
                onChange={this.onChangeSearch}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-btn"
                onClick={this.onClickSearch}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>

            {this.renderSwitchForJobs()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
