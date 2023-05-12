import {AiFillStar} from 'react-icons/ai'
import {GoLocation} from 'react-icons/go'
import {BsBriefcaseFill} from 'react-icons/bs'

import './index.css'

const SimilarJobs = props => {
  const {similarJobDetails} = props

  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    rating,
    title,
  } = similarJobDetails

  return (
    <li className="similar-job-card-container">
      <div className="job-role-container">
        <img
          className="company-logo"
          src={companyLogoUrl}
          alt="similar job company logo"
        />
        <div>
          <h1 className="job-title">{title}</h1>
          <div className="rating-container">
            <AiFillStar className="star-icon" />
            <p className="rating">{rating}</p>
          </div>
        </div>
      </div>

      <h1 className="desc-head">Description</h1>

      <p className="desc-para">{jobDescription}</p>

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
    </li>
  )
}

export default SimilarJobs
