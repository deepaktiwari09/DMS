import { AuthTabs } from '../../components/auth'
import { type LoginFormData, type RegisterFormData, type OrganizationFormData } from '../../types/schemas'

export interface AuthPageProps {
  onLogin?: (data: LoginFormData) => Promise<void> | void
  onRegister?: (data: RegisterFormData) => Promise<void> | void
  onCreateOrganization?: (data: OrganizationFormData) => Promise<void> | void
  onJoinOrganization?: (orgId: string) => Promise<void> | void
  onForgotPassword?: () => void
  isLoading?: boolean
  availableOrganizations?: Array<{ 
    id: string
    name: string 
    memberCount?: number 
  }>
}

export function AuthPage({
  onLogin,
  onRegister,
  onCreateOrganization,
  onJoinOrganization,
  onForgotPassword,
  isLoading = false,
  availableOrganizations = []
}: AuthPageProps) {
  return (
    <AuthTabs
      onLogin={onLogin}
      onRegister={onRegister}
      onCreateOrganization={onCreateOrganization}
      onJoinOrganization={onJoinOrganization}
      onForgotPassword={onForgotPassword}
      isLoading={isLoading}
      availableOrganizations={availableOrganizations}
    />
  )
}