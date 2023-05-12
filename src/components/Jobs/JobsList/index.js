import {AiFillStar} from 'react-icons/ai'
import {GoLocation} from 'react-icons/go'
import {BsBriefcaseFill} from 'react-icons/bs'
import {Link} from 'react-router-dom'

import './index.css'

const JobsList = props => {
  const {jobDetails} = props

  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobDetails

  return (
    <Link className="link" to={`/jobs/${id}`}>
      <li className="job-card-container">
        <div className="job-role-container">
          <img
            className="company-logo"
            src={companyLogoUrl}
            alt="company logo"
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

          <h1 className="package">{packagePerAnnum}</h1>
        </div>

        <hr className="line" />

        <div className="description-container">
          <h1 className="desc-head">Description</h1>

          <p className="desc-para">{jobDescription}</p>
        </div>
      </li>
    </Link>
  )
}

export default JobsList
