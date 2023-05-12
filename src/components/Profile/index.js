import Loader from 'react-loader-spinner'

import './index.css'

import {Component} from 'react'
import Cookies from 'js-cookie'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Profile extends Component {
  state = {
    profileObject: {},
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProfile()
  }

  onClickProfileRetry = () => {
    this.setState({profileObject: {}}, this.getProfile)
  }

  getProfile = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const fetchedData = await response.json()

      const updatedData = {
        name: fetchedData.profile_details.name,
        profileImageUrl: fetchedData.profile_details.profile_image_url,
        shortBio: fetchedData.profile_details.short_bio,
      }

      this.setState({
        profileObject: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 400 || response.status === 401) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderSuccessView = () => {
    const {profileObject} = this.state

    const {name, profileImageUrl, shortBio} = profileObject

    return (
      <div className="profile-container">
        <img className="profile" src={profileImageUrl} alt="profile" />
        <h1 className="name">{name}</h1>
        <p className="bio">{shortBio}</p>
      </div>
    )
  }

  renderFailureView = () => (
    <button
      data-testid="retryButton"
      type="button"
      className="logout-desktop-btn"
      onClick={this.onClickProfileRetry}
    >
      Retry
    </button>
  )

  renderLoadingView = () => (
    <div>
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  render() {
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
}

export default Profile
