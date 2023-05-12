import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {AiFillStar} from 'react-icons/ai'
import {GoLocation} from 'react-icons/go'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiExternalLink} from 'react-icons/fi'

import Header from '../Header'
import Skills from './Skills'
import SimilarJobs from './SimilarJobs'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    activeJob: {},
    apiStatus: apiStatusConstants.initial,
    similarJobs: [],
  }

  componentDidMount() {
    this.getJob()
  }

  getJob = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const fetchedData = await response.json()

      const updatedSimilarJobs = fetchedData.similar_jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        rating: eachJob.rating,
        title: eachJob.title,
      }))

      const updatedSkills = fetchedData.job_details.skills.map(each => ({
        name: each.name,
        imageUrl: each.image_url,
      }))

      const updatedLife = {
        description: fetchedData.job_details.life_at_company.description,
        imageUrl: fetchedData.job_details.life_at_company.image_url,
      }

      const updatedJobData = {
        companyLogoUrl: fetchedData.job_details.company_logo_url,
        companyWebsiteUrl: fetchedData.job_details.company_website_url,
        employmentType: fetchedData.job_details.employment_type,
        id: fetchedData.job_details.id,
        jobDescription: fetchedData.job_details.job_description,
        location: fetchedData.job_details.location,
        packagePerAnnum: fetchedData.job_details.package_per_annum,
        rating: fetchedData.job_details.rating,
        skills: updatedSkills,
        title: fetchedData.job_details.title,
        lifeAtCompany: updatedLife,
      }
      console.log(updatedSimilarJobs)
      this.setState({
        activeJob: updatedJobData,
        apiStatus: apiStatusConstants.success,
        similarJobs: updatedSimilarJobs,
      })
    }

    if (response.status === 400 || response.status === 401) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderSuccessView = () => {
    const {activeJob, similarJobs} = this.state

    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      id,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      skills,
      title,
      lifeAtCompany,
    } = activeJob

    return (
      <div className="job-item-details-container">
        <div className="job-item-details-card">
          <div className="job-role-container">
            <img
              className="company-logo"
              src={companyLogoUrl}
              alt="job details company logo"
            />
            <div>
              <h1 className="job-title">{title}</h1>
              <div className="rating-container">
                <AiFillStar className="star-icon" />
                <p className="rating">{rating}</p>
              </div>
            </div>
          </div>

          <div className="location-type-salary-container">
            <div className="location-type-card">
              <div className="location-card">
                <GoLocation className="location-icon" />
                <p className="location-text">{location}</p>
              </div>

              <div className="location-card">
                <BsBriefcaseFill className="location-icon" />
                <p className="location-text">{employmentType}</p>
              </div>
            </div>

            <p className="package">{packagePerAnnum}</p>
          </div>

          <hr className="line" />

          <div className="desc-head-and-visit">
            <h1 className="job-item-desc">Description</h1>
            <div>
              <a className="visit" href={companyWebsiteUrl}>
                Visit
              </a>
              <FiExternalLink className="link-icon" />
            </div>
          </div>

          <p className="desc-para">{jobDescription}</p>
          <h1 className="job-item-desc">Skills</h1>
          <ul className="skills-container">
            {skills.map(eachSkill => (
              <Skills skillDetails={eachSkill} key={id} />
            ))}
          </ul>

          <h1 className="job-item-desc">Life at Company</h1>

          <div className="life-at-company-container">
            <p className="desc-para">{lifeAtCompany.description}</p>
            <img src={lifeAtCompany.imageUrl} alt="life at company" />
          </div>
        </div>

        <h1 className="job-item-desc">Similar Jobs</h1>
        <ul className="ul-similar-jobs-container">
          {similarJobs.map(eachSimilarJob => (
            <SimilarJobs
              similarJobDetails={eachSimilarJob}
              key={eachSimilarJob.id}
            />
          ))}
        </ul>
      </div>
    )
  }

  onClickRetry = () => this.getJob()

  renderLoadingView = () => (
    <div className="loading-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
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

  renderSwitch = () => {
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
    return (
      <>
        <Header />
        <div className="item-details-bg-container">{this.renderSwitch()}</div>
      </>
    )
  }
}

export default JobItemDetails
