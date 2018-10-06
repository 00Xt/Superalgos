/* eslint-disable no-unused-vars */
import gql from 'graphql-tag'

export const REMOVE_TEAM_MEMBER = gql`
  mutation removeTeamMember($teamId: String!, $memberId: String!) {
    removeTeamMember(teamId: $teamId, memberId: $memberId) {
      id
    }
  }
`

export default REMOVE_TEAM_MEMBER
