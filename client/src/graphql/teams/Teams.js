/* eslint-disable no-unused-vars */
import gql from 'graphql-tag'

export const TEAMS_FRAGMENT = gql`
  fragment TeamsResponse on teams {
    id
    name
    slug
    owner
    status {
      status
      reason
      createdAt
    }
    createdAt
    profile {
      avatar
      description
      motto
      updatedAt
    }
    members {
      role
      email
      member {
        alias
        authId
      }
      status {
        id
        status
        reason
        createdAt
      }
    }
  }
`

export default TEAMS_FRAGMENT
