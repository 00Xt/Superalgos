import gql from 'graphql-tag'

const getUsersQuery = gql`
{
    users_Users {
      id
      alias
      firstName
      middleName
      lastName
      bio
      role {
        id
        name
      }
    }
}
`
const getUserProfileQuery = gql`
query($id: ID){
    users_User (id: $id){
      id
      alias
      firstName
      middleName
      lastName
      bio
      avatarHandle      
      role {
        id
        name
      }
    }
}
`
const getUserByAuthIdQuery = gql`
query($authId: String){
    users_UserByAuthId (authId: $authId){
      id
      referrerId
      alias
      firstName
      middleName
      lastName
      bio
      email
      emailVerified
      isDeveloper
      isDataAnalyst
      isTrader
      avatarHandle
      avatarChangeDate
      role {
        id
      }
    }
}
`
const getUsersBySearchFields = gql`
query(
  $alias: String,
  $firstName: String,
  $middleName: String,
  $lastName: String
){
    users_UsersSearch (alias: $alias, firstName: $firstName, middleName: $middleName, lastName: $lastName){
      id
      alias
      firstName
      middleName
      lastName
    }
}
`
const getDescendentsQuery = gql`
query(
  $id: String
){
    users_Descendents (id: $id){
      id
      alias
      firstName
      middleName
      lastName
      referrerId
      descendents {
            id
            alias
            firstName
            middleName
            lastName
            referrerId
            descendents {
                id
                alias
                firstName
                middleName
                lastName
                referrerId
      				}
      		}
    }
}
`
const getRolesQuery = gql`
{
    users_Roles {
      id
      name
    }
}
`
const updateUserMutation = gql`
mutation(
  $id: ID!,
  $firstName:String,
  $middleName:String,
  $lastName:String,
  $bio:String,
  $isDeveloper:Int,
  $isTrader:Int,
  $isDataAnalyst:Int,
  $roleId:String!
)
  {
    users_UpdateUser (
      id: $id,
      firstName:$firstName,
      middleName: $middleName,
      lastName: $lastName,
      bio: $bio,
      isDeveloper: $isDeveloper,
      isTrader: $isTrader,
      isDataAnalyst: $isDataAnalyst,
      roleId: $roleId
    )
    {
      id
      alias
    }
}
`
const updateReferrerMutation = gql`
mutation(
  $id: ID!,
  $referrerId:String!
)
  {
    users_UpdateUserReferrer (
      id: $id,
      referrerId:$referrerId
    )
    {
      id
      referrerId
    }
}
`
const updateUserImagesMutation = gql`
mutation(
  $id: ID!,
  $avatarHandle:String,
  $avatarChangeDate:String 
)
  {
    users_UpdateUserImages (
      id: $id,
      avatarHandle:$avatarHandle,
      avatarChangeDate: $avatarChangeDate 
    )
    {
      id
      alias
    }
}
`
export {
  getUsersQuery,
  getUserByAuthIdQuery,
  getRolesQuery,
  getUserProfileQuery,
  getUsersBySearchFields,
  getDescendentsQuery,
  updateUserMutation,
  updateReferrerMutation,
  updateUserImagesMutation
}
