import React from 'react'
import { useAuthStore } from '@/stores/authStore'
import RetailDashboard from './RetailDashboard'
import RestaurantDashboard from './RestaurantDashboard'
import HardwareDashboard from './HardwareDashboard'
import GroceryDashboard from './GroceryDashboard'
import ButcheryDashboard from './ButcheryDashboard'

const SolutionRouter: React.FC = () => {
  const { solutionType } = useAuthStore()

  const renderSolutionDashboard = () => {
    switch (solutionType) {
      case 'retail':
        return <RetailDashboard />
      case 'restaurant':
        return <RestaurantDashboard />
      case 'hardware':
        return <HardwareDashboard />
      case 'grocery':
        return <GroceryDashboard />
      case 'butchery':
        return <ButcheryDashboard />
      default:
        return <RetailDashboard />
    }
  }

  return (
    <div>
      {renderSolutionDashboard()}
    </div>
  )
}

export default SolutionRouter
